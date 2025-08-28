import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, CheckCircle, AlertCircle, Building2, Calendar, Search } from "lucide-react";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { useAuth } from "@/hooks/use-auth";

export default function GovtUploadPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState("login"); // login, dashboard, returns, upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [returnData, setReturnData] = useState({
    financialYear: "2024-25",
    quarter: "Quarter 2 (Jul - Sep)",
    period: "September"
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleLogin = () => {
    if (!loginData.username || !loginData.password) {
      toast({
        title: "Login Failed",
        description: "Please enter both username and password",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentStep("dashboard");
    toast({
      title: "Login Successful",
      description: "Welcome to GST Portal"
    });
  };

  const handleSearch = () => {
    setCurrentStep("returns");
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setSelectedFile(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select an Excel file (.xlsx)",
        variant: "destructive"
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus("uploading");
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus("success");
          toast({
            title: "Upload Successful",
            description: "Your GST return has been successfully uploaded to the government portal"
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const renderGovernmentInterface = () => {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Government Header */}
        <header className="bg-blue-900 text-white p-4">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Goods and Services Tax</h1>
                <p className="text-sm">Government of India, States and Union Territories</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm">REGISTER</Button>
              <Button variant="outline" size="sm" className="text-blue-900">LOGIN</Button>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-blue-700 text-white">
          <div className="max-w-7xl mx-auto">
            <ul className="flex justify-center space-x-8 py-2 text-sm">
              <li><a href="#" className="hover:bg-blue-800 px-3 py-2 rounded-md">Home</a></li>
              <li><a href="#" className="hover:bg-blue-800 px-3 py-2 rounded-md">Services</a></li>
              <li><a href="#" className="hover:bg-blue-800 px-3 py-2 rounded-md">GST Law</a></li>
              <li><a href="#" className="hover:bg-blue-800 px-3 py-2 rounded-md">Downloads</a></li>
              <li><a href="#" className="hover:bg-blue-800 px-3 py-2 rounded-md">Search Taxpayer</a></li>
            </ul>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-6">
          {/* Login Step */}
          {currentStep === "login" && (
            <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
              <div className="text-sm text-gray-600 mb-4">
                <span className="text-blue-600">Home</span> &gt; <span>Login</span>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>* indicates mandatory fields</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="gov-username">Username <span className="text-red-500">*</span></Label>
                    <Input
                      id="gov-username"
                      placeholder="Enter Username"
                      value={loginData.username}
                      onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gov-password">Password <span className="text-red-500">*</span></Label>
                    <Input
                      id="gov-password"
                      type="password"
                      placeholder="Enter Password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleLogin} className="bg-blue-700 hover:bg-blue-800">
                    LOGIN
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Dashboard Step */}
          {currentStep === "dashboard" && (
            <motion.div variants={itemVariants}>
              <div className="bg-gray-100 p-3 mb-4 rounded-md flex justify-between items-center">
                <span className="font-semibold text-gray-700">Dashboard &gt; Returns</span>
                <span className="text-sm text-gray-600">🇬🇧 English</span>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-700">File Returns</CardTitle>
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 text-sm rounded-md">
                    GSTR-2A can now be downloaded in excel/CSV
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-600 mb-6 text-right">* Indicates Mandatory Fields</p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                      <Label>Financial Year <span className="text-red-500">*</span></Label>
                      <Select value={returnData.financialYear} onValueChange={(value) => setReturnData(prev => ({ ...prev, financialYear: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024-25">2024-25</SelectItem>
                          <SelectItem value="2023-24">2023-24</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Quarter <span className="text-red-500">*</span></Label>
                      <Select value={returnData.quarter} onValueChange={(value) => setReturnData(prev => ({ ...prev, quarter: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Quarter 1 (Apr - Jun)">Quarter 1 (Apr - Jun)</SelectItem>
                          <SelectItem value="Quarter 2 (Jul - Sep)">Quarter 2 (Jul - Sep)</SelectItem>
                          <SelectItem value="Quarter 3 (Oct - Dec)">Quarter 3 (Oct - Dec)</SelectItem>
                          <SelectItem value="Quarter 4 (Jan - Mar)">Quarter 4 (Jan - Mar)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Period <span className="text-red-500">*</span></Label>
                      <Select value={returnData.period} onValueChange={(value) => setReturnData(prev => ({ ...prev, period: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="July">July</SelectItem>
                          <SelectItem value="August">August</SelectItem>
                          <SelectItem value="September">September</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSearch} className="bg-blue-700 hover:bg-blue-800">
                      <Search className="w-4 h-4 mr-2" />
                      SEARCH
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Returns Step */}
          {currentStep === "returns" && (
            <motion.div variants={itemVariants}>
              <div className="bg-gray-100 p-3 mb-4 rounded-md">
                <span className="font-semibold text-gray-700">Dashboard &gt; Returns &gt; September</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="shadow-md">
                  <CardHeader className="bg-blue-900 text-white">
                    <CardTitle className="text-sm">Details of outward supplies of goods or services</CardTitle>
                    <CardDescription className="text-gray-200">GSTR1</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="mb-4">
                      <span className="font-semibold">Status-</span> 
                      <Badge variant="destructive" className="ml-2">Not Filed</Badge>
                    </p>
                    <Button 
                      onClick={() => setCurrentStep("upload")} 
                      className="w-full bg-blue-700 hover:bg-blue-800"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      UPLOAD
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader className="bg-blue-900 text-white">
                    <CardTitle className="text-sm">Details of inward supplies liable to reverse charge</CardTitle>
                    <CardDescription className="text-gray-200">GSTR2</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="mb-4">
                      <span className="font-semibold">Status-</span> 
                      <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">Filed</Badge>
                    </p>
                    <Button disabled className="w-full">
                      FILED
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader className="bg-blue-900 text-white">
                    <CardTitle className="text-sm">Monthly return</CardTitle>
                    <CardDescription className="text-gray-200">GSTR3B</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="mb-4">
                      <span className="font-semibold">Status-</span> 
                      <Badge variant="destructive" className="ml-2">Not Filed</Badge>
                    </p>
                    <Button className="w-full bg-blue-700 hover:bg-blue-800">
                      <Upload className="w-4 h-4 mr-2" />
                      UPLOAD
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Upload Step */}
          {currentStep === "upload" && (
            <motion.div variants={itemVariants}>
              <div className="bg-gray-100 p-3 mb-4 rounded-md">
                <span className="font-semibold text-gray-700">Dashboard &gt; Returns &gt; September &gt; GSTR1 Upload</span>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Upload GSTR1 Return</CardTitle>
                  <CardDescription>Upload your Excel file containing GST return details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="file-upload">Select Excel File</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileSelect}
                      className="mt-2"
                    />
                    {selectedFile && (
                      <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                        <FileText className="w-4 h-4" />
                        <span>{selectedFile.name}</span>
                      </div>
                    )}
                  </div>

                  {uploadStatus === "uploading" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {uploadStatus === "success" && (
                    <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
                      <CheckCircle className="w-5 h-5" />
                      <span>File uploaded successfully! Your return has been submitted to the GST portal.</span>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button 
                      onClick={handleUpload} 
                      disabled={!selectedFile || uploadStatus === "uploading"}
                      className="bg-blue-700 hover:bg-blue-800"
                    >
                      {uploadStatus === "uploading" ? "Uploading..." : "SUBMIT RETURN"}
                    </Button>
                    <Button variant="outline" onClick={() => setCurrentStep("returns")}>
                      BACK
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex"
    >
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Government Upload"
          description="Upload GST returns to government portal"
          icon={<Upload className="w-8 h-8 text-white" />}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <motion.div variants={itemVariants} className="max-w-7xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  <span>GST Government Portal Simulation</span>
                </CardTitle>
                <CardDescription>
                  Simulate the government GST portal upload process for your generated Excel reports
                </CardDescription>
              </CardHeader>
            </Card>

            {renderGovernmentInterface()}
          </motion.div>
        </main>
      </div>
    </motion.div>
  );
}