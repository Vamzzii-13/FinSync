import { motion } from "framer-motion";
import { useEffect } from "react";
import { LogoText } from "@/components/ui/logo";
import { Gauge, BarChart3, FileSpreadsheet, Shield } from "lucide-react";

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  // Simple timer to complete intro
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // 3 seconds total

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-slate-100 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      data-testid="intro-animation"
    >
      {/* Main Content */}
      <motion.div
        className="glass-card rounded-2xl p-12 max-w-lg mx-4 text-center"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Feature Icons */}
        <motion.div
          className="flex justify-center space-x-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {[Gauge, BarChart3, FileSpreadsheet, Shield].map((Icon, i) => (
            <motion.div
              key={i}
              className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.5,
                delay: 0.5 + i * 0.1,
                ease: "easeOut"
              }}
            >
              <Icon className="w-5 h-5 text-blue-600" />
            </motion.div>
          ))}
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <LogoText className="text-3xl text-slate-800 mb-4" />
          <motion.div
            className="h-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ duration: 0.8, delay: 1 }}
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-slate-600 font-medium mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          Enterprise GST Compliance Platform
        </motion.p>

        {/* Loading indicator */}
        <motion.div
          className="flex justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 1,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}