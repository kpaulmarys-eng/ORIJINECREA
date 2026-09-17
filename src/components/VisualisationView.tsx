import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RotateCw, Eye } from 'lucide-react';
import { SilhouetteFabric } from './SilhouetteFabric';
import { Footer } from './Footer';
import heroImg from '../assets/images/hero_sculptural_piece_1789592524800.jpg';
import backViewImg from '../assets/images/garment_back_view_1789592587301.jpg';
import detailMacroImg from '../assets/images/garment_detail_macro_1789592574781.jpg';

interface VisualisationViewProps {
  onBack: () => void;
  onNavigateToCollection: () => void;
}

const ANGLES = [
  { label: 'FACE VOLUMÉTRIQUE', image: heroImg, note: 'Scan frontal haute densité' },
  { label: 'DOS ARCHITECTURAL', image: backViewImg, note: 'Structure dorsale continue' },
  { label: 'MACRO MATIÈRE', image: detailMacroImg, note: 'Grain brut 520 GSM' },
];

export const VisualisationView: React.FC<VisualisationViewProps> = ({
  onBack,
  onNavigateToCollection,
}) => {
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);

  return (
    <div className="noise min-h-[100dvh] bg-[#090909] text-[#f4f0e4]">
      {/* Header Bar */}
      <header className="flex items-center justify-between px-5 py-6 sm:px-10 sm:py-8 border-b border-[#f4f0e4]/10">
        <button
          type="button"
          onClick={onBack}
          aria-label="Accueil"
          data-cursor="HOME"
          className="font-logo text-[12px] tracking-[.2em] font-semibold text-[#f4f0e4] hover:text-[#F6D110] transition-colors cursor-pointer"
        >
          NEÏROUA
        </button>
        <button
          type="button"
          onClick={onBack}
          data-cursor="BACK"
          className="flex items-center gap-2 font-ui text-[10px] uppercase tracking-[.28em] text-[#f4f0e4]/60 hover:text-[#f4f0e4] transition-colors cursor-pointer"
        >
          <ArrowLeft size={13} strokeWidth={1} />
          <span>RETOUR À L'ACCUEIL</span>
        </button>
      </header>

      {/* Main Visualisation Stage */}
      <main className="grid min-h-[calc(100dvh-80px)] items-center gap-10 px-5 py-16 sm:grid-cols-[1fr_1.3fr] sm:px-12 sm:py-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-ui text-[10px] uppercase tracking-[.35em] text-[#F6D110]">
            VISUALISATION 3D / 001
          </p>
          <h1 className="mt-5 font-display text-[clamp(4rem,10vw,10rem)] font-semibold leading-[.76] tracking-[-.07em]">
            VOIR
            <br />
            <span className="ml-[14%] text-[#f4f0e4]/55">AUTREMENT.</span>
          </h1>
          <p className="mt-10 max-w-sm font-ui text-base font-light leading-[1.45] text-[#f4f0e4]/60">
            Un espace silencieux pour observer la matière, la coupe et ce qu'elles déplacent en nous. Explorez les différents angles de la silhouette maîtresse.
          </p>

          {/* Angle Controls */}
          <div className="mt-8 flex flex-col gap-2.5">
            <span className="font-ui text-[10px] uppercase tracking-[.28em] text-[#f4f0e4]/45">
              SÉLECTION DE L'ANGLE :
            </span>
            <div className="flex flex-wrap gap-2">
              {ANGLES.map((angle, idx) => (
                <button
                  key={angle.label}
                  type="button"
                  onClick={() => setActiveAngleIndex(idx)}
                  data-cursor="ANGLE"
                  className={`border px-4 py-2.5 font-ui text-[10px] tracking-[.22em] transition-all cursor-pointer ${
                    activeAngleIndex === idx
                      ? 'border-[#F6D110] bg-[#F6D110] text-[#090909] font-bold'
                      : 'border-[#f4f0e4]/20 text-[#f4f0e4]/70 hover:border-[#f4f0e4]'
                  }`}
                >
                  {angle.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <button
              type="button"
              onClick={onNavigateToCollection}
              data-cursor="CATALOGUE"
              className="bg-[#f4f0e4] text-[#090909] px-7 py-3.5 font-ui text-xs tracking-[.25em] font-semibold hover:bg-[#F6D110] transition-colors cursor-pointer"
            >
              ACCÉDER AU CATALOGUE
            </button>
          </div>
        </motion.div>

        {/* 3D Visualizer Display Card */}
        <motion.div
          className="relative h-[65vh] min-h-[480px] overflow-hidden rounded-2xl border border-[#f4f0e4]/20 bg-[#0d0d0b] shadow-[0_30px_90px_rgba(0,0,0,0.8)]"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          <SilhouetteFabric
            variant={1}
            view={activeAngleIndex}
            imageSrc={ANGLES[activeAngleIndex].image}
            label={ANGLES[activeAngleIndex].label}
            showDetails={true}
          />

          {/* Holographic Wireframe scanline badge */}
          <div className="absolute top-5 left-5 z-20 flex items-center gap-2 bg-[#090909]/80 border border-[#f4f0e4]/15 px-3 py-1 text-[9px] font-ui tracking-[.25em] text-[#F6D110] backdrop-blur-md">
            <Eye size={12} strokeWidth={1.5} />
            <span>{ANGLES[activeAngleIndex].note}</span>
          </div>

          <button
            type="button"
            onClick={() => setActiveAngleIndex((prev) => (prev + 1) % ANGLES.length)}
            data-cursor="ROTATE"
            className="absolute bottom-5 right-5 z-20 flex items-center gap-2 bg-[#090909]/80 border border-[#f4f0e4]/25 px-4 py-2 text-[10px] font-ui tracking-[.25em] text-[#f4f0e4] hover:border-[#F6D110] hover:text-[#F6D110] transition-colors cursor-pointer backdrop-blur-md"
          >
            <RotateCw size={13} strokeWidth={1.5} />
            <span>PIVOTER L'ANGLE</span>
          </button>
        </motion.div>
      </main>

      <Footer onNavigateToCollection={onNavigateToCollection} />
    </div>
  );
};
