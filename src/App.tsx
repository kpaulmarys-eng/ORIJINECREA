import React, { useState, useEffect } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { IconicPiecesSection } from './components/IconicPiecesSection';
import { AboutSection } from './components/AboutSection';
import { EgoManifesto } from './components/EgoManifesto';
import { ExperienceCoverFlow } from './components/ExperienceCoverFlow';
import { CollectionView } from './components/CollectionView';
import { VisualisationView } from './components/VisualisationView';
import { VideoExperienceView } from './components/VideoExperienceView';
import { Footer } from './components/Footer';
import { ARModal } from './components/ARModal';
import { VideoModal } from './components/VideoModal';
import { CartDrawer } from './components/CartDrawer';
import { AccountDrawer } from './components/AccountDrawer';
import { CustomCursor } from './components/CustomCursor';
import { GarmentProduct, CartItem, ActiveOrder, PastOrder, UserProfile } from './types';
import { VideoBannerSection } from './components/VideoBannerSection';
import { MarqueeBands } from './components/MarqueeBands';
import { ScrollReveal } from './components/ScrollReveal';
import { formatFrenchDate } from './utils/formatters';
import { PRODUCTS } from './data/brandData';

import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Play sound helper
const playSound = (type: 'success' | 'error' | 'click') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    }
    
    osc.connect(gain);
    gain.connect(ctx.destination);
  } catch (e) {
    console.warn('Audio Context error', e);
  }
};

