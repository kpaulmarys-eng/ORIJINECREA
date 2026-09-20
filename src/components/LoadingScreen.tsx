import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BRAND_INFO, BRAND_COLORS } from '../data/brandData';

interface LoadingScreenProps {
  onComplete: () => void;
  isComplete: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, isComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isComplete) return;
    const start = performance.now();
    let frameId = 0;
    const updateProgress = (now: number) => {
      // Ease out style curve for progress
      const t = Math.min((now - start) / 2200, 1);
      const easeOutQuart = 1 - Math.pow(1 - t, 4);
      const p = easeOutQuart * 100;
      
      setProgress(p);
      if (t < 1) {
        frameId = requestAnimationFrame(updateProgress);
      } else {
        // At 100%, wait a bit for logo animation before unmounting
        setTimeout(onComplete, 800);
      }
    };
    frameId = requestAnimationFrame(updateProgress);
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isComplete, onComplete]);

  // Starry particle array with twinkling offsets
  const stars = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        left: `${(i * 37) % 99}%`,
        top: `${(i * 59) % 98}%`,
        size: i % 8 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
        duration: 1.4 + (i % 6) * 0.35,
        delay: (i % 10) * 0.18,
      })),
    []
  );

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          data-testid="loading-intro"
          className="fixed inset-0 z-[100] flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[#000000] text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
        >
          {/* GALACTIC NEBULA BACKGROUND */}
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ duration: 3, ease: 'easeOut' }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(12, 95, 179, 0.18) 0%, rgba(246, 209, 16, 0.08) 40%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(12, 95, 179, 0.25) 90deg, transparent 180deg, rgba(246, 209, 16, 0.15) 270deg, transparent 360deg)',
              filter: 'blur(70px)',
            }}
          />

          {/* Deep Black Sky with Twinkling Stars */}
          <div className="absolute inset-0 pointer-events-none">
            {stars.map((star, idx) => (
              <motion.span
                key={idx}
                className="absolute rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)]"
                style={{
                  left: star.left,
                  top: star.top,
                  width: star.size,
                  height: star.size,
                }}
                animate={{
                  opacity: [0.08, 0.95, 0.08],
                  scale: [0.8, 1.4, 0.8],
                }}
                transition={{
                  duration: star.duration,
                  delay: star.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-lg">
            {/* LOGO: Starts from left, moves to center, then to top-left at 100% */}
            <motion.div
              initial={{ x: -100, opacity: 0, scale: 1 }}
              animate={
                progress >= 99
                  ? { 
                      x: '-40vw', // Move towards left edge
                      y: '-40vh', // Move towards top edge
                      scale: 0.45, // Shrink to navbar size
                      opacity: 1 
                    }
                  : { x: 0, opacity: 1, scale: 1 }
              }
              transition={
                progress >= 99
                  ? { duration: 0.8, ease: [0.76, 0, 0.24, 1] } // Smooth elegant slide to corner
                  : { duration: 1, ease: 'easeOut' } // Initial slide in
              }
              className="flex items-center gap-3 mb-10 drop-shadow-[0_0_15px_rgba(255,250,250,0.5)]"
            >
              <div className="h-[2px] w-8 bg-[#F6D110]" />
              <h1 className="font-logo whitespace-nowrap text-white text-[clamp(2rem,6vw,3.5rem)] tracking-[.22em] font-bold">
                NEÏROUA
              </h1>
              <div className="h-[2px] w-8 bg-[#F6D110]" />
            </motion.div>

            {/* Video Game Life Bar / HP Gauge */}
            <motion.div 
              className="w-full max-w-[200px] sm:max-w-[220px] space-y-1.5 text-white mt-8"
              animate={progress >= 99 ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Top HUD Line */}
              <div className="flex justify-between items-baseline font-ui text-[9px] tracking-[.25em] text-white uppercase font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 bg-white" />
                  <span>HP // LIFE</span>
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              {/* Main Outer Health Bar Frame */}
              <div className="relative p-[2px] border border-white bg-black">
                <div className="flex h-2.5 sm:h-3 gap-[1.5px] bg-black">
                  {Array.from({ length: 24 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 h-full transition-colors duration-75 ${
                        idx < Math.round((progress / 100) * 24) ? 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.7)]' : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {/* Sub-label */}
              <div className="flex justify-between font-ui text-[8px] tracking-[.25em] text-white/70 pt-0.5">
                <span>LVL.01</span>
                <span>INITIALIZING</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
