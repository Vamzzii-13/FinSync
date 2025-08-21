import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogoText } from "@/components/ui/logo";
import { Mail, Lock, User, Building, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    company: ""
  });
  const { login, register } = useAuth();
  const { toast } = useToast();

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast({
          title: "Login Successful",
          description: "Welcome to FinSync Enterprise",
        });
      } else {
        await register(formData);
        toast({
          title: "Registration Successful", 
          description: "Your account has been created successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side - FinSync Branding */}
      <div className="flex-1 relative overflow-hidden">
        {/* Professional Fintech Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900">
          <div className="absolute inset-0 bg-gradient-to-tl from-blue-800/60 via-violet-700/40 to-cyan-600/30 animate-gradient-flow"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-800/50 via-transparent to-teal-700/40 animate-gradient-wave"></div>
        </div>
        
        {/* Flowing Wave Patterns */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg">
              <path className="animate-wave-flow" fill="url(#gradient1)" d="M0,400 C200,300 400,200 600,250 C800,300 1000,350 1200,300 C1400,250 1440,200 1440,200 L1440,900 L0,900 Z"/>
              <path className="animate-wave-reverse" fill="url(#gradient2)" d="M0,500 C300,400 600,300 900,350 C1200,400 1440,450 1440,450 L1440,900 L0,900 Z"/>
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
                  <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.1"/>
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.2"/>
                  <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-cyan-400 rotate-45 animate-geometric-float"></div>
          <div className="absolute top-2/3 right-1/3 w-24 h-24 border border-blue-400 rotate-12 animate-geometric-pulse"></div>
          <div className="absolute bottom-1/4 left-1/2 w-20 h-20 border border-violet-400 -rotate-12 animate-geometric-drift"></div>
        </div>
        
        {/* Futuristic Lighting Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/6 w-80 h-80 bg-gradient-radial from-blue-500/20 via-blue-500/10 to-transparent rounded-full blur-2xl animate-glow-pulse"></div>
          <div className="absolute bottom-1/3 right-1/6 w-96 h-96 bg-gradient-radial from-violet-500/15 via-violet-500/8 to-transparent rounded-full blur-3xl animate-glow-drift"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-radial from-cyan-400/12 via-cyan-400/6 to-transparent rounded-full blur-2xl animate-glow-rotate"></div>
        </div>

        {/* Branding Content */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full px-16 py-12 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <LogoText className="justify-center mb-8 scale-125" />
          </motion.div>
          
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-10"
          >
            <h1 className="text-5xl text-white mb-4 aesthetic-display tracking-tight">
              Enterprise GST
            </h1>
            <h2 className="text-4xl text-cyan-300 aesthetic-heading tracking-tight">
              Compliance Suite
            </h2>
          </motion.div>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-slate-200 mb-12 max-w-lg text-center aesthetic-light leading-relaxed"
          >
            Automate GST compliance with intelligent invoice processing, real-time validation, and comprehensive reporting
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col space-y-5 text-base text-slate-300 aesthetic-body max-w-sm"
          >
            <div className="flex items-center justify-start space-x-4">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="text-left">Automated GST Return Filing</span>
            </div>
            <div className="flex items-center justify-start space-x-4">
              <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="text-left">Real-time Tax Compliance</span>
            </div>
            <div className="flex items-center justify-start space-x-4">
              <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="text-left">AI-Powered Invoice Processing</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Panel */}
      <div className="w-96 bg-white relative overflow-hidden shadow-2xl border-l border-slate-200">
        {/* Subtle Right Panel Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30"></div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col justify-center h-full p-8"
          data-testid="auth-page"
        >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl text-gray-900 mb-3 aesthetic-heading tracking-tight"
          >
            {isLogin ? "Welcome Back" : "Get Started"}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-600 aesthetic-light text-base"
          >
            {isLogin 
              ? "Sign in to access your dashboard" 
              : "Create your FinSync account"
            }
          </motion.p>
        </div>

        {/* Authentication Form */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-0">

            <Tabs value={isLogin ? "login" : "register"} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1">
                <TabsTrigger 
                  value="login" 
                  onClick={() => setIsLogin(true)}
                  data-testid="login-tab"
                  className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 aesthetic-body py-3"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  onClick={() => setIsLogin(false)}
                  data-testid="register-tab"
                  className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 aesthetic-body py-3"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Registration fields */}
                {!isLogin && (
                  <>
                    <motion.div 
                      className="space-y-2"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      <Label htmlFor="name" className="text-sm text-gray-700 aesthetic-body mb-2 block">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="pl-11 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 aesthetic-light"
                          required={!isLogin}
                          data-testid="name-input"
                        />
                      </div>
                    </motion.div>

                    <motion.div 
                      className="space-y-2"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <Label htmlFor="company" className="text-sm text-gray-700 aesthetic-body mb-2 block">
                        Company Name
                      </Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="company"
                          type="text"
                          placeholder="Enter your company name"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          className="pl-11 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 aesthetic-light"
                          required={!isLogin}
                          data-testid="company-input"
                        />
                      </div>
                    </motion.div>
                  </>
                )}

                {/* Email field */}
                <motion.div 
                  className="space-y-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: isLogin ? 0.7 : 0.9 }}
                >
                  <Label htmlFor="email" className="text-sm text-gray-700 aesthetic-body mb-2 block">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-11 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 aesthetic-light"
                      required
                      data-testid="email-input"
                    />
                  </div>
                </motion.div>

                {/* Password field */}
                <motion.div 
                  className="space-y-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: isLogin ? 0.8 : 1.0 }}
                >
                  <Label htmlFor="password" className="text-sm text-gray-700 aesthetic-body mb-2 block">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-11 pr-11 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 aesthetic-light"
                      required
                      data-testid="password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      data-testid="toggle-password"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </motion.div>

                {/* Submit button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <Button
                    type="submit"
                    className="w-full mt-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg aesthetic-button"
                    data-testid="submit-button"
                  >
                    {isLogin ? "Sign In" : "Create Account"}
                  </Button>
                </motion.div>
              </form>

              {/* Footer */}
              <motion.div 
                className="mt-8 text-center text-sm text-gray-600 aesthetic-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                {isLogin ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setIsLogin(false)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      data-testid="switch-to-register"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setIsLogin(true)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      data-testid="switch-to-login"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </motion.div>
            </Tabs>
          </CardContent>
        </Card>
        </motion.div>

        {/* Security notice */}
        <motion.div 
          className="mt-10 text-center text-xs text-gray-500 aesthetic-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          <p className="tracking-wide">🔒 Secure enterprise platform • 256-bit encryption • GDPR compliant</p>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
}