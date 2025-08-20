import { motion } from "framer-motion";
import LoginForm from "@/components/auth/login-form";
import SignupForm from "@/components/auth/signup-form";
import { useState } from "react";
import { ChartLine, Shield, Clock, Users } from "lucide-react";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
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
      className="min-h-screen flex animate-gradient-x"
      data-testid="auth-page"
    >
      {/* Left Panel with Animation */}
      <motion.div
        variants={itemVariants}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        data-testid="auth-left-panel"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700"></div>
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-600/20"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 text-white">
          <motion.div
            className="floating-element"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <ChartLine className="w-16 h-16 mb-8 text-white/90" />
          </motion.div>
          
          <motion.h1
            variants={itemVariants}
            className="text-5xl font-black mb-6"
            data-testid="auth-title"
          >
            FinSync
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-white/90 max-w-md"
            data-testid="auth-subtitle"
          >
            Professional GST compliance and financial management platform
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="mt-8 flex space-x-4"
            data-testid="auth-features"
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm">Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Real-time</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Collaborative</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel - Auth Forms */}
      <motion.div
        variants={itemVariants}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 glass-dark"
        data-testid="auth-right-panel"
      >
        <div className="w-full max-w-md">
          <motion.div
            key={isSignup ? 'signup' : 'login'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {isSignup ? (
              <SignupForm onSwitchToLogin={() => setIsSignup(false)} />
            ) : (
              <LoginForm onSwitchToSignup={() => setIsSignup(true)} />
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
