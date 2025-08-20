import { motion } from "framer-motion";
import { ChartLine } from "lucide-react";

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
      data-testid="loading-screen"
    >
      <div className="text-center">
        <motion.div
          className="relative mb-8"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-20 h-20 border-4 border-white/20 rounded-full"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-white rounded-full"></div>
        </motion.div>
        
        <div>
          <motion.div
            className="flex items-center justify-center space-x-2 mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ChartLine className="w-8 h-8 text-white" />
            <h2 className="text-3xl font-bold text-white" data-testid="loading-title">
              FinSync
            </h2>
          </motion.div>
          
          <motion.div
            className="w-40 h-1 bg-white/20 rounded-full overflow-hidden mx-auto mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="progress-bar h-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
          
          <motion.p
            className="text-white/70 animate-bounce-soft"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            data-testid="loading-message"
          >
            Loading your dashboard...
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
