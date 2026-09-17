import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { SilhouetteFabric } from './SilhouetteFabric';
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
    label: 'VISUALISATION 3D',
    subtitle: 'SCAN VOLUMÉTRIQUE 360°',
    copy: 'Explorez les maillages et la structure tridimensionnelle sous toutes les perspectives.',
    variant: 1,
    image: tshirtCyberGraphic,
    badge: 'SCAN SPATIAL 360°',
  },
  {
    id: 'collection',
    label: 'COLLECTION T-SHIRTS',
    subtitle: 'CAPSULE ARCHITECTURALE',
    copy: 'T-Shirts Boxy & Coupes Sculpturales. Coton lourd teinté dans la masse.',
    variant: 0,
    image: tshirtBlackBoxy,
    badge: 'HOMME & FEMME',
  },
  {
    id: 'video',
    label: 'VIDÉO RUNWAY',
    subtitle: 'FILM CINÉMATOGRAPHIQUE',
    copy: 'Les pièces en mouvement dans la lumière. Expérience visuelle et sonore.',
    variant: 2,
    image: tshirtRawBone,
    badge: 'FILM 4K',
  },
];

export const ExperienceCoverFlow: React.FC<ExperienceCoverFlowProps> = ({
  onOpenVisualizer,
  onOpenVideo,
  onSelectCollection,
}) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const xOffsets = [-190, 0, 190];

  const handleCardClick = (id: string) => {
    if (id === 'visualisation') {
      onOpenVisualizer();
    } else if (id === 'collection') {
      onSelectCollection();
    } else if (id === 'video') {
      onOpenVideo();
    }
  };

  return (
    <section
      id="experiences"
      data-testid="section-experiences"
      className="relative overflow-hidden bg-[#1F1F1C] px-5 py-28 text-[#FFFAFA] sm:px-10 sm:py-36 border-t border-[#FFFAFA]/10"
    >
      {/* Background Soft Ambient Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#F6D110]/[0.025] blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <div className="mx-auto flex max-w-7xl items-end justify-between">
        <div>
          <p className="font-ui text-[11px] uppercase tracking-[.35em] text-[#F6D110] font-semibold">
            EXPÉRIENCES D'IMMERSION // NEÏROUA
          </p>
          <h2 className="mt-3 font-display text-5xl font-semibold tracking-[-.04em] sm:text-7xl text-[#FFFAFA]">
            Choisis ton angle.
          </h2>
        </div>
        <span className="hidden font-ui text-[10px] uppercase tracking-[.28em] text-[#FFFAFA]/50 sm:block">
          03 / EXPÉRIENCES IMMERSIVES
        </span>
      </div>

      {/* 3D Glass Coverflow Stage (Sans contour autour, pur design épuré et respirant) */}
      <div className="perspective-stage relative mx-auto mt-12 h-[500px] max-w-5xl sm:h-[550px]">
        {PANELS.map((panel, idx) => {
          const isActive = activeIndex === idx;

          return (
            <motion.button
              key={panel.id}
              type="button"
              data-cursor="OPEN"
              data-testid={`panel-${panel.label.toLowerCase().replace(/\s+/g, '-')}`}
              className="absolute left-1/2 top-0 h-[460px] w-[min(74vw,310px)] -translate-x-1/2 overflow-hidden rounded-[28px] text-left sm:h-[510px] cursor-pointer focus:outline-none transition-all group backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] border-0"
              style={{
                background: isActive
                  ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(20, 20, 18, 0.75) 100%)'
                  : 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(15, 15, 14, 0.6) 100%)',
              }}
              animate={{
                x: xOffsets[idx] * 0.85,
                scale: isActive ? 1 : 0.86,
                rotateY: isActive ? 0 : idx < activeIndex ? 14 : -14,
                filter: isActive ? 'brightness(1)' : 'brightness(0.4)',
                zIndex: isActive ? 50 : 30 - Math.abs(idx - activeIndex),
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 26 }}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(1)}
              onFocus={() => setActiveIndex(idx)}
              onClick={() => handleCardClick(panel.id)}
            >
              {/* Top Glass Specular Glow line */}
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

              {/* Real Garment Photography visual */}
              <div className="absolute inset-0">
                <SilhouetteFabric
                  variant={panel.variant}
                  imageSrc={panel.image}
                  label={panel.subtitle}
                  showDetails={false}
                />
              </div>

              {/* Glass Frost Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#141412] via-[#141412]/50 to-transparent transition-opacity group-hover:from-[#141412]/95" />

              {/* Top Glass Pill Badge */}
              <div className="absolute inset-x-5 top-5 flex justify-between items-center z-10 sm:inset-x-6 sm:top-6">
                <span className="rounded-full bg-white/[0.08] backdrop-blur-md px-3 py-1 font-ui text-[9px] uppercase tracking-[.25em] text-[#F6D110] font-semibold shadow-sm">
                  {panel.badge}
                </span>
                <span className="font-ui text-[10px] tracking-[.3em] text-[#FFFAFA]/60 font-mono">
                  0{idx + 1} / 03
                </span>
              </div>

              {/* Card Glass Meta Content: Clean title and indicator in default state, copy & CTA reveal on hover/active */}
              <div className="absolute inset-x-5 bottom-5 z-10 sm:inset-x-6 sm:bottom-6">
                <div className="mb-1.5 flex justify-between font-ui text-[9px] uppercase tracking-[.28em] text-[#FFFAFA]/60">
                  <span>{panel.subtitle}</span>
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      isActive ? 'bg-[#F6D110]' : 'bg-white/30'
                    }`}
                  />
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#FFFAFA] group-hover:text-[#F6D110] transition-colors">
                  {panel.label}
                </h3>

                {/* Extra Details Revealed ONLY on Hover/Active */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    isActive
                      ? 'max-h-36 opacity-100 mt-2 pointer-events-auto'
                      : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <p className="font-ui text-xs font-light leading-relaxed text-[#FFFAFA]/80">
                    {panel.copy}
                  </p>

                  <span className="mt-3.5 inline-flex items-center gap-1.5 font-ui text-[10px] uppercase tracking-[.25em] text-[#F6D110] font-semibold group-hover:translate-x-1.5 transition-transform">
                    OUVRIR L'EXPÉRIENCE <ArrowUpRight size={12} strokeWidth={1.5} />
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Helper caption */}
      <p className="mx-auto mt-6 max-w-7xl text-center font-ui text-[10px] uppercase tracking-[.35em] text-[#FFFAFA]/40">
        SURVOLEZ UNE CARTE EN VERRE POUR L'ACTIVER // NEÏROUA EXPÉRIENCE
      </p>
    </section>
  );
};
