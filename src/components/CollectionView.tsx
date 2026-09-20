import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import {
  ArrowLeft,
  ShoppingBag,
  Info,
  Maximize2,
  Video,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { BlurUpImage } from './BlurUpImage';
import { PRODUCTS, BRAND_INFO } from '../data/brandData';
import { GarmentProduct } from '../types';

interface CollectionViewProps {
  onBack: () => void;
  onAddToCart: (product: GarmentProduct, size: string) => void;
  onOpenAR: (product: GarmentProduct) => void;
  onOpenVideo: (product: GarmentProduct) => void;
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  onBack,
  onAddToCart,
  onOpenAR,
  onOpenVideo,
}) => {
  const [activeGender, setActiveGender] = useState<'homme' | 'femme' | 'tous'>('tous');
  const [activeIndex, setActiveIndex] = useState(0);
  
  const [activeViews, setActiveViews] = useState<{ [id: string]: number }>({});
  const [selectedSizes, setSelectedSizes] = useState<{ [id: string]: string }>({});
  const [addedIds, setAddedIds] = useState<{ [id: string]: boolean }>({});
  const [toastMessage, setToastMessage] = useState('');

  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  
  // Resize listener
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeGender === 'tous') return true;
    return p.gender === activeGender;
  });

  const totalItems = filteredProducts.length;

  useEffect(() => {
    setActiveIndex(0);
  }, [activeGender]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % totalItems);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalItems]);

  const handleBuy = (product: GarmentProduct) => {
    const size = selectedSizes[product.id] || product.sizes[0] || 'L';
    onAddToCart(product, size);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setToastMessage(`${product.name} (Taille ${size}) ajouté au panier.`);
    
    // Play success sound
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('Audio Context error', e);
    }

    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = offset.x;
    if (swipe < -50) {
      setActiveIndex((prev) => (prev + 1) % totalItems);
    } else if (swipe > 50) {
      setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
    }
  };

  // Get current active product to extract themeColor for dynamic atmosphere
  const activeProduct = filteredProducts[activeIndex];
  const dynamicAtmosphereColor = activeProduct?.themeColor || '#1F1F1C';

  return (
    <div className="relative min-h-[100dvh] bg-[#000000] text-[#FFFAFA] flex flex-col justify-between overflow-x-hidden">
      {/* DYNAMIC ATMOSPHERE HALO */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-colors duration-1000 ease-out"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${dynamicAtmosphereColor}40 0%, ${dynamicAtmosphereColor}10 30%, transparent 60%)`,
        }}
      />

      {/* Header */}
      <header className="relative z-50 flex items-center justify-between border-b border-white/5 bg-[#000000]/60 px-6 py-4 backdrop-blur-xl sm:px-12">
        <button
          onClick={onBack}
          className="font-logo text-[12px] font-semibold tracking-[.25em] text-[#FFFAFA] hover:text-[#F6D110] transition-colors flex items-center gap-2"
        >
          <span className="text-[#F6D110] text-sm">✦</span>
          <span>NEÏROUA</span>
        </button>

        <button
          onClick={onBack}
          className="flex items-center gap-2 font-ui text-[10px] uppercase tracking-[.25em] text-[#FFFAFA]/60 hover:text-[#F6D110] transition-colors"
        >
          <ArrowLeft size={12} strokeWidth={1.5} />
          <span>RETOUR</span>
        </button>
      </header>

      <main className="relative flex-1 flex flex-col items-center pt-8 pb-16 z-10 w-full overflow-hidden">
        
        {/* Category Filters */}
        <div className="flex gap-4 mb-8 sm:mb-12">
          {[
            { id: 'tous', label: 'COLLECTION COMPLÈTE' },
            { id: 'homme', label: 'MENSWEAR' },
            { id: 'femme', label: 'WOMENSWEAR' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveGender(cat.id as any)}
              className={`font-ui text-[9px] uppercase tracking-[.25em] px-4 py-1.5 rounded-full border transition-all ${
                activeGender === cat.id
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white/50 border-white/10 hover:border-white/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Swipeable Carousel Container */}
        <div className="relative w-full max-w-[1200px] h-[650px] sm:h-[700px] flex items-center justify-center">
          
          <motion.div 
            className="w-full h-full flex items-center justify-center absolute"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ touchAction: 'pan-y' }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {filteredProducts.map((product, idx) => {
                // Calculate position relative to active index
                let offset = idx - activeIndex;
                if (offset > totalItems / 2) offset -= totalItems;
                if (offset < -totalItems / 2) offset += totalItems;

                const isActive = offset === 0;
                // Only active card reacts to hover
                const isHovered = isActive && hoveredCardId === product.id;
                
                // Position physics
                const x = offset * (windowWidth < 640 ? 220 : 320);
                const scale = isActive ? 1 : 0.85;
                const zIndex = 50 - Math.abs(offset);
                const opacity = isActive ? 1 : Math.max(0, 1 - Math.abs(offset) * 0.4);
                
                const currentViewIdx = activeViews[product.id] || 0;
                const currentView = product.views?.[currentViewIdx] || product.views?.[0];
                const currentSize = selectedSizes[product.id] || product.sizes[0] || 'M';
                const isAdded = addedIds[product.id];
                const pThemeColor = product.themeColor || '#FFFFFF';

                // GLASSMORPHISM CARD STYLES
                const cardStyle = {
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  backgroundColor: `${pThemeColor}26`, // ~15% opacity hex
                  border: '1px solid rgba(255,255,255,0.1)',
                };

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={false}
                    animate={{
                      x,
                      scale,
                      opacity,
                      zIndex,
                      rotateY: offset * -15, // slight 3D rotation
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 30,
                    }}
                    onClick={() => {
                      if (!isActive) {
                        setActiveIndex(idx);
                      }
                    }}
                    onMouseEnter={() => isActive && setHoveredCardId(product.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    style={cardStyle}
                    className={`absolute flex flex-col overflow-hidden rounded-[24px] shadow-2xl transition-all duration-300
                      ${isActive ? 'w-[320px] sm:w-[400px] cursor-default' : 'w-[280px] sm:w-[320px] cursor-pointer brightness-50'}
                      ${isHovered ? 'h-[640px] sm:h-[680px]' : 'h-[500px] sm:h-[540px]'}
                    `}
                  >
                    {/* Inner Content */}
                    <div className="relative w-full h-[400px] shrink-0 bg-black/40 flex items-center justify-center p-4">
                      {currentView?.image && (
                        <BlurUpImage
                          src={currentView.image}
                          alt={product.name}
                          className="object-contain w-full h-full"
                          containerClassName="w-full h-full"
                        />
                      )}
                      
                      {/* Interactive Badges (AR/Video) - Only show if active */}
                      {isActive && (
                        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                          {product.arAvailable && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onOpenAR(product); }}
                              className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-[#F6D110] hover:text-black transition-colors"
                            >
                              <Maximize2 size={12} />
                            </button>
                          )}
                          {product.videoDuration && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onOpenVideo(product); }}
                              className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-[#F6D110] hover:text-black transition-colors"
                            >
                              <Video size={12} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Info Section */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-ui text-[9px] uppercase tracking-widest text-[#F6D110] mb-1">
                            {product.collection}
                          </p>
                          <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-white leading-tight">
                            {product.name}
                          </h3>
                        </div>
                        <span className="font-display text-lg font-bold text-white">
                          {product.price}{product.currency}
                        </span>
                      </div>

                      {/* Expandable Details (Only visible when active AND hovered) */}
                      <div className={`overflow-hidden transition-all duration-500 flex flex-col gap-4
                        ${isHovered ? 'max-h-[300px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}
                      `}>
                        <p className="font-ui text-[10px] sm:text-xs text-white/70">
                          {currentView?.description || product.tagline}
                        </p>

                        {/* View Switcher */}
                        <div className="flex gap-1.5">
                          {product.views.map((v, vI) => (
                            <button
                              key={v.type}
                              onClick={(e) => { e.stopPropagation(); setActiveViews(prev => ({...prev, [product.id]: vI})); }}
                              className={`flex-1 py-1.5 text-[9px] font-ui uppercase tracking-wider rounded-md border transition-colors ${
                                currentViewIdx === vI ? 'bg-white text-black border-white' : 'bg-transparent text-white/60 border-white/10 hover:border-white/30'
                              }`}
                            >
                              {v.label}
                            </button>
                          ))}
                        </div>

                        {/* Custom Color Selector (Pastilles) */}
                        {product.colors && (
                          <div className="flex gap-2 items-center">
                            <span className="font-ui text-[9px] uppercase text-white/50">Coul:</span>
                            {product.colors.map((color, cIdx) => (
                              <button
                                key={cIdx}
                                className={`w-4 h-4 rounded-full border border-white/20 hover:scale-110 transition-transform ${cIdx === 0 ? 'ring-1 ring-[#F6D110] ring-offset-2 ring-offset-black' : ''}`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        )}

                        {/* Size Selector */}
                        <div className="flex gap-2">
                          {product.sizes.map((s) => (
                            <button
                              key={s}
                              onClick={(e) => { e.stopPropagation(); setSelectedSizes(prev => ({...prev, [product.id]: s})); }}
                              className={`w-8 h-8 rounded-sm font-ui text-[10px] uppercase border transition-colors ${
                                currentSize === s ? 'bg-[#F6D110] text-black border-[#F6D110]' : 'bg-black/40 text-white border-white/20 hover:border-white/50'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>

                        {/* CTA */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBuy(product); }}
                          disabled={isAdded}
                          className={`w-full py-3 rounded-full font-ui text-[10px] uppercase tracking-[.25em] font-bold transition-all ${
                            isAdded ? 'bg-white text-black' : 'bg-[#F6D110] text-black hover:bg-white'
                          }`}
                        >
                          {isAdded ? (
                            <span className="flex items-center justify-center gap-2"><Check size={14} /> AJOUTÉ</span>
                          ) : (
                            <span className="flex items-center justify-center gap-2"><ShoppingBag size={14} /> ACHETER</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
          
          {/* Navigation Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 z-40">
            <button onClick={() => setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems)} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
              <ChevronLeft size={16} />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-4 z-40">
            <button onClick={() => setActiveIndex((prev) => (prev + 1) % totalItems)} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Global Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-10 z-[100] rounded-full border border-[#F6D110]/50 bg-[#141412]/95 px-6 py-3 font-ui text-[10px] uppercase tracking-[.25em] text-[#FFFAFA] shadow-2xl backdrop-blur-md flex items-center gap-3"
            >
              <Check size={14} className="text-[#F6D110]" />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
