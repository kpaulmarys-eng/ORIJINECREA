import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Filter, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { PRODUCTS } from '../data/brandData';
import { GarmentProduct } from '../types';

interface CatalogueSectionProps {
  onAddToCart: (product: GarmentProduct, size: string) => void;
  onOpenAR: (product: GarmentProduct) => void;
  onOpenVideo: (product: GarmentProduct) => void;
}

export const CatalogueSection: React.FC<CatalogueSectionProps> = ({
  onAddToCart,
  onOpenAR,
  onOpenVideo,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>('TOUS');

  const categories = ['TOUS', 'VESTES', 'HOODIES', 'T-SHIRTS'];

  const filteredProducts = PRODUCTS.filter((item) => {
    if (activeCategory === 'TOUS') return true;
    if (activeCategory === 'VESTES') return item.category.toLowerCase().includes('veste') || item.category.toLowerCase().includes('manteau');
    if (activeCategory === 'HOODIES') return item.category.toLowerCase().includes('hoodie') || item.category.toLowerCase().includes('sweat');
    if (activeCategory === 'T-SHIRTS') return item.category.toLowerCase().includes('t-shirt');
    return true;
  });

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="catalogue"
      className="relative w-full py-24 sm:py-32 bg-[#060606] border-b border-[#F5F5F0]/10 overflow-hidden"
    >
      {/* Background radial spotlight */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#D4FF00]/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#D4FF00]/5 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête : Titre explicite "REVENDIQUE TON STYLE" */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0f0f0e] border border-[#D4FF00]/40 text-xs font-mono tracking-[0.3em] uppercase text-[#D4FF00] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>5-HT VOL. 01 // CATALOGUE OFFICIEL</span>
            </div>

            <h2
              id="catalogue-title"
              className="text-4xl sm:text-6xl md:text-7xl font-sans font-semibold uppercase tracking-wider text-[#F5F5F0] leading-none"
              style={{ fontFamily: "'Teko', sans-serif", fontWeight: 600 }}
            >
              REVENDIQUE TON STYLE
            </h2>
            <p className="mt-3 text-lg sm:text-xl font-sans font-light tracking-wide text-[#F5F5F0]/70 max-w-xl">
              Chaque pièce est une affirmation sculpturale. Changez les vues (Face, Dos, Détail) directement sur chaque carte vêtement.
            </p>
          </div>

          {/* Carousel Controls & Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Category filter tabs */}
            <div className="flex items-center bg-[#0d0d0c] border border-[#F5F5F0]/15 p-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 text-xs font-mono tracking-widest uppercase transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#D4FF00] text-[#050505] font-bold'
                      : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Carousel navigation arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeft}
                aria-label="Faire défiler le carrousel vers la gauche"
                data-cursor="PREV"
                className="w-11 h-11 bg-[#0d0d0c] hover:bg-[#D4FF00] text-[#F5F5F0] hover:text-[#050505] border border-[#F5F5F0]/20 hover:border-[#D4FF00] flex items-center justify-center transition-colors shadow-lg cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                aria-label="Faire défiler le carrousel vers la droite"
                data-cursor="NEXT"
                className="w-11 h-11 bg-[#0d0d0c] hover:bg-[#D4FF00] text-[#F5F5F0] hover:text-[#050505] border border-[#F5F5F0]/20 hover:border-[#D4FF00] flex items-center justify-center transition-colors shadow-lg cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Horizontally Extending Container (Swipe / Drag / Scroll) */}
        <div
          ref={scrollContainerRef}
          id="catalogue-carousel"
          tabIndex={0}
          aria-label="Carrousel de produits NEÏROUA"
          className="relative flex gap-6 sm:gap-8 overflow-x-auto pb-8 pt-2 scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing focus:outline-none focus:ring-1 focus:ring-[#D4FF00]/40"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onBuy={onAddToCart}
              onOpenAR={onOpenAR}
              onOpenVideo={onOpenVideo}
            />
          ))}

          {/* End-of-Carousel VIP bespoke commission block */}
          <div className="flex-shrink-0 w-[280px] sm:w-[320px] bg-[#0c0c0b] border border-dashed border-[#F5F5F0]/20 p-8 flex flex-col justify-between text-center rounded-sm">
            <div className="space-y-3 my-auto">
              <SlidersHorizontal className="w-8 h-8 text-[#D4FF00] mx-auto opacity-90" />
              <span className="text-xs font-mono tracking-[0.25em] text-[#D4FF00] uppercase block font-semibold">
                COMMANDE SPÉCIALE
              </span>
              <h3 className="text-2xl font-sans font-semibold tracking-wider text-[#F5F5F0] uppercase">
                SUR-MESURE & ARCHIVE
              </h3>
              <p className="text-sm font-sans font-light text-[#F5F5F0]/70 leading-relaxed">
                Besoin d’une pièce numérotée ajustée à vos mensurations exactes pour un événement ou une exposition ?
              </p>
            </div>
            <a
              href="mailto:atelier@neiroua.com?subject=Demande%20Sur-Mesure%20NEIROUA"
              data-cursor="CONTACT"
              className="w-full py-3 px-4 border border-[#F5F5F0]/30 hover:border-[#D4FF00] text-[#F5F5F0] hover:text-[#050505] hover:bg-[#D4FF00] font-mono tracking-widest text-xs uppercase font-bold transition-all cursor-pointer"
            >
              CONTACTER L'ATELIER
            </a>
          </div>
        </div>

        {/* Tactile scroll indicator bar */}
        <div className="mt-4 flex items-center justify-between text-xs font-mono text-[#F5F5F0]/40 tracking-widest">
          <span>&larr; GLISSER POUR NAVIGUER DANS LE CATALOGUE &rarr;</span>
          <span className="hidden sm:inline">UTILISEZ LES FLÈCHES SUR LES CARTES POUR CHANGER LA VUE DU VÊTEMENT</span>
        </div>
      </div>
    </section>
  );
};
