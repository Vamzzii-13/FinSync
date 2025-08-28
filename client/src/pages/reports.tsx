import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileSpreadsheet, Calendar, Package, Trash2, FileBarChart, Upload } from "lucide-react";
import { format } from "date-fns";
import type { DownloadHistory } from "@shared/schema";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { useLocation } from "wouter";

export default function ReportsPage() {
  const { data: reports = [], isLoading } = useQuery<DownloadHistory[]>({
    queryKey: ["/api/download-history"],
  });
  const [, setLocation] = useLocation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/download-excel');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'GST_Invoices_Extract.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        // Refresh the reports list after download
        window.location.reload();
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/download-history/${reportId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Refresh the reports list
        window.location.reload();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-gray-50/50">
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen">
          <Header 
            title="Reports"
            subtitle="Download and manage your generated GST Excel documents."
            icon={<FileBarChart className="w-7 h-7 text-white" />}
          />
          <div className="p-6 space-y-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex bg-gray-50/50"
      data-testid="reports-page"
    >
      <Sidebar />
      
      <main className="flex-1 ml-64 min-h-screen">
        <Header 
          title="Reports"
          subtitle="Download and manage your generated GST Excel documents."
          icon={<FileBarChart className="w-6 h-6 text-blue-600" />}
        />
        
        <motion.div
          variants={containerVariants}
          className="p-6 space-y-6"
          data-testid="reports-content"
        >


      {/* Statistics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="professional-card border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Excel Reports</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{reports.length}</p>
                <p className="text-xs text-gray-500 mt-1">Generated from invoice uploads</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileSpreadsheet className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="professional-card border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Invoices Processed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {reports.reduce((sum, r) => sum + parseInt(r.invoicesCount || "0"), 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Across all reports</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Package className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="professional-card border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Storage Used</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {Math.round(reports.reduce((sum, r) => sum + parseInt(r.fileSize || "0"), 0) / 1024)} KB
                </p>
                <p className="text-xs text-gray-500 mt-1">Total file size</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Download className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Excel Documents List */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Generated Excel Documents
          </h2>
          {reports.length > 0 && (
            <p className="text-sm text-gray-500">
              {reports.length} document{reports.length !== 1 ? 's' : ''} available
            </p>
          )}
        </div>
        
        {reports.length === 0 ? (
          <Card className="professional-card">
            <CardContent className="p-12 text-center">
              <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <FileSpreadsheet className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">No Excel Documents Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Upload invoices through the "Invoice Upload" section to generate Excel reports. They will appear here for download and management.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-lg mx-auto">
                <p className="text-sm text-blue-800">
                  <strong>Next Steps:</strong> Go to Invoice Upload → Upload files → Excel documents will be generated and saved here
                </p>
              </div>
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={() => setLocation('/govt-upload')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload to Government Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <motion.div
                key={report.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01, y: -2 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
                data-testid={`report-${report.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <FileSpreadsheet className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {report.filename}
                        </h3>
                        <Badge className="bg-green-100 text-green-800 px-3 py-1">
                          EXCEL
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Package className="w-4 h-4 mr-2 text-green-500" />
                          <span className="font-medium">{report.invoicesCount}</span>
                          <span className="ml-1">invoices</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Download className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="font-medium">{report.fileSize ? Math.round(parseInt(report.fileSize) / 1024) : 0}</span>
                          <span className="ml-1">KB</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                          <span className="font-medium">
                            {report.downloadedAt ? 
                              format(new Date(report.downloadedAt), "dd MMM yyyy")
                              : "Unknown"
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleDownload}
                      className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setLocation('/govt-upload')}
                      className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload to Govt
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                      onClick={() => handleDeleteReport(report.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

        </motion.div>
      </main>
    </motion.div>
  );
}