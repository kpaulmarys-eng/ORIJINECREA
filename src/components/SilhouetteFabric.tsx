import React from 'react';

interface SilhouetteFabricProps {
  variant?: number;
  view?: number;
  className?: string;
  imageSrc?: string;
  label?: string;
  showDetails?: boolean;
}

export const SilhouetteFabric: React.FC<SilhouetteFabricProps> = ({
  variant = 0,
  view = 0,
  className = '',
  imageSrc,
  label,
  showDetails = true,
}) => {
  const views = ['FACE', 'DOS', 'CÔTÉ'];
  const currentViewLabel = label || views[view] || 'FACE';

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-[#070706] ${
        view === 2 ? 'skew-x-[-2deg]' : ''
      } ${className}`}
    >
      {/* Background Radial Light Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#262621_0%,#11110f_48%,#050505_100%)] pointer-events-none" />

      {/* Real Sculptural Image Display */}
      {imageSrc ? (
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
          <img
            src={imageSrc}
            alt="NEÏROUA Silhouette Sculpturale"
            className="h-full w-full object-cover object-center filter contrast-[1.18] brightness-[0.92] transition-transform duration-700 ease-out hover:scale-105"
            loading="eager"
          />
          {/* Subtle Studio Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-[#090909]/30 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#090909_100%)] opacity-60 pointer-events-none" />
        </div>
      ) : (
        /* Fallback: Geometric Fabric Sculpture */
        <div className="absolute left-1/2 top-[8%] h-[73%] w-[68%] -translate-x-1/2 pointer-events-none">
          <div
            className={`fabric-shape absolute inset-0 bg-gradient-to-br shadow-2xl ${
              variant === 1
                ? 'from-[#40443f] via-[#141815] to-[#050605]'
                : variant === 2
                ? 'from-[#383341] via-[#14131a] to-[#07060a]'
                : 'from-[#45433d] via-[#151514] to-[#050505]'
            }`}
          />
          {/* Collar oval */}
          <div className="absolute left-1/2 top-[3%] h-[14%] w-[16%] -translate-x-1/2 rounded-[50%] border border-[#f4f0e4]/20 bg-[#0a0a09]" />
          {/* Crease lines */}
          <div className="absolute left-[21%] top-[24%] h-px w-[58%] rotate-[8deg] bg-[#f4f0e4]/20" />
          <div className="absolute left-[36%] top-[9%] h-[82%] w-px rotate-[6deg] bg-[#f4f0e4]/10" />
          <div className="absolute bottom-[15%] left-[12%] h-[1px] w-[73%] rotate-[-4deg] bg-[#f4f0e4]/10" />
        </div>
      )}

      {/* Technical Spec & Markings */}
      {showDetails && (
        <div className="absolute inset-x-5 bottom-4 flex justify-between font-ui text-[9px] uppercase tracking-[.24em] text-[#f4f0e4]/60 pointer-events-none z-10">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F6D110]" />
            {currentViewLabel}
          </span>
          <span className="tracking-[.3em] font-semibold text-[#f4f0e4]/40">NEÏROUA</span>
        </div>
      )}
    </div>
  );
};
