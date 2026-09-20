import React from 'react';
import { Sparkles } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface AboutSectionProps {
  onNavigateToCollection?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigateToCollection }) => {
  return (
    <section
      id="about"
      data-testid="section-about"
      className="relative overflow-hidden bg-[#141412] px-6 py-20 text-[#FFFAFA] sm:px-12 sm:py-24 border-t border-[#FFFAFA]/10"
    >
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#F6D110]/[0.025] blur-3xl pointer-events-none" />

      <ScrollReveal className="mx-auto max-w-3xl relative z-10" yOffset={40} duration={0.9}>
        {/* Section Pill / Tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#F6D110]/40 bg-[#1F1F1C] px-3.5 py-1 font-ui text-[10px] uppercase tracking-[.32em] text-[#F6D110] font-semibold mb-6">
          <Sparkles size={11} className="text-[#F6D110]" />
          <span>A propos de nous</span>
        </div>

        {/* Main Title */}
        <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-.03em] text-[#FFFAFA] mb-8">
          À propos de NEÏROUA
        </h2>

        {/* Brand Summary - Exact User Text */}
        <div className="space-y-6 font-ui text-base sm:text-lg font-light leading-relaxed text-[#FFFAFA]/90">
          <p>
            NEÏROUA est une marque de mode contemporaine née en Côte d’Ivoire, pensée autour d’une idée simple : oser être pleinement soi-même.
          </p>

          <p className="text-[#FFFAFA]/80">
            À travers ses vêtements et ses expériences visuelles, NEÏROUA explore l’identité, l’individualité, la confiance en soi et la liberté de s’affranchir des codes imposés. La marque ne cherche pas à définir qui vous devez être, mais à créer des pièces qui vous permettent d’exprimer qui vous êtes.
          </p>

          <p className="text-[#FFFAFA]/80">
            NEÏROUA mêle mode, création numérique et nouvelles expériences pour proposer une approche de la mode africaine contemporaine à la fois personnelle, moderne et tournée vers l’avenir. Chaque pièce est pensée comme une interprétation d’une idée, d’une émotion ou d’un état d’esprit, avec un design capable d’exister par lui-même.
          </p>

          <div className="pt-4 border-t border-[#FFFAFA]/10">
            <p className="text-xs uppercase tracking-[.25em] text-[#FFFAFA]/60 font-medium mb-3">
              Notre philosophie tient en une phrase :
            </p>
            <blockquote className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-[.15em] text-[#F6D110]">
              OSE REDÉFINIR LES CODES.
            </blockquote>
            <p className="mt-4 text-sm sm:text-base font-light italic text-[#FFFAFA]/75">
              Parce que devenir soi-même, c’est aussi créer ses propres règles.
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};
