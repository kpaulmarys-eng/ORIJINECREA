import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

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
      const p = Math.min(((now - start) / 2200) * 100, 100);
      setProgress(p);
      if (p < 100) {
        frameId = requestAnimationFrame(updateProgress);
      }
    };
    frameId = requestAnimationFrame(updateProgress);
    const timer = window.setTimeout(onComplete, 2400);
    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(timer);
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

  // Total life bar segments (like in classic video game HP gauges)
  const totalSegments = 24;
  const activeSegments = Math.round((progress / 100) * totalSegments);

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
          {/* Deep Black Sky with Twinkling Stars */}
          <div className="absolute inset-0 pointer-events-none">
            {stars.map((star, idx) => (
              <motion.span
                key={idx}
                className="absolute rounded-full bg-white"
                style={{
                  left: star.left,
                  top: star.top,
                  width: star.size,
                  height: star.size,
                }}
                animate={{
                  opacity: [0.08, 0.95, 0.08],
                  scale: [0.8, 1.6, 0.8],
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

          {/* Central Block: Logo + Video Game Life Bar */}
          <motion.div
            className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Center Logo in Pure White */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-white text-base">✦</span>
              <h1 className="font-logo whitespace-nowrap text-white text-[clamp(2.4rem,7vw,4.2rem)] tracking-[.22em] font-bold">
                NEÏROUA
              </h1>
              <span className="text-white text-base">✦</span>
            </div>

            {/* Video Game Life Bar / HP Gauge (Plus petite & raffinée) */}
            <div className="w-full max-w-[200px] sm:max-w-[220px] space-y-1.5 text-white">
              {/* Top HUD Line: "HP" and percentage value */}
              <div className="flex justify-between items-baseline font-mono text-[9px] tracking-[.25em] text-white uppercase font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 bg-white" />
                  <span>HP // LIFE</span>
                </span>
                <span>{Math.round(progress)}%</span>
              </div>

              {/* Main Outer Health Bar Frame with slim gaming border */}
              <div className="relative p-[2px] border border-white bg-black">
                {/* Segmented Life Blocks in compact height */}
                <div className="flex h-2.5 sm:h-3 gap-[1.5px] bg-black">
                  {Array.from({ length: totalSegments }).map((_, idx) => {
                    const isFilled = idx < activeSegments;
                    return (
                      <div
                        key={idx}
                        className={`flex-1 h-full transition-colors duration-75 ${
                          isFilled ? 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.7)]' : 'bg-transparent'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Sub-label in pure white */}
              <div className="flex justify-between font-mono text-[8px] tracking-[.25em] text-white/70 pt-0.5">
                <span>LVL.01</span>
                <span>INITIALIZING</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
