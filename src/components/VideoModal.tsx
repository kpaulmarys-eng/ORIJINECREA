import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import hoodieImg from '../assets/images/garment_ego_hoodie_1789592536665.jpg';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[99990] flex items-center justify-center bg-[#000]/90 px-4 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label="vidéo promotionnelle"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          className="relative w-full max-w-4xl overflow-hidden rounded-xl border border-[#f4f0e4]/20 bg-[#090909] shadow-2xl"
          initial={{ y: 25, scale: 0.97, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 25, scale: 0.97, opacity: 0 }}
        >
          {/* Main Visual Film Player Canvas */}
          <div className="relative aspect-video overflow-hidden bg-[#070706]">
            <img
              src={hoodieImg}
              alt="Film Runway NEÏROUA"
              className={`h-full w-full object-cover filter contrast-125 brightness-[0.88] transition-transform duration-1000 ${
                isPlaying ? 'scale-105 duration-[8000ms]' : 'scale-100'
              }`}
            />
            {/* Cinematic Film Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-[#090909]/60 pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              data-testid="button-close-video"
              onClick={onClose}
              aria-label="Fermer"
              data-cursor="CLOSE"
              className="absolute right-5 top-5 rounded-full bg-[#090909]/70 p-2 text-[#f4f0e4] hover:text-[#F6D110] transition-colors z-20 cursor-pointer backdrop-blur-sm border border-[#f4f0e4]/20"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            {/* Film HUD Metadata */}
            <div className="absolute top-5 left-5 z-20 flex items-center gap-3 font-ui text-[10px] tracking-[.25em] text-[#f4f0e4]/70">
              <span className="flex items-center gap-1.5 bg-[#090909]/70 px-2.5 py-1 border border-[#f4f0e4]/15">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                REC 4K DCI
              </span>
              <span className="text-[#F6D110]">FILM / 001 EGO</span>
            </div>

            {/* Play/Pause Button in Center */}
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              aria-label={isPlaying ? 'Mettre en pause' : 'Lire'}
              data-cursor={isPlaying ? 'PAUSE' : 'PLAY'}
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#f4f0e4]/60 bg-[#090909]/75 text-[#f4f0e4] hover:border-[#F6D110] hover:text-[#F6D110] transition-all z-20 cursor-pointer backdrop-blur-sm group"
            >
              {isPlaying ? (
                <Pause size={22} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
              ) : (
                <Play size={22} fill="currentColor" strokeWidth={1} className="translate-x-0.5 group-hover:scale-110 transition-transform" />
              )}
            </button>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 p-5 flex items-center justify-between z-20 bg-gradient-to-t from-[#090909] to-transparent">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMuted((prev) => !prev)}
                  className="text-[#f4f0e4]/80 hover:text-[#F6D110] transition-colors cursor-pointer"
                  data-cursor="AUDIO"
                >
                  {isMuted ? <VolumeX size={18} strokeWidth={1.5} /> : <Volume2 size={18} strokeWidth={1.5} />}
                </button>
                <span className="font-ui text-[11px] tracking-[.25em] text-[#f4f0e4]/60">
                  00:42 / 01:12
                </span>
              </div>
              <span className="font-ui text-[10px] tracking-[.3em] uppercase text-[#F6D110]">
                ATELIER NEÏROUA / PARIS
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
