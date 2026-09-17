import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Box } from 'lucide-react';

interface ARModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

export const ARModal: React.FC<ARModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[90] flex items-center justify-center bg-[#000]/85 px-5 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label="réalité augmentée"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          className="relative w-full max-w-md border border-[#f4f0e4]/20 bg-[#11110f] p-10 text-center text-[#f4f0e4] shadow-2xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="absolute right-5 top-5 text-[#f4f0e4]/70 hover:text-[#F6D110] transition-colors"
          >
            <X size={20} strokeWidth={1} />
          </button>

          <Box className="mx-auto mb-6 text-[#F6D110]" size={34} strokeWidth={1} />

          <p className="font-ui text-[10px] uppercase tracking-[.3em] text-[#f4f0e4]/45">
            EXPÉRIENCE AR
          </p>

          <h2 className="mt-4 font-display text-4xl font-semibold">
            Bientôt disponible
          </h2>

          <p className="mt-4 font-ui font-light text-[#f4f0e4]/60">
            La pièce apparaîtra dans votre espace.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-8 border border-[#f4f0e4]/30 hover:border-[#F6D110] hover:text-[#F6D110] px-6 py-3 font-ui text-[10px] uppercase tracking-[.25em] transition-colors"
          >
            RETOUR
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
