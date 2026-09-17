import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Box,
  Video,
  Sparkles,
  ShoppingBag,
  Check,
  MapPin,
  Maximize2,
} from 'lucide-react';
import { BlurUpImage } from './BlurUpImage';
import { Footer } from './Footer';
import { GarmentProduct } from '../types';
import { PRODUCTS, BRAND_INFO } from '../data/brandData';

interface CollectionViewProps {
  onBack: () => void;
  onAddToCart: (product: GarmentProduct, size: string) => void;
  onOpenAR: (product?: GarmentProduct) => void;
  onOpenVideo: (product?: GarmentProduct) => void;
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  onBack,
  onAddToCart,
  onOpenAR,
  onOpenVideo,
}) => {
  const [activeGender, setActiveGender] = useState<'homme' | 'femme' | 'tous'>('homme');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeViews, setActiveViews] = useState<{ [productId: string]: number }>({});
  const [selectedSizes, setSelectedSizes] = useState<{ [productId: string]: string }>({});
  const [hoveredCardOffset, setHoveredCardOffset] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [addedIds, setAddedIds] = useState<{ [productId: string]: boolean }>({});
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Drag / Swipe tracking state
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Auto-scroll interval & timeout refs for hover navigation
  const hoverScrollTimeoutRef = useRef<number | null>(null);
  const hoverScrollIntervalRef = useRef<number | null>(null);

  // Resize listener for fluid responsive perspective calculations
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (hoverScrollTimeoutRef.current) clearTimeout(hoverScrollTimeoutRef.current);
      if (hoverScrollIntervalRef.current) clearInterval(hoverScrollIntervalRef.current);
    };
  }, []);

  // Filter products by gender
  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeGender === 'tous') return true;
    return p.gender === activeGender;
  });

  const totalItems = filteredProducts.length;

  // Reset current index when category changes
  const handleSelectGender = (gender: 'homme' | 'femme' | 'tous') => {
    setActiveGender(gender);
    setCurrentIndex(0);
  };

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalItems]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleSelectProduct = (index: number) => {
    setCurrentIndex((index + totalItems) % totalItems);
  };

  // Handlers for hover-to-scroll based on card position (offset)
  const handleCardMouseEnter = (offset: number) => {
    setHoveredCardOffset(offset);

    // If card is on the left or right, start hover auto-scroll
    if (offset !== 0) {
      if (hoverScrollTimeoutRef.current) clearTimeout(hoverScrollTimeoutRef.current);
      if (hoverScrollIntervalRef.current) clearInterval(hoverScrollIntervalRef.current);

      hoverScrollTimeoutRef.current = window.setTimeout(() => {
        if (offset < 0) {
          handlePrev();
        } else if (offset > 0) {
          handleNext();
        }

        hoverScrollIntervalRef.current = window.setInterval(() => {
          if (offset < 0) {
            handlePrev();
          } else if (offset > 0) {
            handleNext();
          }
        }, 750);
      }, 300);
    }
  };

  const handleCardMouseLeave = () => {
    setHoveredCardOffset(null);
    if (hoverScrollTimeoutRef.current) {
      clearTimeout(hoverScrollTimeoutRef.current);
      hoverScrollTimeoutRef.current = null;
    }
    if (hoverScrollIntervalRef.current) {
      clearInterval(hoverScrollIntervalRef.current);
      hoverScrollIntervalRef.current = null;
    }
  };

  // Drag & Swipe event handlers
  const handlePointerDown = (clientX: number) => {
    setDragStartX(clientX);
    setIsDragging(false);
  };

  const handlePointerMove = (clientX: number) => {
    if (dragStartX === null) return;
    if (Math.abs(clientX - dragStartX) > 10) {
      setIsDragging(true);
    }
  };

  const handlePointerUp = (clientX: number) => {
    if (dragStartX !== null) {
      const deltaX = clientX - dragStartX;
      if (Math.abs(deltaX) > 40) {
        if (deltaX > 0) {
          handlePrev(); // swiped right -> previous
        } else {
          handleNext(); // swiped left -> next
        }
      }
    }
    setDragStartX(null);
    setTimeout(() => setIsDragging(false), 80);
  };

  const getProductView = (productId: string) => activeViews[productId] || 0;

  const handleSelectView = (productId: string, viewIdx: number) => {
    setActiveViews((prev) => ({
      ...prev,
      [productId]: viewIdx,
    }));
  };

  const handleSelectSize = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const handleBuy = (product: GarmentProduct) => {
    const size = selectedSizes[product.id] || product.sizes[0] || 'L';
    onAddToCart(product, size);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setToastMessage(`${product.name} (Taille ${size}) ajouté au panier.`);
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Visible perspective range offsets: from -4 to +4 (9 perspective slots fanning out to screen edges)
  const PERSPECTIVE_OFFSETS = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

  // Dynamic horizontal overlap step based on screen size
  const stepX = windowWidth < 640 ? 150 : windowWidth < 1024 ? 210 : 255;

  return (
    <div className="noise min-h-[100dvh] bg-[#141412] text-[#FFFAFA] flex flex-col justify-between overflow-x-hidden">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#FFFAFA]/10 bg-[#141412]/90 px-6 py-5 backdrop-blur-xl sm:px-12">
        <button
          type="button"
          onClick={onBack}
          aria-label="Accueil NEÏROUA"
          data-cursor="HOME"
          className="font-logo text-[13px] font-semibold tracking-[.26em] text-[#FFFAFA] hover:text-[#F6D110] transition-colors cursor-pointer flex items-center gap-2"
        >
          <span className="text-[#F6D110] text-sm">✦</span>
          <span>NEÏROUA</span>
        </button>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={onBack}
            data-cursor="BACK"
            className="flex items-center gap-2 font-ui text-[11px] uppercase tracking-[.28em] text-[#FFFAFA]/70 hover:text-[#F6D110] transition-colors cursor-pointer"
          >
            <ArrowLeft size={13} strokeWidth={1.5} />
            <span>RETOUR À L'ACCUEIL</span>
          </button>
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden pb-12">
        {/* Subtle Map / Heritage Texture in Background (evoking the antique map aesthetic of Travel2.jpg) */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#F6D110_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-[#F6D110]/[0.025] blur-[150px] pointer-events-none" />

        {/* Editorial Section Header */}
        <section className="relative z-10 mx-auto max-w-7xl px-6 pt-10 pb-6 sm:px-12 sm:pt-14 sm:pb-8 text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F6D110]/40 bg-[#1E1E1B] px-3.5 py-1 font-ui text-[10px] uppercase tracking-[.35em] text-[#F6D110] font-semibold mb-3">
              <Sparkles size={11} className="text-[#F6D110]" />
              <span>{BRAND_INFO.tag}</span>
            </div>

            <h1 className="font-display text-[clamp(2.8rem,7vw,6.5rem)] font-bold leading-[.85] tracking-[-.03em] text-[#FFFAFA]">
              CATALOGUE ARCHITECTURAL
            </h1>

            <p className="mt-3 max-w-2xl font-ui text-sm sm:text-base font-light text-[#FFFAFA]/75 leading-relaxed">
              Perspective immersive à perte de vue. Faites défiler les silhouettes ou cliquez sur n'importe quelle carte pour la placer au centre.
            </p>
          </motion.div>

          {/* Gender Filter Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center sm:justify-start gap-3 border-b border-[#FFFAFA]/10 pb-5">
            <span className="font-ui text-xs uppercase tracking-[.3em] text-[#FFFAFA]/40 mr-1 hidden sm:inline">
              SÉLECTION :
            </span>

            <button
              type="button"
              onClick={() => handleSelectGender('homme')}
              className={`rounded-full px-5 py-2 font-ui text-xs uppercase tracking-[.25em] font-semibold transition-all cursor-pointer ${
                activeGender === 'homme'
                  ? 'bg-[#F6D110] text-[#1F1F1C] shadow-[0_4px_20px_rgba(246,209,16,0.3)]'
                  : 'bg-[#1C1C19] text-[#FFFAFA]/70 border border-[#FFFAFA]/15 hover:border-[#F6D110]/50 hover:text-[#FFFAFA]'
              }`}
            >
              SECTION HOMME ({PRODUCTS.filter((p) => p.gender === 'homme').length})
            </button>

            <button
              type="button"
              onClick={() => handleSelectGender('femme')}
              className={`rounded-full px-5 py-2 font-ui text-xs uppercase tracking-[.25em] font-semibold transition-all cursor-pointer ${
                activeGender === 'femme'
                  ? 'bg-[#F6D110] text-[#1F1F1C] shadow-[0_4px_20px_rgba(246,209,16,0.3)]'
                  : 'bg-[#1C1C19] text-[#FFFAFA]/70 border border-[#FFFAFA]/15 hover:border-[#F6D110]/50 hover:text-[#FFFAFA]'
              }`}
            >
              SECTION FEMME ({PRODUCTS.filter((p) => p.gender === 'femme').length})
            </button>

            <button
              type="button"
              onClick={() => handleSelectGender('tous')}
              className={`rounded-full px-5 py-2 font-ui text-xs uppercase tracking-[.25em] font-semibold transition-all cursor-pointer ${
                activeGender === 'tous'
                  ? 'bg-[#F6D110] text-[#1F1F1C] shadow-[0_4px_20px_rgba(246,209,16,0.3)]'
                  : 'bg-[#1C1C19] text-[#FFFAFA]/70 border border-[#FFFAFA]/15 hover:border-[#F6D110]/50 hover:text-[#FFFAFA]'
              }`}
            >
              TOUT LE CATALOGUE ({PRODUCTS.length})
            </button>
          </div>
        </section>

        {/* 3D PERSPECTIVE COVERFLOW STAGE:
            - Drag & Swipe support (Glisser à gauche ou à droite)
            - Survol d'une carte latérale active le défilement vers la gauche ou la droite
            - Cartes en carré plié au repos, et dépliage fluide au survol
        */}
        <div className="relative w-full py-6 sm:py-10 flex flex-col items-center justify-center select-none">
          {/* Coverflow Stage Canvas with Drag & Swipe Handlers */}
          <div
            onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
            onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
            onTouchEnd={(e) => handlePointerUp(e.changedTouches[0].clientX)}
            onMouseDown={(e) => handlePointerDown(e.clientX)}
            onMouseMove={(e) => handlePointerMove(e.clientX)}
            onMouseUp={(e) => handlePointerUp(e.clientX)}
            onMouseLeave={handleCardMouseLeave}
            className={`relative w-full h-[580px] sm:h-[640px] flex items-center justify-center overflow-visible ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {PERSPECTIVE_OFFSETS.map((offset) => {
              // Wrap indices around circular array
              const productIndex =
                (currentIndex + offset + totalItems * 100) % totalItems;
              const product = filteredProducts[productIndex];
              if (!product) return null;

              const isCenter = offset === 0;
              const absOffset = Math.abs(offset);
              const isHovered = hoveredCardOffset === offset;

              // Perspective calculations:
              // Scale decreases as cards get further from center
              const scale = Math.max(0.52, 1 - absOffset * 0.125);
              const translateX = offset * stepX;
              const translateY = absOffset * 6; // Slight natural curvature
              const zIndex = isHovered ? 60 : 50 - absOffset * 6;
              const opacity = Math.max(0.25, 1 - absOffset * 0.18);
              const brightness = Math.max(0.48, 1 - absOffset * 0.13);

              const viewIdx = getProductView(product.id);
              const currentView = product.views[viewIdx] || product.views[0];
              const selectedSize =
                selectedSizes[product.id] || product.sizes[0] || 'L';
              const isAdded = addedIds[product.id];

              return (
                <motion.div
                  key={`${product.id}-${offset}`}
                  onMouseEnter={() => handleCardMouseEnter(offset)}
                  onMouseLeave={handleCardMouseLeave}
                  onClick={(e) => {
                    if (isDragging) return;
                    if (!isCenter) {
                      e.stopPropagation();
                      handleSelectProduct(currentIndex + offset);
                    }
                  }}
                  animate={{
                    x: translateX,
                    y: translateY,
                    scale: scale,
                    zIndex: zIndex,
                    opacity: opacity,
                    filter: `brightness(${brightness})`,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 26,
                    mass: 0.8,
                  }}
                  style={{
                    position: 'absolute',
                    transformOrigin: 'center center',
                    cursor: isCenter
                      ? isDragging
                        ? 'grabbing'
                        : 'grab'
                      : offset < 0
                      ? 'w-resize'
                      : 'e-resize',
                  }}
                  className="w-[300px] sm:w-[340px] md:w-[360px]"
                >
                  {/* Directional hover pill for side cards */}
                  {!isCenter && isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap rounded-full bg-[#141412]/95 border border-[#F6D110] px-3 py-1 font-ui text-[9px] uppercase tracking-widest text-[#F6D110] shadow-xl pointer-events-none"
                    >
                      {offset < 0 ? '◀ DÉFILER VERS LA GAUCHE' : 'DÉFILER VERS LA DROITE ▶'}
                    </motion.div>
                  )}

                  {/* The Card:
                      - Resting state: CARRÉ PLIÉ (aspect-square with compact sleek info)
                      - Hovered state: DÉPLIAGE FLUIDE vers le bas avec tous les détails architecturaux
                  */}
                  <article
                    className={`relative overflow-hidden rounded-[32px] bg-[#FDFDFB] text-[#141412] transition-all duration-500 ease-out ${
                      isHovered
                        ? 'shadow-[0_35px_80px_-15px_rgba(0,0,0,0.95)] ring-2 ring-[#F6D110]'
                        : isCenter
                        ? 'shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-black/10'
                        : 'shadow-[0_15px_35px_-10px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.75)]'
                    }`}
                  >
                    {/* Top Section: Rounded Garment Photo Stage */}
                    <div className="relative aspect-square sm:aspect-[4/3] w-full p-2.5">
                      <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-[#181816] flex items-center justify-center">
                        <BlurUpImage
                          src={currentView.image}
                          alt={`${product.name} - ${currentView.label}`}
                          containerClassName="w-full h-full flex items-center justify-center"
                          className="object-contain w-full h-full p-3 transition-transform duration-500 hover:scale-105"
                        />

                        {/* Top Badge: Edition */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-[#1F1F1C]/80 backdrop-blur-md px-2.5 py-1 text-[9px] font-ui font-semibold uppercase tracking-wider text-[#FFFAFA] border border-white/10">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#F6D110]" />
                          <span>VOL. 01</span>
                        </div>

                        {/* Folded / Unfolded status badge */}
                        <div className="absolute top-2.5 right-2.5 rounded-full bg-[#1F1F1C]/80 backdrop-blur-md px-2.5 py-1 text-[8px] font-ui font-semibold uppercase tracking-widest text-[#F6D110] border border-white/10">
                          {isHovered ? 'DÉPLIÉ' : 'CARRÉ PLIÉ'}
                        </div>

                        {/* Multi-Angle Switcher (revealed when unfolded/hovered) */}
                        <div
                          className={`absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1 rounded-full bg-[#1F1F1C]/90 p-1 backdrop-blur-md border border-white/10 shadow-lg transition-all duration-300 ${
                            isHovered
                              ? 'opacity-100 translate-y-0 pointer-events-auto'
                              : 'opacity-0 translate-y-2 pointer-events-none'
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
                              className={`rounded-full px-2 py-0.5 font-ui text-[8px] uppercase tracking-wider transition-colors cursor-pointer ${
                                viewIdx === vI
                                  ? 'bg-[#F6D110] text-[#1F1F1C] font-bold'
                                  : 'text-[#FFFAFA]/70 hover:text-[#FFFAFA]'
                              }`}
                            >
                              {v.label.replace('VUE ', '')}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Middle Section: Permanent Core Info (Name, Location & Price) */}
                    <div className="px-5 pt-2 pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-sans font-bold text-lg sm:text-xl text-[#141412] uppercase tracking-tight leading-tight truncate">
                            {product.name}
                          </h3>
                          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[#141412]/65 font-medium">
                            <MapPin size={12} className="text-[#0C5FB3] shrink-0" />
                            <span className="truncate">Abidjan • {product.collection}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-ui text-lg sm:text-xl font-bold text-[#141412] leading-none block">
                            {product.price} {product.currency}
                          </span>
                          <span className="text-[9px] font-ui uppercase tracking-wider text-[#141412]/50 block mt-0.5">
                            {isHovered ? 'DISPONIBLE' : 'SURVOLER'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* DÉPLIAGE AU SURVOL: Smoothly opens to reveal the full Travel2 architecture details */}
                    <div
                      className={`grid transition-all duration-500 ease-in-out ${
                        isHovered
                          ? 'grid-rows-[1fr] opacity-100'
                          : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                      }`}
                    >
                      <div className="overflow-hidden px-5 pb-5 pt-1 border-t border-black/[0.06] space-y-3">
                        {/* Description block */}
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#141412]/80 block">
                            Description
                          </span>
                          <p className="mt-0.5 text-xs text-[#141412]/70 leading-relaxed line-clamp-2">
                            {product.tagline}
                          </p>
                        </div>

                        {/* 3-Column Attributes Row */}
                        <div className="grid grid-cols-3 gap-2 border-t border-black/[0.08] pt-2.5 text-center">
                          <div>
                            <span className="text-[9px] font-ui uppercase tracking-wider text-[#141412]/50 block">
                              DENSITÉ
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-[#0C5FB3] font-ui">
                              {product.weight || '420 GSM'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] font-ui uppercase tracking-wider text-[#141412]/50 block">
                              COUPE
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-[#0C5FB3] font-ui">
                              BOXY DROP
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] font-ui uppercase tracking-wider text-[#141412]/50 block">
                              NOTE
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-[#0C5FB3] font-ui">
                              4.9 ★
                            </span>
                          </div>
                        </div>

                        {/* Size Selector */}
                        <div className="pt-1 border-t border-black/[0.06] space-y-1.5">
                          <div className="flex items-center justify-between text-[9px] font-ui uppercase tracking-widest text-[#141412]/60">
                            <span>CHOIX TAILLE</span>
                            <span className="font-bold text-[#141412]">
                              {selectedSize}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            {product.sizes.map((sz) => (
                              <button
                                key={sz}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectSize(product.id, sz);
                                }}
                                className={`flex-1 py-1 rounded-md font-ui text-[10px] font-bold transition-all cursor-pointer ${
                                  selectedSize === sz
                                    ? 'bg-[#141412] text-[#FFFAFA]'
                                    : 'bg-[#EEEEEC] text-[#141412]/75 hover:bg-[#E2E2DF]'
                                }`}
                              >
                                {sz}
                              </button>
                            ))}
                          </div>

                          {/* Quick AR & Video Buttons */}
                          <div className="flex gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenAR(product);
                              }}
                              className="flex-1 py-1 rounded-lg border border-black/10 bg-[#F4F4F2] hover:bg-[#141412] text-[#141412] hover:text-[#FFFAFA] transition-colors text-[9px] font-ui uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Box size={11} className="text-[#0C5FB3]" />
                              <span>AR 3D</span>
                            </button>

                            {onOpenVideo && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenVideo(product);
                                }}
                                className="flex-1 py-1 rounded-lg border border-black/10 bg-[#F4F4F2] hover:bg-[#141412] text-[#141412] hover:text-[#FFFAFA] transition-colors text-[9px] font-ui uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Video size={11} className="text-[#0C5FB3]" />
                                <span>VIDÉO</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Bottom Price & Circular Action Button */}
                        <div className="flex items-end justify-between pt-2 border-t border-black/[0.06]">
                          <div>
                            <span className="text-[9px] font-ui uppercase tracking-wider text-[#141412]/50 block">
                              PRIX TOTAL
                            </span>
                            <span className="font-ui text-xl font-bold text-[#141412] leading-none">
                              {product.price} {product.currency}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isCenter) {
                                handleSelectProduct(currentIndex + offset);
                              } else {
                                handleBuy(product);
                              }
                            }}
                            aria-label={`Ajouter ${product.name} au panier`}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer ${
                              isCenter
                                ? isAdded
                                  ? 'bg-[#0C5FB3] text-white scale-110'
                                  : 'bg-[#141412] hover:bg-[#F6D110] text-[#FFFAFA] hover:text-[#141412] hover:scale-105'
                                : 'bg-[#141412] text-white hover:bg-[#0C5FB3]'
                            }`}
                          >
                            {isCenter ? (
                              isAdded ? (
                                <Check size={16} strokeWidth={2.5} />
                              ) : (
                                <ShoppingBag size={16} />
                              )
                            ) : (
                              <Maximize2 size={15} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                </motion.div>
              );
            })}
          </div>

          {/* Perspective Controls Bar (Arrows, Pagination & Tactile Help) */}
          <div className="relative z-30 mt-6 flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Pièce précédente"
                className="w-12 h-12 rounded-full bg-[#1E1E1B] hover:bg-[#F6D110] text-[#FFFAFA] hover:text-[#141412] border border-[#FFFAFA]/15 hover:border-[#F6D110] flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="px-5 py-2 rounded-full bg-[#1E1E1B]/90 border border-[#FFFAFA]/15 font-ui text-xs uppercase tracking-[.25em] text-[#FFFAFA]">
                <span>{String(currentIndex + 1).padStart(2, '0')}</span>
                <span className="text-[#F6D110] mx-1.5 font-bold">/</span>
                <span className="text-[#FFFAFA]/50">{String(totalItems).padStart(2, '0')}</span>
              </div>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Pièce suivante"
                className="w-12 h-12 rounded-full bg-[#1E1E1B] hover:bg-[#F6D110] text-[#FFFAFA] hover:text-[#141412] border border-[#FFFAFA]/15 hover:border-[#F6D110] flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <p className="font-ui text-[11px] uppercase tracking-[.25em] text-[#FFFAFA]/40 text-center">
              GLISSEZ AVEC LA SOURIS/DOIGT OU SURVOLEZ LES CÔTÉS POUR DÉFILER AUTOMATIQUEMENT
            </p>
          </div>
        </div>
      </main>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full bg-[#141412] border border-[#F6D110] px-6 py-3.5 font-ui text-xs uppercase tracking-[.22em] text-[#FFFAFA] shadow-2xl backdrop-blur-xl"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F6D110] text-[#1F1F1C]">
              <Check size={12} strokeWidth={3} />
            </span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer onNavigateToCollection={() => {}} />
    </div>
  );
};

