import React, { useState } from 'react';
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
import { CustomCursor } from './components/CustomCursor';
import { GarmentProduct, CartItem } from './types';

export default function App() {
  // 1. Loading screen state (game health bar in deep black & starry sky)
  const [isLoaded, setIsLoaded] = useState(false);

  // Active view routing: 'home' | 'collection' | 'visualisation' | 'video'
  const [currentView, setCurrentView] = useState<
    'home' | 'collection' | 'visualisation' | 'video'
  >('home');

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals state
  const [arProduct, setArProduct] = useState<any>(null);
  const [isArOpen, setIsArOpen] = useState(false);

  const [videoProduct, setVideoProduct] = useState<any>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Cart actions
  const handleAddToCart = (product: GarmentProduct, size: string) => {
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
        onComplete={() => setIsLoaded(true)}
      />

      {/* Main Layout rendered after initial load */}
      <div
        className={`transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Navigation Bar (visible across views with 4 requested sections) */}
        {currentView === 'home' && (
          <Navbar
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
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

      {/* E-Commerce Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
