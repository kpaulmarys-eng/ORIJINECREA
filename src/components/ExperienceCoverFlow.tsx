import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { ScrollReveal } from './ScrollReveal';
import tshirtCyberGraphic from '../assets/images/tshirt_cyber_graphic_1789595670090.jpg';
import tshirtBlackBoxy from '../assets/images/tshirt_black_boxy_1789595644021.jpg';
import tshirtRawBone from '../assets/images/tshirt_raw_bone_1789595658414.jpg';

interface ExperienceCoverFlowProps {
  onOpenVisualizer: () => void;
  onOpenVideo: () => void;
  onSelectCollection: () => void;
}

const PANELS = [
  {
    id: 'visualisation',
    num: '01',
    label: 'VISUALISATION',
    subtitle: 'SCAN VOLUMÉTRIQUE 360°',
    image: tshirtCyberGraphic,
  },
  {
    id: 'collection',
    num: '02',
    label: 'COLLECTION',
    subtitle: 'CAPSULE ARCHITECTURALE',
    image: tshirtBlackBoxy,
  },
  {
    id: 'video',
    num: '03',
    label: 'VIDÉO',
    subtitle: 'FILM RUNWAY & MATIÈRE',
    image: tshirtRawBone,
  },
];

const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

// Inject custom styles for the micro-glitch effect
const GlitchStyles = () => (
  <style>{`
    .glitch-text {
      animation: rgbText 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    }
    @keyframes rgbText {
      0% { text-shadow: 0 0 0 #0C5FB3, 0 0 0 #F6D110; transform: translate(0); }
      20% { text-shadow: -3px 0 0 #0C5FB3, 3px 0 0 #F6D110; transform: translate(2px); }
      40% { text-shadow: 3px 0 0 #0C5FB3, -3px 0 0 #F6D110; transform: translate(-2px); }
      60% { text-shadow: -2px 0 0 #0C5FB3, 2px 0 0 #F6D110; transform: translate(1px); }
      80% { text-shadow: 2px 0 0 #0C5FB3, -2px 0 0 #F6D110; transform: translate(-1px); }
      100% { text-shadow: 0 0 0 #0C5FB3, 0 0 0 #F6D110; transform: translate(0); }
    }

    .glitch-image {
      animation: rgbImage 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    }
    @keyframes rgbImage {
      0% { filter: contrast(1); transform: scale(1.05) translate(0); }
      20% { filter: contrast(1.3) hue-rotate(15deg); transform: scale(1.05) translate(4px, -2px); }
      40% { filter: contrast(0.8) hue-rotate(-15deg); transform: scale(1.05) translate(-4px, 2px); }
      60% { filter: contrast(1.2); transform: scale(1.05) translate(2px, -1px); }
      80% { filter: contrast(0.9); transform: scale(1.05) translate(-2px, 1px); }
      100% { filter: contrast(1); transform: scale(1.05) translate(0); }
    }
  `}</style>
);

