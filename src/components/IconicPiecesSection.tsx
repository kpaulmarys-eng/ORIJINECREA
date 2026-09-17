import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Box, Video, ShoppingBag, Check } from 'lucide-react';
import { PRODUCTS } from '../data/brandData';
import { BlurUpImage } from './BlurUpImage';
import { GarmentProduct } from '../types';

interface IconicPiecesSectionProps {
  onNavigateToCollection: () => void;
  onAddToCart: (product: GarmentProduct, size: string) => void;
  onOpenAR: (product: GarmentProduct) => void;
  onOpenVideo?: (product: GarmentProduct) => void;
}

export const IconicPiecesSection: React.FC<IconicPiecesSectionProps> = ({
  onNavigateToCollection,
  onAddToCart,
  onOpenAR,
  onOpenVideo,
}) => {
  // EXACT SPECIFICATION: EXACTLY TWO ICONIC PIECES
  const iconicProducts = PRODUCTS.slice(0, 2);

  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    [iconicProducts[0]?.id]: 'M',
    [iconicProducts[1]?.id]: 'L',
  });
  const [activeViews, setActiveViews] = useState<Record<string, number>>({
    [iconicProducts[0]?.id]: 0,
    [iconicProducts[1]?.id]: 0,
  });
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleSelectSize = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleSelectView = (productId: string, viewIdx: number) => {
    setActiveViews((prev) => ({ ...prev, [productId]: viewIdx }));
  };

  const handleQuickAdd = (product: GarmentProduct) => {
    const size = selectedSizes[product.id] || product.sizes[0] || 'M';
    onAddToCart(product, size);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  return (
    <section
      id="iconic-pieces"
      data-testid="section-iconic-pieces"
      className="relative overflow-hidden bg-[#181815] px-6 py-16 text-[#FFFAFA] sm:px-10 sm:py-20 lg:py-24 border-t border-[#FFFAFA]/10"
    >
      {/* Ambient Radial Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#F6D110]/[0.025] blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10">
        {/* Section Header: Structured, Balanced, No Excessive Whitespace */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F6D110]/35 bg-[#1F1F1C] px-3.5 py-1 font-ui text-[11px] uppercase tracking-[.3em] text-[#F6D110] font-semibold mb-3">
            <Sparkles size={12} className="text-[#F6D110]" />
            <span>SÉLECTION EMBLÉMATIQUE // PILIERS EGO</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FFFAFA] uppercase leading-[0.95]">
            Pièces Iconiques
          </h2>

          <p className="mt-3 font-ui text-sm sm:text-base font-light text-[#FFFAFA]/75 leading-relaxed">
            Deux silhouettes fondatrices. Matière brute, coupe architecturale drop-shoulder et présence affirmée.
          </p>
        </div>

        {/* Showcase Grid: EXACTLY TWO CARDS, Fills the page harmoniously with Square Folded resting state and smooth unfolding on hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto items-start">
          {iconicProducts.map((product, index) => {
            const currentSize = selectedSizes[product.id] || product.sizes[0] || 'M';
            const currentViewIdx = activeViews[product.id] || 0;
            const currentView = product.views?.[currentViewIdx] || product.views?.[0];
            const isAdded = addedIds[product.id];
            const isHovered = hoveredId === product.id;

            return (
              <article
                key={product.id}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`relative flex flex-col w-full max-w-[460px] mx-auto overflow-hidden rounded-[30px] bg-[#1C1C19] border transition-all duration-500 ease-out shadow-xl cursor-pointer ${
                  isHovered
                    ? 'border-[#F6D110]/70 shadow-[0_25px_60px_rgba(0,0,0,0.85)] -translate-y-1'
                    : 'border-[#FFFAFA]/10 hover:border-[#FFFAFA]/25'
                }`}
              >
                {/* Subtle Top Specular Line */}
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                {/* Card Header Tag & Category */}
                <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#FFFAFA]/5">
                  <div className="flex items-center gap-2">
                    <span className="font-ui text-xs uppercase tracking-[.25em] text-[#F6D110] font-bold">
                      0{index + 1} // SILHOUETTE ICONIQUE
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#141412] px-2.5 py-0.5 font-ui text-[10px] uppercase tracking-wider text-[#FFFAFA]/60 border border-[#FFFAFA]/10 font-medium">
                      {product.weight || '420 GSM'}
                    </span>
                    <span
                      className={`text-[9px] font-ui uppercase tracking-widest px-2 py-0.5 rounded-full transition-colors ${
                        isHovered ? 'bg-[#F6D110]/20 text-[#F6D110]' : 'text-[#FFFAFA]/40'
                      }`}
                    >
                      {isHovered ? 'DÉPLIÉ' : 'PLIÉ'}
                    </span>
                  </div>
                </div>

                {/* Garment Image Stage: Clean Square presentation */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#141412] p-5 flex items-center justify-center group">
                  {currentView?.image ? (
                    <BlurUpImage
                      src={currentView.image}
                      alt={`${product.name} - ${currentView.label}`}
                      containerClassName="w-full h-full flex items-center justify-center"
                      className={`object-contain w-full h-full transition-transform duration-500 ${
                        isHovered ? 'scale-105' : 'scale-100'
                      }`}
                    />
                  ) : (
                    <div className="text-center font-ui text-xs text-[#F6D110]">
                      {product.name}
                    </div>
                  )}

                  {/* Multi-angle view switcher pills - revealed on hover */}
                  <div
                    className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1 rounded-full bg-[#1F1F1C]/90 p-1 backdrop-blur-md border border-white/10 shadow-lg transition-all duration-300 ${
                      isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                    }`}
                  >
                    {product.views.map((v, vI) => (
                      <button
                        key={v.type}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectView(product.id, vI);
                        }}
                        className={`rounded-full px-2.5 py-1 font-ui text-[9px] uppercase tracking-wider transition-colors cursor-pointer ${
                          currentViewIdx === vI
                            ? 'bg-[#F6D110] text-[#1F1F1C] font-bold shadow-sm'
                            : 'text-[#FFFAFA]/70 hover:text-[#FFFAFA]'
                        }`}
                      >
                        {v.label.replace('VUE ', '')}
                      </button>
                    ))}
                  </div>

                  {/* Floating price badge at resting state */}
                  <div
                    className={`absolute top-4 right-4 rounded-full bg-[#1F1F1C]/85 px-3 py-1 border border-white/10 backdrop-blur-md font-ui font-bold text-sm text-[#F6D110] shadow-md transition-opacity duration-300 ${
                      isHovered ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    {product.price} €
                  </div>
                </div>

                {/* Permanent Basic Info: Name, Collection & Resting Price */}
                <div className="p-5 pb-3 flex items-center justify-between border-t border-[#FFFAFA]/5 bg-[#1C1C19]">
                  <div>
                    <span className="font-ui text-[10px] uppercase tracking-[.25em] text-[#FFFAFA]/50 block">
                      {product.collection}
                    </span>
                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-[#FFFAFA] leading-none mt-0.5">
                      {product.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="font-ui text-2xl font-bold text-[#F6D110] leading-none block">
                      {product.price} €
                    </span>
                    <span className="font-ui text-[9px] uppercase tracking-wider text-[#FFFAFA]/40 block mt-0.5">
                      {isHovered ? 'TVA INCLUSE' : 'SURVOLER'}
                    </span>
                  </div>
                </div>

                {/* UNFOLDED SECTION: Smoothly expands on hover to show all details */}
                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    isHovered ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="overflow-hidden bg-gradient-to-b from-[#1C1C19] to-[#151512] px-6 pb-6 pt-1 space-y-4 border-t border-[#FFFAFA]/10">
                    <p className="font-ui text-xs font-light text-[#FFFAFA]/70 leading-relaxed pt-1">
                      {product.tagline}
                    </p>

                    {/* Architectural Specifications */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-ui border-y border-[#FFFAFA]/10 py-2.5">
                      <div className="flex items-center gap-1.5 text-[#FFFAFA]/75">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#F6D110]" />
                        <span>COUPE : <strong className="text-[#FFFAFA]">BOXY DROP</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#FFFAFA]/75">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#F6D110]" />
                        <span>MATIÈRE : <strong className="text-[#FFFAFA]">100% COTON</strong></span>
                      </div>
                    </div>

                    {/* Size Selector */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-ui text-[#FFFAFA]/60 uppercase tracking-widest mb-1.5">
                        <span>TAILLE CHOISIE</span>
                        <span className="text-[#F6D110] font-bold">{currentSize}</span>
                      </div>
                      <div className="flex gap-1.5">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectSize(product.id, size);
                            }}
                            className={`flex-1 py-1.5 rounded-lg font-ui text-xs font-bold transition-all cursor-pointer ${
                              currentSize === size
                                ? 'bg-[#F6D110] text-[#1F1F1C] shadow-[0_2px_10px_rgba(246,209,16,0.3)]'
                                : 'bg-[#121210] text-[#FFFAFA]/70 hover:text-[#FFFAFA] border border-[#FFFAFA]/10 hover:border-[#FFFAFA]/25'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Row */}
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenAR(product);
                        }}
                        className="flex-1 py-2 rounded-xl bg-[#141412] hover:bg-[#23231F] text-[#FFFAFA]/85 hover:text-[#F6D110] border border-[#FFFAFA]/15 transition-colors text-[10px] font-ui uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Box size={13} className="text-[#F6D110]" />
                        <span>AR 3D</span>
                      </button>

                      {onOpenVideo && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenVideo(product);
                          }}
                          className="flex-1 py-2 rounded-xl bg-[#141412] hover:bg-[#23231F] text-[#FFFAFA]/85 hover:text-[#F6D110] border border-[#FFFAFA]/15 transition-colors text-[10px] font-ui uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Video size={13} className="text-[#F6D110]" />
                          <span>VIDÉO</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAdd(product);
                        }}
                        className={`flex-[2] py-2.5 rounded-xl font-ui text-xs uppercase tracking-[.2em] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                          isAdded
                            ? 'bg-white text-[#1F1F1C]'
                            : 'bg-[#F6D110] text-[#1F1F1C] hover:bg-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={14} strokeWidth={2.5} className="text-[#1F1F1C]" />
                            <span>AJOUTÉ</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={14} />
                            <span>COMMANDER</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Refined Discovery Link */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onNavigateToCollection}
            className="inline-flex items-center gap-3 rounded-full border border-[#FFFAFA]/20 bg-[#1F1F1C]/90 px-7 py-3 font-ui text-xs uppercase tracking-[.25em] text-[#FFFAFA] hover:border-[#F6D110] hover:text-[#F6D110] hover:bg-[#141412] transition-all cursor-pointer shadow-lg"
          >
            <span>ACCÉDER À TOUTES LES PIÈCES DU CATALOGUE</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

