import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogoText } from "@/components/ui/logo";
import { Mail, Lock, User, Building, Eye, EyeOff, Check, AlertCircle, Loader2, Shield, Zap, Star } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    company: ""
  });
  const { login, register } = useAuth();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const dynamicTexts = [
    "Enterprise GST\nCompliance Suite",
    "AI-Powered\nTax Automation",
    "Real-time\nCompliance Tracking",
    "Smart Invoice\nProcessing"
  ];

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);

    // Dynamic text rotation
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % dynamicTexts.length);
    }, 4000);

    return () => clearInterval(textInterval);
  }, []);

  // Real-time validation
  const validateField = (field: string, value: string) => {
    const errors: {[key: string]: string} = {};
    
    switch (field) {
      case 'email':
        if (!value) {
          errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Invalid email format';
        }
        break;
      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        }
        break;
      case 'name':
        if (!isLogin && !value) {
          errors.name = 'Full name is required';
        }
        break;
      case 'company':
        if (!isLogin && !value) {
          errors.company = 'Company name is required';
        }
        break;
    }
    
    setFormErrors(prev => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  // Check if field is valid
  const isFieldValid = (field: string, value: string) => {
    switch (field) {
      case 'email':
        return value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'password':
        return value && value.length >= 6;
      case 'name':
        return !isLogin ? value.length > 0 : true;
      case 'company':
        return !isLogin ? value.length > 0 : true;
      default:
        return false;
    }
  };

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
    setIsLoading(true);
    
    // Validate all fields
    const emailValid = validateField('email', formData.email);
    const passwordValid = validateField('password', formData.password);
    const nameValid = isLogin || validateField('name', formData.name);
    const companyValid = isLogin || validateField('company', formData.company);
    
    if (!emailValid || !passwordValid || !nameValid || !companyValid) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear previous error and validate
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Real-time validation for better UX
    if (value) {
      validateField(field, value);
    }
  };

  const handleFieldFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleFieldBlur = (field: string, value: string) => {
    setFocusedField(null);
    validateField(field, value);
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative" ref={containerRef}>
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

        {/* Interactive Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{
                x: `${particle.x}vw`,
                y: `${particle.y}vh`,
                opacity: 0
              }}
              animate={{
                x: `${particle.x + 20}vw`,
                y: `${particle.y - 30}vh`,
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: 8,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-cyan-400 rotate-45 animate-geometric-float"></div>
          <div className="absolute top-2/3 right-1/3 w-24 h-24 border border-blue-400 rotate-12 animate-geometric-pulse"></div>
          <div className="absolute bottom-1/4 left-1/2 w-20 h-20 border border-violet-400 -rotate-12 animate-geometric-drift"></div>
          
          {/* Dynamic Icons */}
          <motion.div 
            className="absolute top-1/6 right-1/4 text-cyan-300/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Shield className="w-8 h-8" />
          </motion.div>
          <motion.div 
            className="absolute bottom-1/3 left-1/6 text-blue-300/30"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Zap className="w-6 h-6" />
          </motion.div>
          <motion.div 
            className="absolute top-2/3 left-2/3 text-violet-300/30"
            animate={{ scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Star className="w-7 h-7" />
          </motion.div>
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
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTextIndex}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 1.05 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="text-center"
              >
                {dynamicTexts[currentTextIndex].split('\n').map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    {index === 0 ? (
                      <h1 className="text-5xl text-white mb-4 aesthetic-display tracking-tight">
                        {line}
                      </h1>
                    ) : (
                      <h2 className="text-4xl text-cyan-300 aesthetic-heading tracking-tight">
                        {line}
                      </h2>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col space-y-5 text-base text-slate-300 aesthetic-body max-w-sm"
          >
            {[
              { icon: Check, text: "Automated GST Return Filing", color: "emerald" },
              { icon: Shield, text: "Real-time Tax Compliance", color: "cyan" },
              { icon: Zap, text: "AI-Powered Invoice Processing", color: "purple" }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="flex items-center justify-start space-x-4 group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ x: 10, transition: { duration: 0.2 } }}
              >
                <div className={`w-8 h-8 bg-${feature.color}-400/20 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-${feature.color}-400/40`}>
                  <feature.icon className={`w-4 h-4 text-${feature.color}-400`} />
                </div>
                <span className="text-left group-hover:text-white transition-colors duration-300">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
          
        </div>
      </div>

      {/* Right Side - Login Panel */}
      <div className="w-96 bg-white relative overflow-hidden shadow-2xl border-l border-slate-200">
        {/* Subtle Right Panel Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30"></div>
        
        {/* Interactive Light Rays */}
        <div className="absolute inset-0 opacity-30">
          <motion.div 
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-300/50 to-transparent"
            animate={{ x: [-100, 400] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-purple-300/50 to-transparent"
            animate={{ x: [100, -400] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>
        
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
                      <Label htmlFor="name" className="text-sm text-gray-700 aesthetic-body mb-2 block flex items-center justify-between">
                        Full Name
                        {formData.name && isFieldValid('name', formData.name) && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-emerald-500"
                          >
                            <Check className="w-4 h-4" />
                          </motion.div>
                        )}
                      </Label>
                      <div className="relative group">
                        <User className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                          focusedField === 'name' ? 'text-blue-500' : 
                          formErrors.name ? 'text-red-500' : 
                          isFieldValid('name', formData.name) ? 'text-emerald-500' : 'text-gray-400'
                        }`} />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          onFocus={() => handleFieldFocus('name')}
                          onBlur={(e) => handleFieldBlur('name', e.target.value)}
                          className={`pl-11 py-3 transition-all duration-300 aesthetic-light ${
                            focusedField === 'name' ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg transform scale-[1.02]' :
                            formErrors.name ? 'border-red-500 ring-2 ring-red-500/20' :
                            isFieldValid('name', formData.name) ? 'border-emerald-500 ring-2 ring-emerald-500/20' :
                            'border-gray-300'
                          }`}
                          required={!isLogin}
                          data-testid="name-input"
                        />
                        {formErrors.name && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          </motion.div>
                        )}
                      </div>
                      <AnimatePresence>
                        {formErrors.name && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-sm text-red-500 mt-1 aesthetic-light"
                          >
                            {formErrors.name}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <motion.div 
                      className="space-y-2"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <Label htmlFor="company" className="text-sm text-gray-700 aesthetic-body mb-2 block flex items-center justify-between">
                        Company Name
                        {formData.company && isFieldValid('company', formData.company) && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-emerald-500"
                          >
                            <Check className="w-4 h-4" />
                          </motion.div>
                        )}
                      </Label>
                      <div className="relative group">
                        <Building className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                          focusedField === 'company' ? 'text-blue-500' : 
                          formErrors.company ? 'text-red-500' : 
                          isFieldValid('company', formData.company) ? 'text-emerald-500' : 'text-gray-400'
                        }`} />
                        <Input
                          id="company"
                          type="text"
                          placeholder="Enter your company name"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          onFocus={() => handleFieldFocus('company')}
                          onBlur={(e) => handleFieldBlur('company', e.target.value)}
                          className={`pl-11 py-3 transition-all duration-300 aesthetic-light ${
                            focusedField === 'company' ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg transform scale-[1.02]' :
                            formErrors.company ? 'border-red-500 ring-2 ring-red-500/20' :
                            isFieldValid('company', formData.company) ? 'border-emerald-500 ring-2 ring-emerald-500/20' :
                            'border-gray-300'
                          }`}
                          required={!isLogin}
                          data-testid="company-input"
                        />
                        {formErrors.company && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          </motion.div>
                        )}
                      </div>
                      <AnimatePresence>
                        {formErrors.company && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-sm text-red-500 mt-1 aesthetic-light"
                          >
                            {formErrors.company}
                          </motion.p>
                        )}
                      </AnimatePresence>
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
                  <Label htmlFor="email" className="text-sm text-gray-700 aesthetic-body mb-2 block flex items-center justify-between">
                    Email Address
                    {formData.email && isFieldValid('email', formData.email) && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-emerald-500"
                      >
                        <Check className="w-4 h-4" />
                      </motion.div>
                    )}
                  </Label>
                  <div className="relative group">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                      focusedField === 'email' ? 'text-blue-500' : 
                      formErrors.email ? 'text-red-500' : 
                      isFieldValid('email', formData.email) ? 'text-emerald-500' : 'text-gray-400'
                    }`} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      onFocus={() => handleFieldFocus('email')}
                      onBlur={(e) => handleFieldBlur('email', e.target.value)}
                      className={`pl-11 py-3 transition-all duration-300 aesthetic-light ${
                        focusedField === 'email' ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg transform scale-[1.02]' :
                        formErrors.email ? 'border-red-500 ring-2 ring-red-500/20' :
                        isFieldValid('email', formData.email) ? 'border-emerald-500 ring-2 ring-emerald-500/20' :
                        'border-gray-300'
                      }`}
                      required
                      data-testid="email-input"
                    />
                    {formErrors.email && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      </motion.div>
                    )}
                  </div>
                  <AnimatePresence>
                    {formErrors.email && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-red-500 mt-1 aesthetic-light"
                      >
                        {formErrors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Password field */}
                <motion.div 
                  className="space-y-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: isLogin ? 0.8 : 1.0 }}
                >
                  <Label htmlFor="password" className="text-sm text-gray-700 aesthetic-body mb-2 block flex items-center justify-between">
                    Password
                    {formData.password && isFieldValid('password', formData.password) && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-emerald-500"
                      >
                        <Check className="w-4 h-4" />
                      </motion.div>
                    )}
                  </Label>
                  <div className="relative group">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                      focusedField === 'password' ? 'text-blue-500' : 
                      formErrors.password ? 'text-red-500' : 
                      isFieldValid('password', formData.password) ? 'text-emerald-500' : 'text-gray-400'
                    }`} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      onFocus={() => handleFieldFocus('password')}
                      onBlur={(e) => handleFieldBlur('password', e.target.value)}
                      className={`pl-11 pr-20 py-3 transition-all duration-300 aesthetic-light ${
                        focusedField === 'password' ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg transform scale-[1.02]' :
                        formErrors.password ? 'border-red-500 ring-2 ring-red-500/20' :
                        isFieldValid('password', formData.password) ? 'border-emerald-500 ring-2 ring-emerald-500/20' :
                        'border-gray-300'
                      }`}
                      required
                      data-testid="password-input"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                      {formErrors.password && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        </motion.div>
                      )}
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        data-testid="toggle-password"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </motion.button>
                    </div>
                  </div>
                  <AnimatePresence>
                    {formErrors.password && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-red-500 mt-1 aesthetic-light"
                      >
                        {formErrors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Submit button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg aesthetic-button relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                    data-testid="submit-button"
                  >
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center justify-center space-x-2"
                        >
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing...</span>
                        </motion.div>
                      ) : (
                        <motion.span
                          key="text"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center justify-center space-x-2"
                        >
                          <span>{isLogin ? "Sign In" : "Create Account"}</span>
                          <motion.div
                            className="w-5 h-5 rounded-full bg-white/20"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </motion.span>
                      )}
                    </AnimatePresence>
                    
                    {/* Ripple effect on click */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
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

        {/* Enhanced Security notice */}
        <motion.div 
          className="mt-10 text-center text-xs text-gray-500 aesthetic-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          <div className="flex items-center justify-center space-x-4 mb-3">
            <motion.div 
              className="flex items-center space-x-1"
              whileHover={{ scale: 1.05 }}
            >
              <Shield className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-600 font-medium">SSL Secured</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-1"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="w-3 h-3 text-blue-500" />
              <span className="text-blue-600 font-medium">256-bit Encryption</span>
            </motion.div>
          </div>
          <p className="tracking-wide text-gray-400">🔒 Enterprise-grade security • GDPR compliant • ISO 27001 certified</p>
        </motion.div>
        
        {/* Professional Progress Indicator */}
        <motion.div 
          className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
        />
      </motion.div>
      </div>
    </div>
  );
}