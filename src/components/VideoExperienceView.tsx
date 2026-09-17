import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Play } from 'lucide-react';
import { SilhouetteFabric } from './SilhouetteFabric';
import { Footer } from './Footer';
import { VideoModal } from './VideoModal';
import hoodieImg from '../assets/images/garment_ego_hoodie_1789592536665.jpg';

interface VideoExperienceViewProps {
  onBack: () => void;
  onNavigateToCollection: () => void;
}

export const VideoExperienceView: React.FC<VideoExperienceViewProps> = ({
  onBack,
  onNavigateToCollection,
}) => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

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

      {/* Main Cinematic Video Stage */}
      <main className="relative flex min-h-[calc(100dvh-80px)] items-center justify-center px-5 py-16 sm:px-12 sm:py-24 overflow-hidden">
        {/* Ambient Thematic Silhouette Background */}
        <div className="absolute inset-0 opacity-40 filter blur-sm">
          <SilhouetteFabric variant={2} imageSrc={hoodieImg} showDetails={false} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/80 to-[#090909]/60" />

        <motion.div
          className="relative z-10 max-w-3xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-ui text-[10px] uppercase tracking-[.35em] text-[#F6D110]">
            FILM 001 / RUNWAY CINEMA
          </p>
          <h1 className="mt-5 font-display text-[clamp(4rem,11vw,11rem)] font-semibold leading-[.75] tracking-[-.08em]">
            LA DISTANCE
            <br />
            <span className="text-[#f4f0e4]/55">DU REGARD.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md font-ui text-sm sm:text-base font-light text-[#f4f0e4]/70">
            Une exploration cinématographique en noir et blanc de la silhouette EGO en mouvement à travers les architectures de Paris et Tokyo.
          </p>

          <button
            type="button"
            onClick={() => setVideoModalOpen(true)}
            data-cursor="PLAY"
            className="mt-10 inline-flex items-center gap-4 border border-[#f4f0e4]/40 bg-[#090909]/70 px-8 py-4 font-ui text-[11px] tracking-[.3em] transition-all hover:border-[#F6D110] hover:text-[#F6D110] hover:bg-[#F6D110]/10 cursor-pointer backdrop-blur-md"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F6D110] text-[#090909]">
              <Play size={14} fill="currentColor" strokeWidth={1} className="translate-x-0.5" />
            </div>
            <span>LANCER LE FILM</span>
          </button>
        </motion.div>
      </main>

      <Footer onNavigateToCollection={onNavigateToCollection} />

      {/* Video Modal Player */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
      />
    </div>
  );
};
