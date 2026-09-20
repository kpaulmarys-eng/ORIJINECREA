import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { BRAND_INFO, BRAND_COLORS } from '../data/brandData';
import officialLogo from '../assets/images/logo_official.png';
import logoTextOfficial from '../assets/images/logo_text_official.png';

interface NavbarProps {
  currentView: string;
  cartCount: number;
  onNavigateHome: () => void;
  onNavigateToCollection: () => void;
  onOpenCart: () => void;
  onNavigateToSection?: (sectionId: string) => void;
  isLogoRevealed?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  cartCount,
  onNavigateHome,
  onNavigateToCollection,
  onOpenCart,
  onNavigateToSection,
  isLogoRevealed = true,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'home') {
      onNavigateHome();
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } else {
      if (onNavigateToSection) {
        onNavigateToSection(sectionId);
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleCollectionClick = () => {
    setMobileMenuOpen(false);
    onNavigateToCollection();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        id="main-header"
        className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-5 text-[#FFFAFA] bg-[#1F1F1C]/85 backdrop-blur-xl border-b border-[#FFFAFA]/10 sm:px-12 sm:py-6"
      >
        {/* Brand Logo with Official Lockup (Symbol + Typography) */}
        <button
          type="button"
          data-testid="button-home-top"
          data-cursor="HOME"
          onClick={() => {
            onNavigateHome();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="Retour au début NEÏROUA"
          className="focus:outline-none transition-opacity hover:opacity-85 cursor-pointer flex items-center relative py-1"
        >
          <motion.div
            id="navbar-logo-target"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLogoRevealed ? 1 : 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center"
          >
            <img
              src={logoTextOfficial}
              alt="Logo NEÏROUA"
              className="h-8 sm:h-9 w-auto object-contain select-none"
            />
          </motion.div>
        </button>

        {/* Desktop Navigation Links EXACT SPEC:
            1. À PROPOS DE NOUS (avec un résumé de la marque)
            2. EGO (pour le résumé de la collection)
            3. COLLECTION (au milieu)
            4. EXPÉRIENCES
        */}
        <nav className="hidden items-center gap-8 font-ui text-[12px] uppercase tracking-[.28em] md:flex">
          <button
            type="button"
            data-cursor="LINK"
            onClick={() => handleNavClick('about')}
            className="hover:text-[#F6D110] transition-colors cursor-pointer text-[#FFFAFA]/85"
          >
            À PROPOS DE NOUS
          </button>

          <button
            type="button"
            data-cursor="LINK"
            onClick={() => handleNavClick('ego')}
            className="hover:text-[#F6D110] transition-colors cursor-pointer text-[#FFFAFA]/85"
          >
            EGO
          </button>

          {/* COLLECTION (au milieu) */}
          <button
            type="button"
            data-cursor="COLLECTION"
            onClick={handleCollectionClick}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer font-bold ${
              currentView === 'collection'
                ? 'bg-[#F6D110] text-[#1F1F1C] shadow-[0_2px_15px_rgba(246,209,16,0.35)]'
                : 'border border-[#F6D110]/40 text-[#F6D110] hover:bg-[#F6D110] hover:text-[#1F1F1C]'
            }`}
          >
            COLLECTION
          </button>

          <button
            type="button"
            data-cursor="LINK"
            onClick={() => handleNavClick('experiences')}
            className="hover:text-[#F6D110] transition-colors cursor-pointer text-[#FFFAFA]/85"
          >
            EXPÉRIENCES
          </button>
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-5">
          <button
            type="button"
            data-cursor="CART"
            onClick={onOpenCart}
            aria-label="Voir le panier"
            className="relative flex items-center justify-center p-2 rounded-full hover:bg-white/10 hover:text-[#F6D110] transition-colors cursor-pointer text-[#FFFAFA]"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F6D110] text-[#1F1F1C] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            data-testid="button-open-menu"
            data-cursor="MENU"
            className="flex items-center gap-2 font-ui text-[12px] uppercase tracking-[.25em] md:hidden hover:text-[#F6D110] transition-colors cursor-pointer text-[#FFFAFA]"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span>MENU</span>
            <Menu size={18} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Full-Screen Slide-Over Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            data-testid="mobile-menu"
            className="fixed inset-0 z-[60] flex flex-col justify-between bg-[#141412] px-8 py-8 text-[#FFFAFA]"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-[#FFFAFA]/10 pb-6">
              <div className="flex items-center">
                <img src={logoTextOfficial} alt="Logo NEÏROUA" className="h-8 w-auto object-contain" />
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fermer le menu"
                data-cursor="CLOSE"
                className="p-2 hover:text-[#F6D110] transition-colors cursor-pointer rounded-full bg-white/5"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-6 py-12">
              <button
                type="button"
                onClick={() => handleNavClick('about')}
                className="text-left font-display text-4xl font-semibold tracking-tight text-[#FFFAFA] hover:text-[#F6D110] transition-colors flex items-center justify-between"
              >
                <span>01. À PROPOS DE NOUS</span>
                <ArrowUpRight size={22} className="text-[#F6D110]" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('ego')}
                className="text-left font-display text-4xl font-semibold tracking-tight text-[#FFFAFA] hover:text-[#F6D110] transition-colors flex items-center justify-between"
              >
                <span>02. EGO // MANIFESTE</span>
                <ArrowUpRight size={22} className="text-[#F6D110]" />
              </button>

              <button
                type="button"
                onClick={handleCollectionClick}
                className="text-left font-display text-4xl font-semibold tracking-tight text-[#F6D110] transition-colors flex items-center justify-between"
              >
                <span>03. COLLECTION</span>
                <ArrowUpRight size={22} />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('experiences')}
                className="text-left font-display text-4xl font-semibold tracking-tight text-[#FFFAFA] hover:text-[#F6D110] transition-colors flex items-center justify-between"
              >
                <span>04. EXPÉRIENCES</span>
                <ArrowUpRight size={22} className="text-[#F6D110]" />
              </button>
            </nav>

            {/* Bottom Mobile Footer */}
            <div className="border-t border-[#FFFAFA]/10 pt-6">
              <p className="font-ui text-xs uppercase tracking-[.3em] text-[#F6D110] font-semibold">
                {BRAND_INFO.slogan}
              </p>
              <p className="mt-2 font-ui text-[11px] tracking-widest text-[#FFFAFA]/50">
                {BRAND_INFO.origin}
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
