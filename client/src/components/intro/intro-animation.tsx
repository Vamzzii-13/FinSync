import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import finSyncLogo from "@assets/generated_images/FINSYNC_metallic_corporate_logo_c6ea7600.png";

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, scale: number, delay: number}>>([]);

  // Generate flowing particles for background
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: Math.random() * 0.5 + 0.5,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  // Animation sequence controller
  useEffect(() => {
    const timeline = [
      { phase: 0, duration: 1000 }, // Initial grid and particles
      { phase: 1, duration: 1500 }, // Data waves and lines
      { phase: 2, duration: 1200 }, // Graph formation
      { phase: 3, duration: 2000 }, // Logo reveal
      { phase: 4, duration: 1500 }, // Tagline and final glow
    ];

    let currentTimeout: NodeJS.Timeout;
    
    const runPhase = (phaseIndex: number) => {
      if (phaseIndex < timeline.length) {
        setCurrentPhase(phaseIndex);
        currentTimeout = setTimeout(() => {
          runPhase(phaseIndex + 1);
        }, timeline[phaseIndex].duration);
      } else {
        // Animation complete
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    };

    runPhase(0);

    return () => {
      if (currentTimeout) clearTimeout(currentTimeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      data-testid="intro-animation"
    >
      {/* Digital Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-grid-pattern animate-grid-flow" />
      </div>

      {/* Flowing Particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, particle.scale, 0],
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
            }}
            transition={{
              duration: 4,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Animated Data Waves */}
      <AnimatePresence>
        {currentPhase >= 1 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                style={{ width: "120%", transform: `rotate(${i * 36}deg)` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.5, 1],
                  opacity: [0, 1, 0.3],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Graph Formation Animation */}
      <AnimatePresence>
        {currentPhase >= 2 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Chart bars animation */}
            <div className="flex items-end space-x-2">
              {[40, 70, 55, 85, 65].map((height, i) => (
                <motion.div
                  key={i}
                  className="bg-gradient-to-t from-blue-600 to-blue-400 w-4 rounded-t opacity-40"
                  style={{ height: `${height}px` }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 0.6 }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
            
            {/* Connecting lines */}
            <motion.svg
              className="absolute w-32 h-32"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              <motion.path
                d="M10,60 Q30,30 50,45 T90,25"
                stroke="rgb(59, 130, 246)"
                strokeWidth="2"
                fill="none"
                className="drop-shadow-lg"
              />
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Logo Reveal */}
      <AnimatePresence>
        {currentPhase >= 3 && (
          <motion.div
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* Glow effect behind logo */}
            <motion.div
              className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Logo Image */}
            <motion.img
              src={finSyncLogo}
              alt="FINSYNC"
              className="w-80 h-auto relative z-10"
              initial={{ 
                opacity: 0, 
                scale: 0.8,
                rotateY: -90 
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                rotateY: 0
              }}
              transition={{ 
                duration: 1.5,
                delay: 0.3,
                ease: "easeOut"
              }}
            />

            {/* Metallic shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 skew-x-12"
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{
                duration: 1.5,
                delay: 1,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tagline Reveal */}
      <AnimatePresence>
        {currentPhase >= 4 && (
          <motion.div
            className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h2
              className="text-2xl md:text-3xl text-white font-light text-center tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-silver-300 to-blue-400 bg-clip-text text-transparent">
                Smarter Insights, Stronger Decisions
              </span>
            </motion.h2>
            
            {/* Underline animation */}
            <motion.div
              className="h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent mt-4"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading progress indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}