export default function App() {
  // 1. Loading screen state (game health bar in deep black & starry sky)
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLogoRevealed, setIsLogoRevealed] = useState(false);

  // Active view routing: 'home' | 'collection' | 'visualisation' | 'video'
  const [currentView, setCurrentView] = useState<
    'home' | 'collection' | 'visualisation' | 'video'
  >('home');

  // Cart & Tracking state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'cart' | 'tracking'>('cart');

  // Account & Historical Archives state
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('neiroua_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [pastOrders, setPastOrders] = useState<PastOrder[]>(() => {
    try {
      const saved = localStorage.getItem('neiroua_past_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Initial sample archive order
    return [
      {
        id: 'po-initial-9382',
        orderNumber: 'NR-7429',
        items: [
          {
            product: PRODUCTS[0],
            size: 'L',
            quantity: 1,
          },
        ],
        total: PRODUCTS[0].price,
        date: '12 septembre 2026',
        deliveredAt: '15 septembre 2026',
        status: 'delivered',
      },
    ];
  });

  // Keep localStorage synchronized with user profile
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('neiroua_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('neiroua_user');
      }
    } catch (e) {
      console.warn('Could not sync user to localStorage', e);
    }
  }, [user]);

  // Keep localStorage synchronized with past orders archive
  useEffect(() => {
    try {
      localStorage.setItem('neiroua_past_orders', JSON.stringify(pastOrders));
    } catch (e) {
      console.warn('Could not sync past orders to localStorage', e);
    }
  }, [pastOrders]);

  // Active Order state with durable persistence across sessions & drawer re-openings
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(() => {
    try {
      const saved = localStorage.getItem('neiroua_active_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Keep localStorage synchronized with activeOrder
  useEffect(() => {
    try {
      if (activeOrder) {
        localStorage.setItem('neiroua_active_order', JSON.stringify(activeOrder));
      } else {
        localStorage.removeItem('neiroua_active_order');
      }
    } catch (e) {
      console.warn('Could not sync active order to localStorage', e);
    }
  }, [activeOrder]);

  // Modals state
  const [arProduct, setArProduct] = useState<any>(null);
  const [isArOpen, setIsArOpen] = useState(false);

  const [videoProduct, setVideoProduct] = useState<any>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Open Cart Drawer with requested tab ('cart' | 'tracking')
  const handleOpenCart = (tab: 'cart' | 'tracking' = 'cart') => {
    playSound('click');
    setDrawerTab(tab);
    setIsCartOpen(true);
  };

  // Google Login simulation
  const handleGoogleLogin = () => {
    playSound('success');
    const mockUser: UserProfile = {
      id: 'usr-google-98214',
      name: 'Paul Marys',
      email: 'kpaulmarys@gmail.com',
      joinedDate: 'Membre Initié depuis 2024',
    };
    setUser(mockUser);
  };

  // Logout handler
  const handleLogout = () => {
    playSound('click');
    setUser(null);
    try {
      localStorage.removeItem('neiroua_user');
    } catch (e) {
      console.warn('Could not clear user', e);
    }
  };

  // Delete past order from archives
  const handleDeletePastOrder = (orderId: string) => {
    playSound('click');
    setPastOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  // Order confirmation handler
  const handleOrderConfirmed = (orderData: ActiveOrder) => {
    playSound('success');
    setActiveOrder(orderData);
    setDrawerTab('tracking');
    setIsCartOpen(true);
  };

  // Client confirms order reception ("COMMANDE REÇUE") -> transfers to pastOrders archive
  const handleCompleteOrder = () => {
    playSound('success');
    if (activeOrder) {
      const archivedOrder: PastOrder = {
        id: `po-${Date.now()}-${activeOrder.orderNumber}`,
        orderNumber: activeOrder.orderNumber,
        items: activeOrder.items,
        total: activeOrder.total,
        date: activeOrder.date,
        deliveredAt: formatFrenchDate(new Date()),
        status: 'delivered',
      };
      setPastOrders((prev) => [archivedOrder, ...prev]);
    }
    setActiveOrder(null);
    try {
      localStorage.removeItem('neiroua_active_order');
    } catch (e) {
      console.warn('Could not clear active order', e);
    }
  };

  // Exit action: Redirect to Collection
  const handleReturnToCollection = () => {
    setCurrentView('collection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart actions
  const handleAddToCart = (product: GarmentProduct, size: string) => {
    playSound('success');
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    setDrawerTab('cart');
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, size: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.size === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string, size: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.size === size))
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOpenAR = (product?: any) => {
    setArProduct(product);
    setIsArOpen(true);
  };

  const handleOpenVideo = (product?: any) => {
    setVideoProduct(product);
    setIsVideoOpen(true);
  };

  const handleNavigateToSection = (sectionId: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="noise relative min-h-screen bg-[#1F1F1C] text-[#FFFAFA] overflow-x-hidden selection:bg-[#F6D110] selection:text-[#1F1F1C]">
      {/* Interactive Custom Minimalist Tech Cursor */}
      <CustomCursor />

      {/* 1. ÉCRAN DE CHARGEMENT : NOIR PROFOND, ÉTOILES QUI SCINTILLENT, LOGO AU MILIEU, BARRE DE VIE JEU VIDÉO BLANCHE */}
      <LoadingScreen
        isComplete={isLoaded}
        onStartCrossfade={() => setIsLogoRevealed(true)}
        onComplete={() => setIsLoaded(true)}
      />

      {/* Main Layout rendered behind loading overlay */}
      <div className="relative">
        {/* Navigation Bar (visible across views with 4 requested sections) */}
        {currentView === 'home' && (
          <Navbar
            cartCount={totalCartCount}
            hasActiveOrder={Boolean(activeOrder)}
            user={user}
            onOpenCart={handleOpenCart}
            onOpenAccount={() => setIsAccountOpen(true)}
            onNavigateToCollection={() => {
              setCurrentView('collection');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToSection={handleNavigateToSection}
            currentView={currentView}
            isLogoRevealed={isLogoRevealed || isLoaded}
          />
        )}

        {/* Dynamic Route/View Switcher */}
        {currentView === 'collection' && (
          <CollectionView
            onBack={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAddToCart={handleAddToCart}
            onOpenAR={handleOpenAR}
            onOpenVideo={handleOpenVideo}
            onNavigateToSection={handleNavigateToSection}
            onOpenCart={handleOpenCart}
            onOpenAccount={() => setIsAccountOpen(true)}
            cartCount={totalCartCount}
            hasActiveOrder={Boolean(activeOrder)}
            user={user}
          />
        )}

        {currentView === 'visualisation' && (
          <VisualisationView
            onBack={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToCollection={() => {
              setCurrentView('collection');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'video' && (
          <VideoExperienceView
            onBack={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToCollection={() => {
              setCurrentView('collection');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'home' && (
          <main>
            {/* 1. HERO SECTION IMMERSIVE (Grand remplissage tout écran, diminue au scroll avec banderole) */}
            <HeroSection
              onOpenViewer={() => setCurrentView('visualisation')}
              onNavigateToCollection={() => {
                setCurrentView('collection');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onScrollToEgo={() => handleNavigateToSection('iconic-pieces')}
            />

            {/* 1.5 SECTION DE TRANSITION MONOLITHIQUE : MARQUEE 1 + VIDÉO + MARQUEE 2 (LAYOUT STRICT SANS ESPACE FLOTTANT) */}
            <div className="flex flex-col gap-0 w-full m-0 p-0 my-0 py-0 border-0">
              <div className="w-full m-0 p-0 my-0 py-0">
                <MarqueeBands />
              </div>
              <VideoBannerSection />
              <div className="w-full m-0 p-0 my-0 py-0">
                <MarqueeBands />
              </div>
            </div>

            {/* 2. PIÈCES ICONIQUES (Exactement 2 pièces, épurées, révélées au survol) */}
            <IconicPiecesSection
              onNavigateToCollection={() => {
                setCurrentView('collection');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onAddToCart={handleAddToCart}
              onOpenAR={handleOpenAR}
              onOpenVideo={handleOpenVideo}
            />

            {/* 3. À PROPOS DE NOUS (Section réduite, titre 'A propos de nous', texte exact du résumé) */}
            <AboutSection
              onNavigateToCollection={() => {
                setCurrentView('collection');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 4. MANIFESTE EGO (Philosophie de la collection 01 // EGO) */}
            <EgoManifesto />

            {/* 5. CHOISIS TON ANGLE (EXPÉRIENCES COVERFLOW GLASS SANS CONTOUR) */}
            <ExperienceCoverFlow
              onOpenVisualizer={() => {
                setCurrentView('visualisation');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenVideo={() => {
                setCurrentView('video');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectCollection={() => {
                setCurrentView('collection');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 6. LE FOOTER */}
            <Footer
              onNavigateToCollection={() => {
                setCurrentView('collection');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToSection={handleNavigateToSection}
            />
          </main>
        )}
      </div>

      {/* AR Modal */}
      <ARModal
        product={arProduct}
        isOpen={isArOpen}
        onClose={() => setIsArOpen(false)}
      />

      {/* Video Modal */}
      <VideoModal
        product={videoProduct}
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />

      {/* E-Commerce Cart & Tracking Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        activeOrder={activeOrder}
        initialTab={drawerTab}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onCheckout={(success: boolean) => {
          if (!success || cartItems.length === 0) {
            playSound('error');
          } else {
            playSound('success');
          }
        }}
        onOrderConfirmed={handleOrderConfirmed}
        onCompleteOrder={handleCompleteOrder}
        onNavigateToCollection={handleReturnToCollection}
      />

      {/* VIP & Initiate User Account Drawer */}
      <AccountDrawer
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        user={user}
        pastOrders={pastOrders}
        onLoginWithGoogle={handleGoogleLogin}
        onLogout={handleLogout}
        onDeletePastOrder={handleDeletePastOrder}
      />

      {/* STICKY GLOBAL CART & TRACKING BUTTON */}
      <AnimatePresence>
        {isLoaded && !isCartOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => handleOpenCart(activeOrder && totalCartCount === 0 ? 'tracking' : 'cart')}
            aria-label="Ouvrir le panier ou le suivi de commande"
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[80] flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#F6D110] text-[#1F1F1C] shadow-[0_10px_30px_rgba(246,209,16,0.35)] hover:scale-110 transition-transform cursor-pointer"
          >
            <ShoppingBag size={24} strokeWidth={2} />
            {totalCartCount > 0 ? (
              <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black shadow-md border border-[#1F1F1C]">
                {totalCartCount}
              </span>
            ) : activeOrder ? (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1F1F1C] border border-[#F6D110]">
                <span className="w-2 h-2 rounded-full bg-[#F6D110] animate-pulse" />
              </span>
            ) : null}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
