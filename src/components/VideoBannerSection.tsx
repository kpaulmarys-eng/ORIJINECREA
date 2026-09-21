import React from 'react';
import { ScrollReveal } from './ScrollReveal';

export const VideoBannerSection: React.FC = () => {
  return (
    <section className="relative w-full h-[60vh] sm:h-[80vh] bg-black overflow-hidden flex items-center justify-center m-0 my-0 mt-0 mb-0 p-0 py-0 pt-0 pb-0 border-0 leading-none">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      >
        <source src="https://cdn.pixabay.com/video/2023/10/22/186105-876939920_large.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
      
      <ScrollReveal yOffset={36} duration={0.9} className="relative z-10 text-center px-6 max-w-4xl">
        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FFFAFA] uppercase drop-shadow-lg">
          L'ESSENCE DU MOUVEMENT
        </h2>
        <p className="mt-4 font-ui text-sm sm:text-base tracking-[.15em] text-white/80 uppercase">
          La fusion entre l'art sculptural et le vêtement.
        </p>
      </ScrollReveal>
    </section>
  );
};
