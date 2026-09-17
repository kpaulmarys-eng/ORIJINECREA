import React from 'react';
import { BRAND_INFO, BRAND_COLORS } from '../data/brandData';
import { MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigateToCollection?: () => void;
  onNavigateToSection?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateToCollection,
  onNavigateToSection,
}) => {
  const scrollToSection = (id: string) => {
    if (onNavigateToSection) {
      onNavigateToSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer
      data-testid="site-footer"
      className="border-t border-[#FFFAFA]/15 bg-[#141412] px-6 pb-12 pt-16 text-[#FFFAFA] sm:px-12 sm:pt-24"
    >
      <div className="grid gap-12 border-b border-[#FFFAFA]/15 pb-16 lg:grid-cols-[1.5fr_1fr_1fr] max-w-7xl mx-auto">
        {/* Brand Statement & Origin */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#F6D110]">✦</span>
            <span className="font-logo whitespace-nowrap text-[#FFFAFA] text-[clamp(1.8rem,4vw,3rem)] tracking-[.18em] font-semibold">
              NEÏROUA
            </span>
          </div>

          <p className="mt-4 max-w-sm font-ui text-sm font-light leading-relaxed text-[#FFFAFA]/75">
            {BRAND_INFO.description}
          </p>

          <p className="mt-4 font-ui text-xs uppercase tracking-[.3em] text-[#F6D110] font-semibold">
            {BRAND_INFO.slogan}
          </p>
        </div>

        {/* Section Navigation Links */}
        <div>
          <h4 className="font-ui text-xs uppercase tracking-[.3em] text-[#FFFAFA]/50 font-semibold mb-6">
            NAVIGATION
          </h4>
          <nav className="flex flex-col gap-3 font-ui text-xs uppercase tracking-[.25em] text-[#FFFAFA]/80">
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="hover:text-[#F6D110] transition-colors text-left cursor-pointer"
            >
              À Propos de Nous
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('ego')}
              className="hover:text-[#F6D110] transition-colors text-left cursor-pointer"
            >
              EGO // Manifeste
            </button>
            <button
              type="button"
              onClick={onNavigateToCollection}
              className="hover:text-[#F6D110] transition-colors text-left cursor-pointer"
            >
              Collection
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('iconic-pieces')}
              className="hover:text-[#F6D110] transition-colors text-left cursor-pointer"
            >
              Pièces Iconiques
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('experiences')}
              className="hover:text-[#F6D110] transition-colors text-left cursor-pointer"
            >
              Expériences 3D & Runway
            </button>
          </nav>
        </div>

        {/* Official Contacts & Coordinates */}
        <div>
          <h4 className="font-ui text-xs uppercase tracking-[.3em] text-[#FFFAFA]/50 font-semibold mb-6">
            ATELIER & CONTACTS
          </h4>
          <div className="space-y-3 font-ui text-xs tracking-wider text-[#FFFAFA]/80">
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-[#F6D110] shrink-0" />
              <span>{BRAND_INFO.contact.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={13} className="text-[#F6D110] shrink-0" />
              <a
                href={`tel:${BRAND_INFO.contact.phone.replace(/\s+/g, '')}`}
                className="hover:text-[#F6D110] transition-colors"
              >
                {BRAND_INFO.contact.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={13} className="text-[#F6D110] shrink-0" />
              <a
                href={`mailto:${BRAND_INFO.contact.email}`}
                className="hover:text-[#F6D110] transition-colors"
              >
                {BRAND_INFO.contact.email}
              </a>
            </div>

            <div className="pt-4 flex gap-4 text-[#FFFAFA]/60 font-ui text-[11px] tracking-widest">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#F6D110] transition-colors"
              >
                INSTAGRAM
              </a>
              <span>•</span>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#F6D110] transition-colors"
              >
                TIKTOK
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Line */}
      <div className="flex flex-col justify-between items-center gap-3 pt-8 font-ui text-[10px] uppercase tracking-[.25em] text-[#FFFAFA]/40 sm:flex-row max-w-7xl mx-auto">
        <span>© {new Date().getFullYear()} NEÏROUA // PATRIMOINE COLLECTIF</span>
        <span>ABIDJAN — PARIS — TOKYO</span>
      </div>
    </footer>
  );
};
