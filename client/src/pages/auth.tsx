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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
        data-testid="auth-page"
      >
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <LogoText className="justify-center mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">
            Professional GST Management
          </h1>
          <p className="text-gray-600 mt-2">
            Secure enterprise platform for tax compliance
          </p>
        </div>

        {/* Authentication Card */}
        <Card className="professional-card shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-900">
              {isLogin ? "Sign In" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? "Access your FinSync dashboard" 
                : "Join FinSync Enterprise platform"
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={isLogin ? "login" : "register"} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger 
                  value="login" 
                  onClick={() => setIsLogin(true)}
                  data-testid="login-tab"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  onClick={() => setIsLogin(false)}
                  data-testid="register-tab"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Registration fields */}
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="pl-10 professional-input"
                          required={!isLogin}
                          data-testid="name-input"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                        Company Name
                      </Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="company"
                          type="text"
                          placeholder="Enter your company name"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          className="pl-10 professional-input"
                          required={!isLogin}
                          data-testid="company-input"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Email field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 professional-input"
                      required
                      data-testid="email-input"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 professional-input"
                      required
                      data-testid="password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      data-testid="toggle-password"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full professional-button mt-6"
                  data-testid="submit-button"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </Button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center text-sm text-gray-600">
                {isLogin ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setIsLogin(false)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
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
                      className="text-blue-600 hover:text-blue-700 font-medium"
                      data-testid="switch-to-login"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Security notice */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Secure enterprise platform • Data encrypted • GDPR compliant</p>
        </div>
      </motion.div>
    </div>
  );
}