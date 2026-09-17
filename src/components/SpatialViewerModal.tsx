import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RotateCw, ZoomIn, ZoomOut, Compass, Sparkles, Layers, Eye } from 'lucide-react';
import { PRODUCTS, HERO_ASSET } from '../data/brandData';

interface SpatialViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProductToBuy: (productId: string) => void;
}

export const SpatialViewerModal: React.FC<SpatialViewerModalProps> = ({
  isOpen,
  onClose,
  onSelectProductToBuy,
}) => {
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [activeLayer, setActiveLayer] = useState<'texture' | 'wireframe' | 'xray'>('texture');
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!isOpen) return null;

  const currentProduct = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-5xl bg-[#1F1F1C] border border-[#FFFAFA]/20 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        >
          {/* Top Bar */}
          <div className="p-4 sm:p-5 border-b border-[#FFFAFA]/10 flex items-center justify-between bg-[#232320]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0C5FB3]/20 border border-[#0C5FB3] text-[#0C5FB3]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#F6D110] block">
                  EXPOSITION DIGITALE HAUTE FIDÉLITÉ // 3D & 360°
                </span>
                <h3 className="text-xl sm:text-2xl font-sans font-semibold tracking-wider text-[#FFFAFA] uppercase leading-none">
                  LABORATOIRE VOLUMÉTRIQUE NEÏROUA
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#FFFAFA]/70 hover:text-[#FFFAFA] border border-[#FFFAFA]/10 hover:border-[#F6D110] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Inspection Viewport & Side Product Selector */}
          <div className="flex-1 flex flex-col lg:flex-row min-h-[420px] sm:min-h-[520px] overflow-hidden">
            {/* Viewport Canvas */}
            <div className="flex-1 relative bg-[#171715] flex items-center justify-center p-8 overflow-hidden select-none">
              {/* Radial lighting background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(12,95,179,0.15)_0%,transparent_70%)]" />

              {/* 360 Axis circular guidelines */}
              <div className="absolute w-80 sm:w-96 h-80 sm:h-96 rounded-full border border-dashed border-[#FFFAFA]/10 pointer-events-none" />
              <div className="absolute w-64 h-64 rounded-full border border-[#0C5FB3]/20 pointer-events-none" />

              {/* Interactive Rotatable 3D Garment representation */}
              <motion.div
                className="relative z-10 w-64 sm:w-80 aspect-[3/4] cursor-grab active:cursor-grabbing"
                style={{
                  transform: `scale(${zoomLevel}) rotateY(${rotationAngle}deg)`,
                  transition: 'transform 0.15s ease-out',
                }}
              >
                <img
                  src={
                    rotationAngle > 90 && rotationAngle < 270
                      ? currentProduct.views[1]?.image || currentProduct.views[0].image
                      : currentProduct.views[0].image
                  }
                  alt={currentProduct.name}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[#FFFAFA]/10 ${
                    activeLayer === 'wireframe'
                      ? 'filter contrast-200 invert hue-rotate-180'
                      : activeLayer === 'xray'
                      ? 'filter contrast-150 saturate-200 hue-rotate-90'
                      : 'filter contrast-[1.05]'
                  }`}
                />

                {/* Simulated Wireframe Shading */}
                {activeLayer === 'wireframe' && (
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(12,95,179,0.2),rgba(12,95,179,0.2)_1px,transparent_1px,transparent_12px)] pointer-events-none" />
                )}
              </motion.div>

              {/* 360° Angle HUD and rotation controls */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20 pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-2 bg-[#1F1F1C]/90 backdrop-blur border border-[#FFFAFA]/20 px-3 py-1.5 text-xs font-mono tracking-widest text-[#FFFAFA]">
                  <RotateCw className="w-3.5 h-3.5 text-[#F6D110]" />
                  <span>ANGLE : {rotationAngle}°</span>
                </div>

                <div className="pointer-events-auto flex items-center gap-2 bg-[#1F1F1C]/90 backdrop-blur border border-[#FFFAFA]/20 p-1.5">
                  <button
                    onClick={() => setRotationAngle((prev) => (prev + 30) % 360)}
                    className="p-1.5 hover:bg-[#2A2A26] text-[#FFFAFA] transition-colors"
                    title="Rotation 30°"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setZoomLevel((prev) => Math.min(prev + 0.15, 1.45))}
                    className="p-1.5 hover:bg-[#2A2A26] text-[#FFFAFA] transition-colors"
                    title="Zoom avant"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setZoomLevel((prev) => Math.max(prev - 0.15, 0.75))}
                    className="p-1.5 hover:bg-[#2A2A26] text-[#FFFAFA] transition-colors"
                    title="Zoom arrière"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel: Spec Sheet & Layer Controls */}
            <div className="w-full lg:w-80 bg-[#232320] border-t lg:border-t-0 lg:border-l border-[#FFFAFA]/10 p-6 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[10px] font-mono tracking-[0.25em] text-[#0C5FB3] uppercase font-bold">
                  SÉLECTION DE LA PIÈCE
                </span>

                <div className="grid grid-cols-2 gap-2 mt-3 mb-6">
                  {PRODUCTS.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => {
                        setSelectedProductId(prod.id);
                        setRotationAngle(0);
                      }}
                      className={`p-2 text-left border text-xs font-mono transition-all ${
                        selectedProductId === prod.id
                          ? 'border-[#F6D110] bg-[#F6D110]/10 text-white'
                          : 'border-[#FFFAFA]/10 bg-[#1F1F1C] text-[#FFFAFA]/60 hover:text-white'
                      }`}
                    >
                      <div className="truncate font-bold">{prod.name}</div>
                      <div className="text-[10px] text-[#F6D110]">{prod.price} €</div>
                    </button>
                  ))}
                </div>

                <div className="space-y-3 border-t border-[#FFFAFA]/10 pt-4 text-xs font-mono">
                  <div className="flex justify-between text-[#FFFAFA]/70">
                    <span>POIDS MATIÈRE :</span>
                    <span className="text-[#FFFAFA] font-bold">{currentProduct.weight}</span>
                  </div>
                  <div className="flex justify-between text-[#FFFAFA]/70">
                    <span>TISSAGE :</span>
                    <span className="text-[#FFFAFA]">{currentProduct.composition.split('&')[0]}</span>
                  </div>
                  <div className="flex justify-between text-[#FFFAFA]/70">
                    <span>ORIGINE :</span>
                    <span className="text-[#F6D110]">ATELIER ABIDJAN</span>
                  </div>
                </div>

                {/* Layer Mode Switch */}
                <div className="pt-6">
                  <span className="text-[10px] font-mono tracking-[0.2em] text-[#FFFAFA]/60 uppercase block mb-2">
                    MODE DE RENDU SPATIAL
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveLayer('texture')}
                      className={`flex-1 py-1.5 text-[10px] font-mono border ${
                        activeLayer === 'texture' ? 'bg-[#FFFAFA] text-[#1F1F1C] font-bold' : 'border-[#FFFAFA]/20 text-[#FFFAFA]/70'
                      }`}
                    >
                      TEXTURE 4K
                    </button>
                    <button
                      onClick={() => setActiveLayer('wireframe')}
                      className={`flex-1 py-1.5 text-[10px] font-mono border ${
                        activeLayer === 'wireframe' ? 'bg-[#0C5FB3] text-white border-[#0C5FB3]' : 'border-[#FFFAFA]/20 text-[#FFFAFA]/70'
                      }`}
                    >
                      MAILLAGE
                    </button>
                    <button
                      onClick={() => setActiveLayer('xray')}
                      className={`flex-1 py-1.5 text-[10px] font-mono border ${
                        activeLayer === 'xray' ? 'bg-[#F6D110] text-[#1F1F1C] font-bold' : 'border-[#FFFAFA]/20 text-[#FFFAFA]/70'
                      }`}
                    >
                      DENSITÉ
                    </button>
                  </div>
                </div>
              </div>

              {/* Purchase Trigger from Visualizer */}
              <button
                onClick={() => {
                  onClose();
                  onSelectProductToBuy(currentProduct.id);
                }}
                className="w-full py-3.5 bg-[#F6D110] hover:bg-[#ffd91a] text-[#1F1F1C] font-mono tracking-[0.2em] text-xs uppercase font-black transition-all shadow-xl text-center"
              >
                ACQUÉRIR CETTE PIÈCE ({currentProduct.price} €)
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
