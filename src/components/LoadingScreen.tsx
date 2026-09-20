import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import officialLogo from '../assets/images/logo_official.png';

interface LoadingScreenProps {
  onComplete: () => void;
  onStartCrossfade: () => void;
  isComplete: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  onStartCrossfade,
  isComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'sliding' | 'crossfading' | 'done'>('loading');
  const [targetCoords, setTargetCoords] = useState({ x: 0, y: 0, scale: 1 });
  const logo1Ref = useRef<HTMLDivElement>(null);

  // Progress animation (0 to 100% over ~2.2s)
  useEffect(() => {
    if (isComplete) return;
    const start = performance.now();
    let frameId = 0;
    const duration = 2200;

    const updateProgress = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // Ease out quart curve
      const easeOutQuart = 1 - Math.pow(1 - t, 4);
      const p = easeOutQuart * 100;
      setProgress(p);

      if (t < 1) {
        frameId = requestAnimationFrame(updateProgress);
      }
    };

    frameId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(frameId);
  }, [isComplete]);

  // When progress reaches 100%, calculate target destination in Navbar and start spring flight
  useEffect(() => {
    if (progress >= 99.9 && phase === 'loading') {
      const targetEl = document.getElementById('navbar-logo-target');
      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        // In Logo 2 (800x380 lockup), the 3-rays symbol sits centered horizontally in the upper 28% of height
        const targetSymbolX = rect.left + rect.width / 2;
        const targetSymbolY = rect.top + rect.height * 0.28;

        const currentCenterX = window.innerWidth / 2;
        let currentCenterY = window.innerHeight / 2 - 40;
        if (logo1Ref.current) {
          const l1Rect = logo1Ref.current.getBoundingClientRect();
          currentCenterY = l1Rect.top + l1Rect.height / 2;
        }

        const deltaX = targetSymbolX - currentCenterX;
        const deltaY = targetSymbolY - currentCenterY;

        // Scale ratio: target symbol inside Logo 2 is ~15-18px high, Logo 1 initial is ~58px
        const targetSymbolHeight = rect.height * 0.42;
        const initialHeight = logo1Ref.current ? logo1Ref.current.getBoundingClientRect().height : 58;
        const scaleRatio = targetSymbolHeight / (initialHeight || 58);

        setTargetCoords({
          x: deltaX,
          y: deltaY,
          scale: Math.max(0.18, Math.min(scaleRatio, 0.36)),
        });
      } else {
        // Precise responsive fallback if target not yet measured
        const isMobile = window.innerWidth < 640;
        const fallbackTargetX = (isMobile ? 24 : 48) + 40;
        const fallbackTargetY = (isMobile ? 20 : 24) + 14;
        setTargetCoords({
          x: fallbackTargetX - window.innerWidth / 2,
          y: fallbackTargetY - (window.innerHeight / 2 - 40),
          scale: isMobile ? 0.24 : 0.28,
        });
      }

      setPhase('sliding');
    }
  }, [progress, phase]);

  // Starry particle array with twinkling offsets
  const stars = useMemo(
    () =>
      Array.from({ length: 65 }, (_, i) => ({
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
          className="fixed inset-0 z-[100] flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* GALACTIC NEBULA & DEEP SPACE BACKGROUND: Fades out softly when sliding begins, revealing the site */}
          <motion.div
            className="absolute inset-0 bg-[#000000]"
            animate={{ opacity: phase === 'loading' ? 1 : 0 }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
          >
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.5 }}
              transition={{ duration: 3, ease: 'easeOut' }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 50%, rgba(12, 95, 179, 0.18) 0%, rgba(246, 209, 16, 0.08) 40%, transparent 70%)',
                filter: 'blur(50px)',
              }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background:
                  'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(12, 95, 179, 0.25) 90deg, transparent 180deg, rgba(246, 209, 16, 0.15) 270deg, transparent 360deg)',
                filter: 'blur(70px)',
              }}
            />

            {/* Twinkling Stars */}
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
          </motion.div>

          <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-lg">
            {/* LOGO 1 (SYMBOLE) :
                1. Entre au centre lors du chargement.
                2. À 100%, glisse avec un ressort 'spring' ({ stiffness: 100, damping: 20 }) vers la NavBar.
                3. À l'arrivée, s'estompe vers 0 (crossfade avec Logo 2).
            */}
            <motion.div
              ref={logo1Ref}
              initial={{ x: -80, opacity: 0, scale: 1 }}
              animate={
                phase === 'loading'
                  ? { x: 0, opacity: 1, scale: 1 }
                  : phase === 'sliding'
                  ? {
                      x: targetCoords.x,
                      y: targetCoords.y,
                      scale: targetCoords.scale,
                      opacity: 1,
                    }
                  : {
                      x: targetCoords.x,
                      y: targetCoords.y,
                      scale: targetCoords.scale,
                      opacity: 0,
                    }
              }
              transition={
                phase === 'loading'
                  ? { duration: 0.9, ease: 'easeOut' }
                  : phase === 'sliding'
                  ? {
                      type: 'spring',
                      stiffness: 100,
                      damping: 20,
                    }
                  : {
                      duration: 0.4,
                      ease: 'easeInOut',
                    }
              }
              onAnimationComplete={() => {
                if (phase === 'sliding') {
                  // Logo 1 arrived at destination! Trigger crossfade with Logo 2
                  setPhase('crossfading');
                  onStartCrossfade();
                  // Allow crossfade duration to complete gracefully
                  setTimeout(() => {
                    setPhase('done');
                    onComplete();
                  }, 450);
                }
              }}
              className="flex flex-col items-center justify-center mb-8 sm:mb-10 drop-shadow-[0_0_25px_rgba(255,255,255,0.45)] select-none pointer-events-none"
            >
              <img
                src={officialLogo}
                alt="Logo Officiel NEÏROUA"
                className="w-28 sm:w-36 md:w-44 h-auto object-contain select-none pointer-events-none filter drop-shadow-[0_0_12px_rgba(255,255,255,0.35)]"
              />
            </motion.div>

            {/* Video Game Life Bar / HP Gauge: Fades out immediately upon reaching 100% */}
            <motion.div
              className="w-full max-w-[200px] sm:max-w-[220px] space-y-1.5 text-white mt-8"
              animate={progress >= 99.5 ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
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
                        idx < Math.round((progress / 100) * 24)
                          ? 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.7)]'
                          : 'bg-transparent'
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
