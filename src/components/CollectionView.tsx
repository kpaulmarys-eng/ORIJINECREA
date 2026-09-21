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
  User,
} from 'lucide-react';
import { BlurUpImage } from './BlurUpImage';
import { PRODUCTS, BRAND_INFO } from '../data/brandData';
import { GarmentProduct, UserProfile } from '../types';
import { Footer } from './Footer';
import { formatPrice } from '../utils/formatters';
import officialLogo from '../assets/images/logo_official.png';
import logoTextOfficial from '../assets/images/logo_text_official.png';

interface CollectionViewProps {
  onBack: () => void;
  onAddToCart: (product: GarmentProduct, size: string) => void;
  onOpenAR: (product: GarmentProduct) => void;
  onOpenVideo: (product: GarmentProduct) => void;
  onNavigateToSection?: (sectionId: string) => void;
  onOpenCart?: (tab?: 'cart' | 'tracking') => void;
  onOpenAccount?: () => void;
  cartCount?: number;
  hasActiveOrder?: boolean;
  user?: UserProfile | null;
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  onBack,
  onAddToCart,
  onOpenAR,
  onOpenVideo,
  onNavigateToSection,
  onOpenCart,
  onOpenAccount,
  cartCount,
  hasActiveOrder = false,
  user = null,
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
    <div className="relative min-h-[100dvh] bg-[#000000] text-[#FFFAFA] flex flex-col justify-between overflow-x-clip selection:bg-[#F6D110] selection:text-[#1F1F1C]">
      {/* DYNAMIC ATMOSPHERE HALO */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-colors duration-1000 ease-out"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${dynamicAtmosphereColor}40 0%, ${dynamicAtmosphereColor}10 30%, transparent 60%)`,
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#000000]/85 px-6 py-4 backdrop-blur-xl sm:px-12">
        <button
          onClick={onBack}
          aria-label="Retour à l'accueil NEÏROUA"
          className="focus:outline-none transition-opacity hover:opacity-85 cursor-pointer flex items-center"
        >
          <img src={logoTextOfficial} alt="Logo NEÏROUA" className="h-8 sm:h-9 w-auto object-contain select-none" />
        </button>

        <div className="flex items-center gap-3 sm:gap-6">
          {hasActiveOrder && onOpenCart && (
            <button
              onClick={() => onOpenCart('tracking')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6D110]/10 border border-[#F6D110]/40 text-[#F6D110] font-ui text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#F6D110] hover:text-[#1F1F1C] transition-all cursor-pointer shadow-[0_0_10px_rgba(246,209,16,0.15)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#F6D110] animate-pulse" />
              <span>SUIVI</span>
            </button>
          )}

          {/* User Profile Button */}
          {onOpenAccount && (
            <button
              type="button"
              data-cursor="ACCOUNT"
              onClick={onOpenAccount}
              aria-label="Espace Compte NEÏROUA"
              className="relative flex items-center justify-center p-1.5 rounded-full hover:bg-white/10 hover:text-[#F6D110] transition-colors cursor-pointer text-[#FFFAFA]"
            >
              {user ? (
                <span className="w-6 h-6 rounded-full bg-[#10100E] border-2 border-[#F6D110] text-[#F6D110] font-display text-[11px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(246,209,16,0.25)]">
                  {user.name.trim().charAt(0).toUpperCase()}
                </span>
              ) : (
                <User size={16} strokeWidth={1.5} />
              )}
            </button>
          )}

          {onOpenCart && (
            <button
              onClick={() => onOpenCart(hasActiveOrder && (cartCount ?? 0) === 0 ? 'tracking' : 'cart')}
              className="relative flex items-center gap-2 font-ui text-[11px] uppercase tracking-[.25em] text-[#FFFAFA] hover:text-[#F6D110] transition-colors cursor-pointer"
            >
              <ShoppingBag size={14} />
              <span className="hidden sm:inline">PANIER</span>
              {(cartCount ?? 0) > 0 ? (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#F6D110] text-[9px] font-bold text-black">
                  {cartCount}
                </span>
              ) : hasActiveOrder ? (
                <span className="w-2 h-2 rounded-full bg-[#F6D110] shadow-[0_0_6px_#F6D110]" />
              ) : null}
            </button>
          )}

          <button
            onClick={onBack}
            className="flex items-center gap-2 font-ui text-[10px] uppercase tracking-[.25em] text-[#FFFAFA]/60 hover:text-[#F6D110] transition-colors"
          >
            <ArrowLeft size={12} strokeWidth={1.5} />
            <span>RETOUR</span>
          </button>
        </div>
      </header>

      <main className="relative flex-1 flex flex-col items-center pt-8 pb-12 z-10 w-full overflow-visible">
        
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
        <div className="relative w-full max-w-[1200px] min-h-[700px] sm:min-h-[760px] flex items-center justify-center my-4 overflow-visible">
          
          <motion.div 
            className="w-full h-full flex items-center justify-center absolute overflow-visible"
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
                const zIndex = isHovered ? 60 : 50 - Math.abs(offset);
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
                      } else {
                        setHoveredCardId(prev => prev === product.id ? null : product.id);
                      }
                    }}
                    onMouseEnter={() => isActive && setHoveredCardId(product.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    style={cardStyle}
                    className={`absolute flex flex-col rounded-[24px] shadow-2xl transition-all duration-300
                      ${isActive ? 'w-[320px] sm:w-[410px] cursor-default' : 'w-[280px] sm:w-[320px] cursor-pointer brightness-50'}
                      ${isHovered 
                        ? 'min-h-[660px] sm:min-h-[700px] h-auto pb-6 overflow-visible shadow-[0_25px_60px_rgba(0,0,0,0.85)] ring-1 ring-white/20' 
                        : 'h-[490px] sm:h-[530px] overflow-hidden'
                      }
                    `}
                  >
                    {/* Inner Content - Image container scales gracefully on hover */}
                    <div className={`relative w-full shrink-0 bg-black/40 flex items-center justify-center p-4 rounded-t-[24px] transition-all duration-300 ${
                      isHovered ? 'h-[250px] sm:h-[280px]' : 'h-[360px] sm:h-[400px]'
                    }`}>
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
                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-ui text-[9px] uppercase tracking-widest text-[#F6D110] mb-1">
                            {product.collection}
                          </p>
                          <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-white leading-tight">
                            {product.name}
                          </h3>
                        </div>
                        <span className="font-display text-lg sm:text-xl font-bold text-white whitespace-nowrap pl-2">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      {/* Expandable Details (Only visible when active AND hovered) */}
                      <div className={`transition-all duration-500 flex flex-col gap-3.5
                        ${isHovered ? 'max-h-[600px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0 overflow-hidden pointer-events-none'}
                      `}>
                        <p className="font-ui text-[10px] sm:text-xs text-white/70 line-clamp-2">
                          {currentView?.description || product.tagline}
                        </p>

                        {/* View Switcher */}
                        <div className="flex gap-1.5">
                          {product.views.map((v, vI) => (
                            <button
                              key={v.type}
                              onClick={(e) => { e.stopPropagation(); setActiveViews(prev => ({...prev, [product.id]: vI})); }}
                              className={`flex-1 py-1.5 text-[9px] font-ui uppercase tracking-wider rounded-md border transition-colors ${
                                currentViewIdx === vI ? 'bg-white text-black border-white font-bold' : 'bg-transparent text-white/60 border-white/10 hover:border-white/30'
                              }`}
                            >
                              {v.label}
                            </button>
                          ))}
                        </div>

                        {/* Custom Color Selector (Pastilles) */}
                        {product.colors && (
                          <div className="flex gap-2 items-center">
                            <span className="font-ui text-[9px] uppercase text-white/50">COUL:</span>
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
                        <div className="flex items-center gap-2">
                          <span className="font-ui text-[9px] uppercase text-white/50">TAILLE:</span>
                          <div className="flex gap-1.5 flex-wrap">
                            {product.sizes.map((s) => (
                              <button
                                key={s}
                                onClick={(e) => { e.stopPropagation(); setSelectedSizes(prev => ({...prev, [product.id]: s})); }}
                                className={`w-8 h-8 rounded-md font-ui text-[10px] uppercase font-bold border transition-colors ${
                                  currentSize === s ? 'bg-[#F6D110] text-black border-[#F6D110]' : 'bg-black/40 text-white border-white/20 hover:border-white/50'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* CTA - 100% visible, Jaune Vif #F6D110, unclipped and prominent */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBuy(product); }}
                          disabled={isAdded}
                          className={`w-full py-3.5 px-5 rounded-full font-ui text-[11px] uppercase tracking-[.25em] font-bold shadow-lg transition-all duration-200 mt-2 shrink-0 ${
                            isAdded 
                              ? 'bg-white text-black' 
                              : 'bg-[#F6D110] text-black hover:bg-white hover:scale-[1.02] active:scale-[0.98]'
                          }`}
                        >
                          {isAdded ? (
                            <span className="flex items-center justify-center gap-2"><Check size={15} /> AJOUTÉ AU PANIER</span>
                          ) : (
                            <span className="flex items-center justify-center gap-2"><ShoppingBag size={15} /> ACHETER // {formatPrice(product.price)}</span>
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
          <div className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 z-40">
            <button 
              onClick={() => setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems)} 
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              aria-label="Pièce précédente"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 z-40">
            <button 
              onClick={() => setActiveIndex((prev) => (prev + 1) % totalItems)} 
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              aria-label="Pièce suivante"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Carousel Position Indicator */}
        <div className="flex items-center justify-center gap-3 mt-4 font-ui text-[10px] uppercase tracking-[.3em] text-white/40">
          <span>{activeIndex + 1} / {totalItems}</span>
          <span>•</span>
          <span>{activeProduct?.name}</span>
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

      {/* 2. FOOTER - Intégration du Footer identique avec marge généreuse pour un dépliage sans heurt */}
      <div className="w-full mt-24 sm:mt-32 relative z-20">
        <Footer
          onNavigateToCollection={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateToSection={onNavigateToSection}
        />
      </div>
    </div>
  );
};
