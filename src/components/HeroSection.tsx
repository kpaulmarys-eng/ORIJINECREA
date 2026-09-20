import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, Volume2, VolumeX, Sparkles } from 'lucide-react';
import heroImg from '../assets/images/hero_sculptural_piece_1789592524800.jpg';
import { MarqueeBands } from './MarqueeBands';
import { BRAND_INFO, BRAND_COLORS } from '../data/brandData';

interface HeroSectionProps {
  onOpenViewer?: () => void;
  onNavigateToCollection?: () => void;
  onScrollToEgo?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenViewer,
  onNavigateToCollection,
  onScrollToEgo,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [audioActive, setAudioActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Sound generator toggle (haute couture atmospheric runway soundscape)
  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioActive) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(65, ctx.currentTime);
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 1.2);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(220, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        audioCtxRef.current = ctx;
        oscRef.current = osc;
        gainRef.current = gain;
        setAudioActive(true);
      } catch (err) {
        console.warn('Audio not allowed', err);
      }
    } else {
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.4);
        setTimeout(() => {
          audioCtxRef.current?.close();
          audioCtxRef.current = null;
          oscRef.current = null;
          gainRef.current = null;
          setAudioActive(false);
        }, 400);
      } else {
        setAudioActive(false);
      }
    }
  };

  // Scroll tracking across sticky section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // EXACT USER REQUIREMENT:
  // "l'image de la hero page doit etre grande prendre tout l'ecran et non une image carré au milieur je veux un remplissage complet et une animation de la hero page qui diminue quand on slide vers le bas."
  // When sliding down: stageScale goes from 1.0 (full screen) down to 0.84 with rounded corners
  const stageScale = useTransform(scrollYProgress, [0, 0.75], [1, 0.86]);
  const stageRadius = useTransform(scrollYProgress, [0.08, 0.75], ['0px', '32px']);
  const imageScale = useTransform(scrollYProgress, [0, 0.8], [1.05, 1.15]);
  const heroOverlayOpacity = useTransform(scrollYProgress, [0, 0.65], [0.35, 0.65]);
  const textFadeOut = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scrollPromptOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  const handleDiscover = () => {
    if (onScrollToEgo) {
      onScrollToEgo();
    } else {
      const egoEl = document.getElementById('iconic-pieces') || document.getElementById('about');
      if (egoEl) {
        egoEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      data-testid="section-hero"
      className="relative h-[140vh] w-full bg-[#1F1F1C] text-[#FFFAFA]"
    >
      {/* Pinned Viewport Container */}
      <div className="sticky top-0 flex h-[100dvh] w-full items-center justify-center overflow-hidden">
        {/* Full-Screen Bleed Stage that smoothly scales down on scroll */}
        <motion.div
          className="relative h-full w-full overflow-hidden bg-[#141412] shadow-2xl"
          style={{
            scale: stageScale,
            borderRadius: stageRadius,
          }}
        >
          {/* Full Screen Background Image (Grand remplissage complet de tout l'écran) */}
          <motion.div
            className="absolute inset-0 h-full w-full"
            style={{ scale: imageScale }}
          >
            <img
              src={heroImg}
              alt="NEÏROUA Hero Collection"
              className="h-full w-full object-cover object-center filter contrast-[1.12] brightness-[0.88]"
              loading="eager"
            />
          </motion.div>

          {/* Cinematic Vignette & Dynamic Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-[#1F1F1C] via-[#141412]/40 to-black/50 pointer-events-none"
            style={{ opacity: heroOverlayOpacity }}
          />

          {/* Top HUD Row */}
          <div className="absolute inset-x-6 top-6 sm:inset-x-12 sm:top-8 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-[#F6D110]/50 bg-[#1F1F1C]/80 px-3 py-1 font-ui text-[10px] uppercase tracking-[.28em] text-[#F6D110] backdrop-blur-md font-semibold">
                COLLECTION 01
              </span>
              <span className="hidden sm:inline font-ui text-[10px] uppercase tracking-[.3em] text-[#FFFAFA]/60">
                MADE IN ABIDJAN
              </span>
            </div>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={toggleAudio}
              data-cursor="AUDIO"
              className="pointer-events-auto flex items-center gap-2 rounded-full border border-[#FFFAFA]/20 bg-[#1F1F1C]/70 px-3.5 py-1.5 font-ui text-[10px] tracking-[.22em] text-[#FFFAFA]/80 hover:border-[#F6D110] hover:text-[#F6D110] transition-colors cursor-pointer backdrop-blur-md"
              title="Ambiance sonore du défilé"
            >
              {audioActive ? (
                <>
                  <Volume2 size={13} className="text-[#F6D110] animate-pulse" />
                  <span className="text-[#F6D110] font-semibold">SON ON</span>
                </>
              ) : (
                <>
                  <VolumeX size={13} />
                  <span>SON OFF</span>
                </>
              )}
            </button>
          </div>

          {/* Central Hero Branding Statement */}
          <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
            style={{ opacity: textFadeOut }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              {/* Massive Main Title */}
              <h1 className="font-display text-[clamp(4rem,14vw,12rem)] font-bold tracking-[-0.04em] leading-[0.82] text-[#FFFAFA] uppercase drop-shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
                NEÏROUA
              </h1>

              {/* Brand Logo Symbol / Slogan Just Below Title */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-[#F6D110] text-lg">✦</span>
                <span className="font-ui text-xs uppercase tracking-[.4em] text-[#F6D110] font-bold">
                  {BRAND_INFO.slogan}
                </span>
                <span className="text-[#F6D110] text-lg">✦</span>
              </div>

              {/* Subtitle */}
              <p className="mt-8 mx-auto max-w-xl font-ui text-sm sm:text-base font-light tracking-[.12em] text-[#FFFAFA]/90 leading-relaxed drop-shadow-md">
                Une pièce pensée entre matière, mouvement et identité.
                <br className="hidden sm:inline" />
                <span className="text-[#FFFAFA]/70"> Le vêtement précède la marque.</span>
              </p>

              {/* Quick Action Button */}
              <div className="mt-8 flex justify-center gap-4 pointer-events-auto">
                <button
                  type="button"
                  onClick={onNavigateToCollection}
                  data-cursor="COLLECTION"
                  className="rounded-full bg-[#F6D110] text-[#1F1F1C] px-8 py-3.5 font-ui text-xs uppercase tracking-[.25em] font-bold hover:bg-white transition-colors cursor-pointer shadow-xl"
                >
                  DÉCOUVRIR LA COLLECTION
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom Coordinates & Scroll prompt */}
          <div className="absolute inset-x-6 bottom-8 sm:inset-x-12 z-20 flex items-end justify-between pointer-events-none">
            <div className="hidden sm:block font-ui text-[10px] uppercase tracking-[.3em] text-[#FFFAFA]/60">
              <p className="text-[#F6D110] font-semibold">BABI NEXT GENERATION</p>
            </div>

            {/* Scroll Indicator */}
            <motion.div
              className="mx-auto sm:mx-0 flex flex-col items-center gap-2 pointer-events-auto"
              style={{ opacity: scrollPromptOpacity }}
            >
              <button
                type="button"
                data-testid="button-discover"
                onClick={handleDiscover}
                data-cursor="DIVE"
                className="group flex flex-col items-center gap-2 font-ui text-[10px] tracking-[.3em] text-[#FFFAFA]/80 hover:text-[#F6D110] transition-colors focus:outline-none cursor-pointer"
              >
                <span className="uppercase font-light flex items-center gap-1.5">
                  <span>SCROLL POUR DÉCOUVRIR</span>
                  <Sparkles size={11} className="text-[#F6D110]" />
                </span>

                <div className="flex h-8 w-5 items-center justify-center rounded-full border border-[#FFFAFA]/30 group-hover:border-[#F6D110] transition-colors bg-[#1F1F1C]/60 backdrop-blur-sm">
                  <ArrowDown
                    className="animate-bounce text-[#F6D110]"
                    size={12}
                    strokeWidth={1.5}
                  />
                </div>
              </button>
            </motion.div>

            <div className="hidden sm:block text-right font-ui text-[10px] uppercase tracking-[.3em] text-[#FFFAFA]/60">
              <p>ÉDITION LIMITÉE</p>
              <p className="text-[#F6D110] font-semibold">COLLECTION 01</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Marquee Bands with NEÏROUA */}
      <div className="relative z-20 -mt-2">
        <MarqueeBands />
      </div>
    </section>
  );
};
