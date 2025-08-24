import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { LogoText } from "@/components/ui/logo";
import { BarChart3, TrendingUp, Network } from "lucide-react";

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, delay: number}>>([]);

  // Generate digital particles
  useEffect(() => {
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  // 8-second animation sequence controller
  useEffect(() => {
    const timeline = [
      { scene: 0, duration: 1600 }, // Data Atmosphere
      { scene: 1, duration: 1800 }, // Geometric Pulse  
      { scene: 2, duration: 1400 }, // Convergence Pulse
      { scene: 3, duration: 2000 }, // Logo Reveal
      { scene: 4, duration: 1200 }, // Final Tagline
    ];

    let currentTimeout: NodeJS.Timeout;
    
    const runScene = (sceneIndex: number) => {
      if (sceneIndex < timeline.length) {
        setCurrentScene(sceneIndex);
        currentTimeout = setTimeout(() => {
          runScene(sceneIndex + 1);
        }, timeline[sceneIndex].duration);
      } else {
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    };

    runScene(0);

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

      {/* Digital Particles Field */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-blue-400/60 blur-sm"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
            }}
            transition={{
              duration: 6,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Scene 0: Data Atmosphere (0-1.6s) */}
      <AnimatePresence>
        {currentScene === 0 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Rotating Digital Orbs */}
            <div className="relative">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 bg-blue-300/40 rounded-full blur-sm"
                  style={{
                    transform: `rotate(${i * 30}deg) translateX(120px)`,
                  }}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.1,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              ))}
            </div>

            {/* Code Streams */}
            <motion.div
              className="absolute text-blue-300/30 font-mono text-sm"
              animate={{
                x: [-200, 200],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              01011010...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene 1: Geometric Pulse (1.6-3.4s) */}
      <AnimatePresence>
        {currentScene === 1 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.4 }}
          >
            {/* Geometric Shapes */}
            <div className="relative">
              {/* Hexagon */}
              <motion.div
                className="absolute w-16 h-16 border-2 border-blue-400/60"
                style={{
                  clipPath: "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)"
                }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: [0, 1, 0.8],
                  rotate: [0, 180, 360],
                  borderColor: ["#60a5fa60", "#3b82f6", "#60a5fa60"]
                }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />

              {/* Triangle */}
              <motion.div
                className="absolute w-16 h-16 border-2 border-blue-300/60"
                style={{
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                  left: "-40px",
                  top: "40px"
                }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: [0, 1, 0.8],
                  rotate: [0, 120, 240],
                  borderColor: ["#93c5fd60", "#60a5fa", "#93c5fd60"]
                }}
                transition={{ duration: 1.8, delay: 0.2, ease: "easeInOut" }}
              />

              {/* Circle */}
              <motion.div
                className="absolute w-16 h-16 border-2 border-white/60 rounded-full"
                style={{
                  left: "40px",
                  top: "40px"
                }}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [0, 1, 0.8],
                  borderColor: ["#ffffff60", "#ffffff", "#ffffff60"]
                }}
                transition={{ duration: 1.8, delay: 0.4, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene 2: Icon Morphing (3.4-4.8s) */}
      <AnimatePresence>
        {currentScene === 2 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex space-x-12">
              {[BarChart3, TrendingUp, Network].map((Icon, i) => (
                <motion.div
                  key={i}
                  className="w-16 h-16 flex items-center justify-center"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: [0, 1.2, 1],
                    rotate: [-180, 0, 0],
                  }}
                  transition={{ 
                    duration: 1,
                    delay: i * 0.2,
                    ease: "easeOut"
                  }}
                >
                  <Icon 
                    className="w-full h-full text-blue-300"
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))"
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene 3: Logo Reveal (4.8-6.8s) */}
      <AnimatePresence>
        {currentScene === 3 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Convergence Effect */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ duration: 1 }}
            >
              <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 to-transparent" />
            </motion.div>

            {/* FINSYNC Logo */}
            <motion.div
              className="relative text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <motion.div
                style={{
                  background: 'linear-gradient(135deg, #C8D3E3 0%, #89A4C7 50%, #FFFFFF 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontSize: '4rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textShadow: '0 0 30px rgba(59, 130, 246, 0.8)',
                }}
                animate={{
                  textShadow: [
                    '0 0 30px rgba(59, 130, 246, 0.8)',
                    '0 0 50px rgba(59, 130, 246, 1)',
                    '0 0 30px rgba(59, 130, 246, 0.8)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                FINSYNC
              </motion.div>

              {/* Metallic shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{
                  duration: 1.5,
                  delay: 0.5,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene 4: Final Tagline (6.8-8s) */}
      <AnimatePresence>
        {currentScene === 4 && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* FINSYNC (smaller) */}
            <motion.div
              className="text-4xl font-bold text-white mb-8"
              style={{
                background: 'linear-gradient(135deg, #C8D3E3 0%, #89A4C7 50%, #FFFFFF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '0.05em'
              }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              FINSYNC
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="text-xl text-blue-200 font-medium tracking-wide"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Empowering Finance. Enabling Growth.
            </motion.p>

            {/* Underline Animation */}
            <motion.div
              className="h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent mt-4"
              initial={{ width: 0 }}
              animate={{ width: "300px" }}
              transition={{ duration: 1, delay: 0.6 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}