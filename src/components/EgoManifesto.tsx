import React from 'react';
import { motion } from 'motion/react';
import { MarqueeBands } from './MarqueeBands';
import { BRAND_INFO, BRAND_COLORS } from '../data/brandData';

export const EgoManifesto: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.16,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      id="ego"
      data-testid="section-ego"
      className="relative overflow-hidden bg-[#1F1F1C] px-6 py-28 text-[#FFFAFA] sm:px-12 sm:py-36 border-t border-[#FFFAFA]/10"
    >
      {/* Background Subtle Coordinate Overlay */}
      <div className="absolute top-10 right-10 font-mono text-[9px] uppercase tracking-[.4em] text-[#FFFAFA]/20 pointer-events-none hidden md:block">
        [NEÏROUA // EGO COLLECTION MATRIX] — VOL. 01
      </div>

      <motion.div
        className="mx-auto grid max-w-7xl gap-14 sm:grid-cols-[1fr_2fr] sm:gap-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10% 0px' }}
      >
        {/* Left Section Marker & Title */}
        <motion.div variants={itemVariants} className="flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F6D110]/40 bg-[#161614] px-3.5 py-1 font-ui text-[10px] uppercase tracking-[.32em] text-[#F6D110] font-semibold mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F6D110] animate-ping" />
              COLLECTION 01 // RÉSUMÉ EGO
            </div>
            <h2 className="font-display text-7xl font-semibold leading-[.75] tracking-[-.05em] sm:text-[9.5rem] text-[#FFFAFA]">
              EGO
            </h2>
          </div>

          <div className="hidden sm:block font-ui text-[11px] uppercase tracking-[.3em] text-[#FFFAFA]/50 mt-8">
            ARCHITECTURE DU CORPS & STREETWEAR HYBRIDE
          </div>
        </motion.div>

        {/* Right Side Philosophical Statement */}
        <div className="max-w-3xl flex flex-col justify-between">
          <motion.div variants={itemVariants}>
            <p className="font-display text-[clamp(2.5rem,6vw,6rem)] font-semibold leading-[.88] tracking-[-.04em]">
              L'ego, pas un miroir.
              <br />
              <span className="ml-[6%] text-[#FFFAFA]/65">Une présence.</span>
              <br />
              <span className="ml-[14%] text-[#F6D110] drop-shadow-[0_0_24px_rgba(246,209,16,0.35)]">Un choix.</span>
            </p>
          </motion.div>

          {/* Staggered description blocks */}
          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            <motion.div
              variants={itemVariants}
              className="border-l border-[#F6D110]/40 pl-5"
            >
              <span className="font-ui text-[10px] uppercase tracking-[.3em] text-[#F6D110] block mb-2 font-mono">
                [VOLUMES & COUPE]
              </span>
              <p className="font-ui text-sm font-light leading-[1.6] tracking-[.02em] text-[#FFFAFA]/80">
                NEÏROUA habille ce qui échappe aux premières impressions. Des volumes qui ne décorent
                pas le corps : ils lui confèrent une autorité sculpturale et une élégance urbaine décomplexée.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="border-l border-[#0C5FB3]/50 pl-5"
            >
              <span className="font-ui text-[10px] uppercase tracking-[.3em] text-[#0C5FB3] block mb-2 font-mono">
                [MATIÈRE BRUTE & HAUTE COUTURE]
              </span>
              <p className="font-ui text-sm font-light leading-[1.6] tracking-[.02em] text-[#FFFAFA]/80">
                Chaque pièce est coupée dans un coton lourd de 380 à 520 GSM, pensé comme un patrimoine
                durable qui traverse le temps et affirme votre singularité.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Reversed Bottom Marquee */}
      <div className="mt-24">
        <MarqueeBands reverse={true} />
      </div>
    </section>
  );
};
