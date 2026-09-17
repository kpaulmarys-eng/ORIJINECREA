import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Video, Box, Check, Sparkles } from 'lucide-react';
import { GarmentProduct } from '../types';

interface ProductCardProps {
  product: GarmentProduct;
  onBuy: (product: GarmentProduct, size: string) => void;
  onOpenAR: (product: GarmentProduct) => void;
  onOpenVideo: (product: GarmentProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onBuy,
  onOpenAR,
  onOpenVideo,
}) => {
  // Cycle between views of the SAME garment: Vue Face -> Vue Dos -> Vue Détail
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[1] || product.sizes[0]);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currentView = product.views[currentViewIndex];

  const handlePrevView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentViewIndex((prev) => (prev === 0 ? product.views.length - 1 : prev - 1));
  };

  const handleNextView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentViewIndex((prev) => (prev === product.views.length - 1 ? 0 : prev + 1));
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuy(product, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      data-cursor="VIEW"
      className="group relative flex-shrink-0 w-[300px] sm:w-[350px] md:w-[380px] bg-[#0c0c0b] border border-[#F5F5F0]/15 hover:border-[#D4FF00]/80 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl rounded-sm"
    >
      {/* Top Header info on card */}
      <div className="p-4 border-b border-[#F5F5F0]/10 flex items-center justify-between z-10 bg-[#080808]/80 backdrop-blur-sm">
        <div>
          <span className="text-[10px] font-mono tracking-[0.28em] text-[#D4FF00] uppercase font-semibold block">
            {product.collection}
          </span>
          <h3 className="text-xl sm:text-2xl font-sans font-semibold tracking-wider text-[#F5F5F0] uppercase leading-none mt-0.5">
            {product.name}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xl sm:text-2xl font-mono font-bold text-[#D4FF00] tracking-tight">
            {product.price} {product.currency}
          </span>
        </div>
      </div>

      {/* Garment Visual at Center with Integrated Left/Right View Change Arrows */}
      <div className="relative w-full aspect-[3/4] bg-[#080808] overflow-hidden flex items-center justify-center select-none">
        {/* Animated Garment View Picture */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentView.type}
            src={currentView.image}
            alt={`${product.name} - ${currentView.label}`}
            referrerPolicy="no-referrer"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full h-full object-cover object-center filter contrast-[1.08] brightness-[0.98]"
          />
        </AnimatePresence>

        {/* Subtle Dark Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0b] via-transparent to-black/35 pointer-events-none" />

        {/* Integrated Left View Switch Arrow */}
        <button
          onClick={handlePrevView}
          aria-label="Vue précédente du vêtement"
          title="Vue précédente du vêtement"
          data-cursor="PREV"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#050505]/80 hover:bg-[#D4FF00] text-[#F5F5F0] hover:text-[#050505] border border-[#F5F5F0]/25 hover:border-[#D4FF00] flex items-center justify-center transition-all duration-200 shadow-lg backdrop-blur-sm cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Integrated Right View Switch Arrow */}
        <button
          onClick={handleNextView}
          aria-label="Vue suivante du vêtement"
          title="Vue suivante du vêtement"
          data-cursor="NEXT"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#050505]/80 hover:bg-[#D4FF00] text-[#F5F5F0] hover:text-[#050505] border border-[#F5F5F0]/25 hover:border-[#D4FF00] flex items-center justify-center transition-all duration-200 shadow-lg backdrop-blur-sm cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Current View Badge & Indicators (Vue Face, Vue Dos, Vue Détail) */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-[#050505]/90 backdrop-blur-md border border-[#D4FF00]/40 text-[10px] font-mono tracking-widest text-[#D4FF00] uppercase font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] animate-ping" />
          <span>{currentView.label}</span>
        </div>

        {/* View Indicator Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2 py-1 bg-[#050505]/80 backdrop-blur-sm border border-[#F5F5F0]/15 rounded-sm">
          {product.views.map((v, i) => (
            <button
              key={v.type}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentViewIndex(i);
              }}
              className={`h-1.5 transition-all cursor-pointer ${
                i === currentViewIndex ? 'w-5 bg-[#D4FF00]' : 'w-1.5 bg-[#F5F5F0]/30 hover:bg-[#F5F5F0]/70'
              }`}
              title={v.label}
            />
          ))}
        </div>

        {/* Material weight badge */}
        <div className="absolute top-3 right-3 z-10 text-[9px] font-mono tracking-widest px-2 py-0.5 bg-[#050505]/90 border border-[#F5F5F0]/15 text-[#F5F5F0]/70">
          {product.weight}
        </div>
      </div>

      {/* Description and size selector */}
      <div className="p-4 space-y-3 bg-[#0c0c0b]">
        <p className="text-xs font-sans font-light tracking-wide text-[#F5F5F0]/70 line-clamp-2 leading-relaxed">
          {currentView.description}
        </p>

        {/* Size Selection */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-mono tracking-widest text-[#F5F5F0]/50 uppercase">
            TAILLE :
          </span>
          <div className="flex gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-7 h-6 text-[10px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                  selectedSize === size
                    ? 'bg-[#D4FF00] text-[#050505] shadow-sm'
                    : 'bg-[#141412] text-[#F5F5F0]/60 border border-[#F5F5F0]/20 hover:border-[#D4FF00]/50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Deux boutons d'action en bas : [AR] et [VIDEO] */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onOpenAR(product)}
            data-cursor="AR 3D"
            className="flex-1 py-1.5 px-2 bg-[#141412] hover:bg-[#D4FF00]/10 border border-[#F5F5F0]/20 hover:border-[#D4FF00] text-[10px] font-mono tracking-widest text-[#F5F5F0]/90 hover:text-[#D4FF00] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            title="Visualisation en Réalité Augmentée"
          >
            <Box className="w-3 h-3 text-[#D4FF00]" />
            <span>[AR]</span>
          </button>

          <button
            onClick={() => onOpenVideo(product)}
            data-cursor="FILM"
            className="flex-1 py-1.5 px-2 bg-[#141412] hover:bg-[#D4FF00]/10 border border-[#F5F5F0]/20 hover:border-[#D4FF00] text-[10px] font-mono tracking-widest text-[#F5F5F0]/90 hover:text-[#D4FF00] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            title="Visionner le clip vidéo de la pièce"
          >
            <Video className="w-3 h-3 text-[#D4FF00]" />
            <span>[VIDEO]</span>
          </button>
        </div>
      </div>

      {/* Bouton d'achat principal : Serotoninn Volt #D4FF00 */}
      <div className="w-full">
        <button
          id={`buy-btn-${product.id}`}
          onClick={handleBuyClick}
          data-cursor="BUY"
          className="w-full py-3.5 px-4 bg-[#D4FF00] hover:bg-[#c2eb00] text-[#050505] font-mono tracking-[0.25em] text-sm uppercase font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg active:scale-[0.99] cursor-pointer"
        >
          {addedAnimation ? (
            <>
              <Check className="w-4 h-4 text-[#050505]" />
              <span>AJOUTÉ AU PANIER</span>
            </>
          ) : (
            <>
              <span>ACHETER</span>
              <span className="text-xs font-normal opacity-80">({product.price} {product.currency})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
