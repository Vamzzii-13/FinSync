import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-12 h-12"
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer Corporate Ring */}
        <circle
          cx="60"
          cy="60"
          r="56"
          stroke="#1e40af"
          strokeWidth="3"
          fill="none"
          opacity="0.1"
        />
        
        {/* Main Logo Background */}
        <rect
          x="20"
          y="20"
          width="80"
          height="80"
          rx="12"
          fill="#1e40af"
          className="drop-shadow-lg"
        />
        
        {/* Inner Frame */}
        <rect
          x="26"
          y="26"
          width="68"
          height="68"
          rx="8"
          fill="#ffffff"
        />
        
        {/* F Letter */}
        <path
          d="M38 42h20v4h-16v8h14v4h-14v12h-4V42z"
          fill="#1e40af"
          className="font-bold"
        />
        
        {/* S Letter with modern styling */}
        <path
          d="M66 42c4.4 0 8 3.6 8 8 0 2.2-0.9 4.2-2.3 5.7L74 58c1.4 1.5 2.3 3.5 2.3 5.7 0 4.4-3.6 8-8 8h-8v-4h8c2.2 0 4-1.8 4-4s-1.8-4-4-4h-2v-4h2c2.2 0 4-1.8 4-4s-1.8-4-4-4h-8v-4h8z"
          fill="#1e40af"
        />
        
        {/* Sync Symbol - Professional Data Flow */}
        <g opacity="0.8">
          <path
            d="M45 72l6-3v2h8v2h-8v2l-6-3z"
            fill="#059669"
          />
          <path
            d="M67 52l6 3-6 3v-2h-8v-2h8v-2z"
            fill="#059669"
          />
        </g>
        
        {/* Professional Corner Accent */}
        <rect
          x="85"
          y="35"
          width="2"
          height="8"
          fill="#dc2626"
        />
        <rect
          x="87"
          y="33"
          width="8"
          height="2"
          fill="#dc2626"
        />
      </svg>
    </motion.div>
  );
}

export function LogoText({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`flex items-center space-x-2 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Logo size="md" />
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          FinSync
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
          Enterprise Edition
        </p>
      </div>
    </motion.div>
  );
}