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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-600 to-purple-700">
        <div className="absolute inset-0 bg-gradient-to-tl from-purple-600/30 via-blue-500/20 to-cyan-400/30 animate-gradient-slow"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-800/40 via-transparent to-purple-600/40 animate-gradient-reverse"></div>
      </div>
      
      {/* Animated Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      {/* Glass Morphism Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
        data-testid="auth-page"
      >
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <LogoText className="justify-center mb-4" />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl font-bold text-white drop-shadow-lg"
          >
            Professional GST Management
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-blue-100 mt-2 text-lg"
          >
            Secure enterprise platform for tax compliance
          </motion.p>
        </div>

        {/* Glass Morphism Authentication Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card className="glass-card backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <CardTitle className="text-2xl text-white font-semibold">
                  {isLogin ? "Welcome Back" : "Join FinSync"}
                </CardTitle>
                <CardDescription className="text-blue-100 mt-2">
                  {isLogin 
                    ? "Access your professional dashboard" 
                    : "Create your enterprise account"
                  }
                </CardDescription>
              </motion.div>
            </CardHeader>

          <CardContent>
            <Tabs value={isLogin ? "login" : "register"} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/10 backdrop-blur-sm border-white/20">
                <TabsTrigger 
                  value="login" 
                  onClick={() => setIsLogin(true)}
                  data-testid="login-tab"
                  className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  onClick={() => setIsLogin(false)}
                  data-testid="register-tab"
                  className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
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
                      <Label htmlFor="name" className="text-sm font-medium text-white">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-blue-200" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="pl-10 glass-input bg-white/10 border-white/20 text-white placeholder-blue-200"
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
                      <Label htmlFor="company" className="text-sm font-medium text-white">
                        Company Name
                      </Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-blue-200" />
                        <Input
                          id="company"
                          type="text"
                          placeholder="Enter your company name"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          className="pl-10 glass-input bg-white/10 border-white/20 text-white placeholder-blue-200"
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
                  <Label htmlFor="email" className="text-sm font-medium text-white">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-200" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 glass-input bg-white/10 border-white/20 text-white placeholder-blue-200"
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
                  <Label htmlFor="password" className="text-sm font-medium text-white">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-200" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 glass-input bg-white/10 border-white/20 text-white placeholder-blue-200"
                      required
                      data-testid="password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-blue-200 hover:text-white transition-colors"
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
                    className="w-full mt-6 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    data-testid="submit-button"
                  >
                    {isLogin ? "Sign In" : "Create Account"}
                  </Button>
                </motion.div>
              </form>

              {/* Footer */}
              <motion.div 
                className="mt-6 text-center text-sm text-blue-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                {isLogin ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setIsLogin(false)}
                      className="text-white hover:text-blue-200 font-medium underline underline-offset-2 transition-colors"
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
                      className="text-white hover:text-blue-200 font-medium underline underline-offset-2 transition-colors"
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
          className="mt-6 text-center text-xs text-blue-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          <p>🔒 Secure enterprise platform • 256-bit encryption • GDPR compliant</p>
        </motion.div>
      </motion.div>
    </div>
  );
}