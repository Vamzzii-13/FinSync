import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileSpreadsheet, Calendar, Package, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { DownloadHistory } from "@shared/schema";

export default function ReportsPage() {
  const { data: reports = [], isLoading } = useQuery<DownloadHistory[]>({
    queryKey: ["/api/download-history"],
  });

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
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
      data-testid="reports-page"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Reports & Downloads
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Access and manage your generated GST reports and Excel exports
          </p>
        </div>
        <Button 
          onClick={handleDownload}
          className="professional-button flex items-center gap-2"
          data-testid="download-latest-button"
        >
          <Download className="w-4 h-4" />
          Download Latest
        </Button>
      </motion.div>

      {/* Statistics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="professional-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-blue-600">{reports.length}</p>
              </div>
              <FileSpreadsheet className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="professional-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-green-600">
                  {reports.reduce((sum, r) => sum + parseInt(r.invoicesCount || "0"), 0)}
                </p>
              </div>
              <Package className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="professional-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Size</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(reports.reduce((sum, r) => sum + parseInt(r.fileSize || "0"), 0) / 1024)} KB
                </p>
              </div>
              <Download className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="professional-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-orange-600">
                  {reports.filter(r => r.downloadedAt && 
                    new Date(r.downloadedAt).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reports List */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Download History
        </h2>
        
        {reports.length === 0 ? (
          <Card className="professional-card">
            <CardContent className="p-8 text-center">
              <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Generated</h3>
              <p className="text-gray-600 mb-4">
                Start by uploading invoices to generate your first GST report
              </p>
              <Button onClick={handleDownload} className="professional-button">
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <motion.div
                key={report.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                className="professional-card p-6"
                data-testid={`report-${report.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <FileSpreadsheet className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {report.filename}
                        </h3>
                        <Badge className="bg-green-100 text-green-800">
                          {report.fileType.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center">
                          <Package className="w-4 h-4 mr-1" />
                          {report.invoicesCount} invoices processed
                        </span>
                        <span className="flex items-center">
                          <Download className="w-4 h-4 mr-1" />
                          {report.fileSize ? Math.round(parseInt(report.fileSize) / 1024) : 0} KB
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {report.downloadedAt ? 
                            format(new Date(report.downloadedAt), "dd MMM yyyy 'at' HH:mm") 
                            : "Unknown date"
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleDownload}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Export Options */}
      <motion.div variants={itemVariants}>
        <Card className="professional-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              Export Options
            </CardTitle>
            <CardDescription>
              Additional export formats and bulk operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <FileSpreadsheet className="w-6 h-6 text-green-600" />
                <span className="font-medium">Excel Format</span>
                <span className="text-xs text-gray-500">Detailed GST breakdown</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                <span className="font-medium">CSV Format</span>
                <span className="text-xs text-gray-500">Raw data export</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <FileSpreadsheet className="w-6 h-6 text-purple-600" />
                <span className="font-medium">PDF Report</span>
                <span className="text-xs text-gray-500">Summary format</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}