const ExperienceSurface: React.FC<{
  panel: typeof PANELS[0];
  isHovered: boolean;
  isSelected: boolean;
  anyHovered: boolean;
  anySelected: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}> = ({ panel, isHovered, isSelected, anyHovered, anySelected, onHover, onLeave, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGlitching, setIsGlitching] = useState(false);

  // Parallax Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 60, damping: 20, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  
  const translateX = useTransform(smoothX, [-1, 1], [-20, 20]);
  const translateY = useTransform(smoothY, [-1, 1], [-20, 20]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !isHovered) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    onHover();
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 350);
  };

  const handleMouseLeave = () => {
    onLeave();
    mouseX.set(0);
    mouseY.set(0);
  };

  // Determine Flex Grow dynamically
  let flexGrow = 1;
  if (isSelected) flexGrow = 100;
  else if (anySelected) flexGrow = 0.001; // Shrink others to almost 0
  else if (isHovered) flexGrow = 2.5; // Expand significantly on hover
  else if (anyHovered) flexGrow = 0.8; // Shrink slightly to make room

  return (
    <motion.article
      ref={cardRef}
      layout
      transition={{ type: 'spring', stiffness: 150, damping: 25, mass: 0.8 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      style={{ flexGrow, flexBasis: 0, overflow: 'hidden' }}
      className={`relative h-full bg-[#050505] cursor-pointer group rounded-sm border transition-colors duration-500
        ${isSelected ? 'border-transparent' : (isHovered ? 'border-white/10' : 'border-[#1F1F1C]')}
      `}
    >
      {/* Dynamic Image Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <motion.img
          src={panel.image}
          alt={panel.label}
          style={{ x: translateX, y: translateY }}
          animate={{
            scale: isSelected ? 1 : (isHovered ? 1.05 : 1.15),
            filter: isSelected ? 'grayscale(0%) brightness(1)' : (isHovered ? 'grayscale(0%) brightness(1.1)' : 'grayscale(60%) brightness(0.6)'),
          }}
          transition={{ scale: { type: 'spring', stiffness: 120, damping: 30 } }}
          className={`absolute inset-0 w-full h-full object-cover origin-center ${isGlitching ? 'glitch-image' : ''}`}
        />
        
        {/* Dark Overlays for depth and text legibility */}
        <motion.div 
          animate={{ opacity: isSelected ? 0.3 : (isHovered ? 0.4 : 0.8) }}
          className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none transition-opacity duration-700" 
        />
        
        {/* Subtle Noise Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: `url("${NOISE_SVG}")` }}
        />
      </div>

      {/* Floating UI Content */}
      <AnimatePresence>
        {!anySelected && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 z-20 pointer-events-none"
          >
            {/* Top Info */}
            <motion.div 
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#F6D110] animate-pulse" />
              <span className="font-ui text-xs text-white/70 uppercase tracking-[.3em] font-medium">
                {panel.subtitle}
              </span>
            </motion.div>

            {/* Bottom Titles */}
            <div className="relative">
              <div className="text-[100px] md:text-[140px] font-display text-white/5 leading-none -mb-6 md:-mb-10 font-bold tracking-tighter">
                {panel.num}
              </div>
              <h3 className={`text-4xl md:text-5xl lg:text-6xl font-display uppercase font-bold text-white leading-none tracking-tight
                ${isGlitching ? 'glitch-text' : ''}
              `}>
                {panel.label}
              </h3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activation Glow Frame */}
      <div className={`absolute inset-0 border-[1px] pointer-events-none transition-all duration-300 mix-blend-screen
        ${isHovered && !isSelected ? 'border-[#0C5FB3] opacity-30 scale-95' : 'border-transparent opacity-0 scale-100'}
      `} />
    </motion.article>
  );
};

export const ExperienceCoverFlow: React.FC<ExperienceCoverFlowProps> = ({
  onOpenVisualizer,
  onOpenVideo,
  onSelectCollection,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleClick = (id: string) => {
    if (selectedId) return;

    setSelectedId(id);
    setIsTransitioning(true);
    setTransitionProgress(0);

    const duration = 800; // ms transition duration
    const start = performance.now();

    const animateProgress = (now: number) => {
      const elapsed = now - start;
      const p = Math.min((elapsed / duration) * 100, 100);
      // Cubic ease-out curve for elegant loading
      const easeOut = 1 - Math.pow(1 - p / 100, 3);
      setTransitionProgress(easeOut * 100);

      if (elapsed < duration) {
        requestAnimationFrame(animateProgress);
      } else {
        if (id === 'visualisation') onOpenVisualizer();
        else if (id === 'collection') onSelectCollection();
        else if (id === 'video') onOpenVideo();

        setTimeout(() => {
          setSelectedId(null);
          setIsTransitioning(false);
          setTransitionProgress(0);
        }, 400);
      }
    };
    
    requestAnimationFrame(animateProgress);
  };

  return (
    <section
      id="experience"
      className="relative w-full bg-[#000000] px-4 py-16 sm:px-8 sm:py-24 lg:py-32"
    >
      {/* Transition Loading Indicator */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-0 left-0 w-full z-[100] h-[2px] bg-white/10"
          >
            <div 
              className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              style={{ width: `${transitionProgress}%` }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <GlitchStyles />

      <div className="mx-auto max-w-[1600px]">
        {/* Section Header */}
        <ScrollReveal yOffset={30} duration={0.8} className="mb-10 lg:mb-14 px-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-[1px] bg-[#F6D110]" />
            <span className="font-ui text-[10px] uppercase tracking-[.4em] text-[#F6D110] font-bold">
              IMMERSION DIGITALE
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wide text-[#FFFAFA] uppercase">
            Choisis Ton Angle
          </h2>
        </ScrollReveal>

        {/* Living Surfaces Composition (The Core Redesign) */}
        <ScrollReveal yOffset={45} delay={0.12} duration={0.9} className="w-full">
          <div className="flex flex-col md:flex-row w-full h-[65vh] md:h-[75vh] gap-3 md:gap-5">
            {PANELS.map((panel) => (
              <ExperienceSurface
                key={panel.id}
                panel={panel}
                isHovered={hoveredId === panel.id}
                isSelected={selectedId === panel.id}
                anyHovered={hoveredId !== null}
                anySelected={selectedId !== null}
                onHover={() => setHoveredId(panel.id)}
                onLeave={() => setHoveredId(null)}
                onClick={() => handleClick(panel.id)}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
