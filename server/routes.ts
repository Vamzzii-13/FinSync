import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertInvoiceSchema, insertUploadedFileSchema, insertDownloadHistorySchema } from "@shared/schema";
import multer from "multer";
import { z } from "zod";
import { createProxyMiddleware } from "http-proxy-middleware";
import fs from "fs";
import path from "path";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Excel, and CSV files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // GST extraction endpoint - direct Python integration
  app.post('/api/extract-gst', upload.array('files'), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }
      
      // Save uploaded files temporarily
      const tempFiles: string[] = [];
      for (const file of files) {
        const tempPath = `temp_uploads/${Date.now()}_${file.originalname}`;
        await import('fs').then(fs => 
          fs.promises.writeFile(tempPath, file.buffer)
        );
        tempFiles.push(tempPath);
      }
      
      // Process files with Python backend
      const { spawn } = await import('child_process');
      const pythonProcess = spawn('python', [
        'python_backend/simple_server.py',
        ...tempFiles
      ], {
        cwd: process.cwd(),
        env: { ...process.env, PYTHONPATH: 'python_backend' }
      });
      
      let output = '';
      let errorOutput = '';
      
      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      pythonProcess.on('close', async (code) => {
        // Cleanup temp files
        for (const tempFile of tempFiles) {
          try {
            await import('fs').then(fs => fs.promises.unlink(tempFile));
          } catch (e) {
            console.log('Failed to cleanup temp file:', tempFile);
          }
        }
        
        console.log('Python process output:', output);
        console.log('Python process errors:', errorOutput);
        
        if (code === 0) {
          try {
            // Look for the JSON result in the output
            const resultMatch = output.match(/\[RESULT\]\s*({.*})/);
            if (resultMatch) {
              const result = JSON.parse(resultMatch[1]);
              res.json({
                success: result.success,
                message: result.message,
                download_url: result.success ? '/api/download-excel' : null,
                invoices_count: result.invoices_count
              });
            } else {
              // Fallback: try to parse the entire output as JSON
              const result = JSON.parse(output.trim());
              res.json({
                success: result.success,
                message: result.message,
                download_url: result.success ? '/api/download-excel' : null,
                invoices_count: result.invoices_count
              });
            }
          } catch (e) {
            console.error('Failed to parse Python output:', e);
            res.status(500).json({ 
              error: 'Failed to parse Python output',
              debug: { output, errorOutput }
            });
          }
        } else {
          console.error('Python process error:', errorOutput);
          res.status(500).json({ error: 'Failed to process files' });
        }
      });
      
    } catch (error) {
      console.error('GST extraction error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Download Excel file endpoint
  app.get('/api/download-excel', async (req, res) => {
    const excelPath = path.join(process.cwd(), 'python_backend/output/Consolidated_Invoices_Output.xlsx');
    
    // Check if file exists
    if (fs.existsSync(excelPath)) {
      try {
        // Get file stats for size
        const stats = fs.statSync(excelPath);
        
        // Create download history entry (using demo user for now)
        await storage.createDownloadHistory({
          userId: 'user-1', // Demo user ID
          filename: 'GST_Invoices_Extract.xlsx',
          fileType: 'excel',
          invoicesCount: '1', // This could be dynamic based on actual count
          fileSize: stats.size.toString(),
        });

        res.download(excelPath, 'GST_Invoices_Extract.xlsx', (err) => {
          if (err) {
            console.error('Download error:', err);
            res.status(500).json({ error: 'Failed to download file' });
          }
        });
      } catch (error) {
        console.error('Error creating download history:', error);
        // Still allow download even if history creation fails
        res.download(excelPath, 'GST_Invoices_Extract.xlsx');
      }
    } else {
      console.error('Excel file not found at:', excelPath);
      res.status(404).json({ error: 'Excel file not found' });
    }
  });

  // Download history routes
  app.get("/api/download-history", async (req, res) => {
    try {
      // Using demo user for now - in real app, get from session
      const downloads = await storage.getDownloadHistory('user-1');
      res.json(downloads);
    } catch (error) {
      console.error('Error fetching download history:', error);
      res.status(500).json({ error: 'Failed to fetch download history' });
    }
  });

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Don't send password in response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      
      // Don't send password in response
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Dashboard stats routes
  app.get("/api/dashboard/stats/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      const gstReturns = await storage.getGstReturns(userId);
      const invoices = await storage.getInvoices(userId);
      const uploadedFiles = await storage.getUploadedFiles(userId);
      
      const stats = {
        totalGstCollection: invoices.reduce((sum, inv) => sum + parseFloat(inv.taxAmount || "0"), 0),
        processedReturns: gstReturns.filter(ret => ret.status === "Filed").length,
        pendingActions: gstReturns.filter(ret => ret.status === "Pending").length,
        complianceScore: Math.round((gstReturns.filter(ret => ret.status === "Filed").length / Math.max(gstReturns.length, 1)) * 100),
        recentInvoices: invoices.slice(0, 5),
        uploadedFilesCount: uploadedFiles.length
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // GST Returns routes
  app.get("/api/gst-returns/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const gstReturns = await storage.getGstReturns(userId);
      res.json(gstReturns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch GST returns" });
    }
  });

  // Invoice routes
  app.get("/api/invoices/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const invoices = await storage.getInvoices(userId);
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  app.post("/api/invoices", async (req, res) => {
    try {
      const invoiceData = insertInvoiceSchema.extend({
        userId: z.string()
      }).parse(req.body);
      
      const invoice = await storage.createInvoice(invoiceData);
      res.status(201).json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });

  // File upload routes
  app.post("/api/files/upload", upload.array('files'), async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploadedFiles = [];
      
      for (const file of files) {
        const fileData = {
          userId,
          fileName: file.originalname,
          fileSize: file.size.toString(),
          fileType: file.mimetype,
          extractedData: JSON.stringify({
            // Mock extracted data - in real implementation, this would use OCR/AI
            invoiceNumber: `INV-${Date.now()}`,
            amount: "50000",
            taxAmount: "9000",
            gstin: "29AABCT1332L000",
            hsnCode: "8517"
          })
        };
        
        const uploadedFile = await storage.createUploadedFile(fileData);
        
        // Simulate processing time
        setTimeout(async () => {
          await storage.updateUploadedFile(uploadedFile.id, { status: "completed" });
        }, 2000);
        
        uploadedFiles.push(uploadedFile);
      }

      res.status(201).json({ files: uploadedFiles });
    } catch (error) {
      res.status(500).json({ message: "File upload failed" });
    }
  });

  app.get("/api/files/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const files = await storage.getUploadedFiles(userId);
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch uploaded files" });
    }
  });

  // Chart data routes
  app.get("/api/charts/gst-trends/:userId", async (req, res) => {
    try {
      // Mock GST trend data - in real implementation, this would aggregate from database
      const trendData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [180000, 210000, 245000, 220000, 270000, 295000]
      };
      res.json(trendData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch GST trend data" });
    }
  });

  app.get("/api/charts/compliance/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const gstReturns = await storage.getGstReturns(userId);
      
      const completed = gstReturns.filter(ret => ret.status === "Filed").length;
      const pending = gstReturns.filter(ret => ret.status === "Pending").length;
      const overdue = gstReturns.filter(ret => ret.status === "Overdue").length;
      
      const complianceData = {
        labels: ['Completed', 'Pending', 'Overdue'],
        data: [completed, pending, overdue]
      };
      
      res.json(complianceData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch compliance data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
