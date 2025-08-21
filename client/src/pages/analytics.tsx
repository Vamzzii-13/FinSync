import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, FileText, Calendar, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Sample Indian GST analytics data
const monthlyGSTData = [
  { month: 'Apr 2024', cgst: 45000, sgst: 45000, igst: 25000, total: 115000 },
  { month: 'May 2024', cgst: 52000, sgst: 52000, igst: 18000, total: 122000 },
  { month: 'Jun 2024', cgst: 48000, sgst: 48000, igst: 32000, total: 128000 },
  { month: 'Jul 2024', cgst: 55000, sgst: 55000, igst: 28000, total: 138000 },
  { month: 'Aug 2024', cgst: 58000, sgst: 58000, igst: 35000, total: 151000 },
  { month: 'Sep 2024', cgst: 62000, sgst: 62000, igst: 41000, total: 165000 },
];

const gstTypeData = [
  { name: 'CGST', value: 35, color: '#059669' },
  { name: 'SGST', value: 35, color: '#3b82f6' },
  { name: 'IGST', value: 30, color: '#f59e0b' },
];

const complianceData = [
  { quarter: 'Q1 2024', onTime: 95, late: 5 },
  { quarter: 'Q2 2024', onTime: 98, late: 2 },
  { quarter: 'Q3 2024', onTime: 92, late: 8 },
  { quarter: 'Q4 2024', onTime: 96, late: 4 },
];

export default function AnalyticsPage() {
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
      data-testid="analytics-page"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          GST Analytics & Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Comprehensive analytics based on Indian GST compliance and tax trends
        </p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="professional-card gst-compliant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total GST Paid</p>
                <p className="text-3xl font-bold text-gray-900">₹8,19,000</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12.5% from last quarter
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="professional-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Returns Filed</p>
                <p className="text-3xl font-bold text-gray-900">24</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  96% on-time filing
                </p>
              </div>
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="professional-card gst-warning">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Tax Rate</p>
                <p className="text-3xl font-bold text-gray-900">18.2%</p>
                <p className="text-sm text-orange-600 flex items-center mt-1">
                  <Activity className="w-4 h-4 mr-1" />
                  Within industry norm
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="professional-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Input Tax Credit</p>
                <p className="text-3xl font-bold text-gray-900">₹1,45,200</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Optimally utilized
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly GST Trend */}
        <motion.div variants={itemVariants}>
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Monthly GST Collection Trend
              </CardTitle>
              <CardDescription>
                CGST, SGST, and IGST breakdown for the financial year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyGSTData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                  <Line type="monotone" dataKey="cgst" stroke="#059669" strokeWidth={2} name="CGST" />
                  <Line type="monotone" dataKey="sgst" stroke="#3b82f6" strokeWidth={2} name="SGST" />
                  <Line type="monotone" dataKey="igst" stroke="#f59e0b" strokeWidth={2} name="IGST" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* GST Distribution */}
        <motion.div variants={itemVariants}>
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                GST Type Distribution
              </CardTitle>
              <CardDescription>
                Distribution of tax types as per Indian GST structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gstTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {gstTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Compliance Tracking */}
        <motion.div variants={itemVariants}>
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Compliance Tracking
              </CardTitle>
              <CardDescription>
                On-time vs late filing performance by quarter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={complianceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="onTime" fill="#059669" name="On Time %" />
                  <Bar dataKey="late" fill="#dc2626" name="Late %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Industry Benchmarks */}
        <motion.div variants={itemVariants}>
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-600" />
                Industry Benchmarks
              </CardTitle>
              <CardDescription>
                Compare your GST performance with industry standards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg gst-compliant">
                <span className="font-medium">Filing Compliance</span>
                <span className="text-green-700 font-bold">96% (Industry: 92%)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Effective Tax Rate</span>
                <span className="text-blue-700 font-bold">18.2% (Industry: 18.8%)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg gst-warning">
                <span className="font-medium">ITC Utilization</span>
                <span className="text-orange-700 font-bold">87% (Industry: 85%)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg gst-compliant">
                <span className="font-medium">Return Accuracy</span>
                <span className="text-green-700 font-bold">98.5% (Industry: 96%)</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Insights and Recommendations */}
      <motion.div variants={itemVariants}>
        <Card className="professional-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              AI-Powered Insights & Recommendations
            </CardTitle>
            <CardDescription>
              Based on Indian GST regulations and your filing patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg gst-compliant">
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">Excellent Compliance Record</h4>
                <p className="text-sm text-green-700">Your 96% on-time filing rate exceeds industry standards. Consider applying for GST Compliance Rating.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">ITC Optimization Opportunity</h4>
                <p className="text-sm text-blue-700">You can claim additional ₹12,000 in Input Tax Credit by reviewing pending invoices from September.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg gst-warning">
              <Calendar className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-800">Upcoming Deadline Alert</h4>
                <p className="text-sm text-orange-700">GSTR-3B for October 2024 is due on November 20th. Prepare early to maintain compliance record.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}