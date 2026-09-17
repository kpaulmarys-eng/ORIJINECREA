import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';
import { BRAND_INFO, BRAND_COLORS } from '../data/brandData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, size: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerCity, setCustomerCity] = useState('Abidjan, Côte d\'Ivoire');

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const total = subtotal;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('success');
    setTimeout(() => {
      onClearCart();
    }, 4500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label="Panier NEÏROUA"
      >
        {/* Backdrop click to dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Drawer panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-10 w-full max-w-md bg-[#1F1F1C] border-l border-[#FFFAFA]/15 h-full flex flex-col justify-between shadow-2xl text-[#FFFAFA]"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#FFFAFA]/10 flex items-center justify-between bg-[#181816]">
            <div>
              <span className="font-ui text-[10px] tracking-[0.3em] text-[#F6D110] uppercase block font-semibold">
                NEÏROUA // SÉLECTIONS EXCLUSIVES
              </span>
              <h3 className="font-display text-2xl font-semibold tracking-wide text-[#FFFAFA] uppercase">
                VOS PIÈCES ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={onClose}
              data-cursor="CLOSE"
              className="p-2 text-[#FFFAFA]/70 hover:text-[#F6D110] border border-[#FFFAFA]/15 hover:border-[#F6D110] rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {checkoutStep === 'success' ? (
              <div className="py-12 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F6D110]/15 border border-[#F6D110] flex items-center justify-center text-[#F6D110]">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="font-display text-3xl font-semibold uppercase text-[#FFFAFA]">
                  COMMANDE CONFIRMÉE
                </h4>
                <p className="font-ui text-base font-light text-[#FFFAFA]/80 max-w-xs leading-relaxed">
                  Merci, {customerName || 'client privilégié'}. Votre pièce est en cours de numérotation et de préparation à l'atelier pour expédition vers {customerCity}.
                </p>
                <div className="p-3 bg-[#181816] border border-[#FFFAFA]/10 font-ui text-xs tracking-widest text-[#F6D110]">
                  RÉFÉRENCE : NEI-{(Math.random() * 90000 + 10000).toFixed(0)}
                </div>
                <button
                  onClick={() => {
                    setCheckoutStep('cart');
                    onClose();
                  }}
                  data-cursor="HOME"
                  className="mt-4 py-3 px-6 bg-[#F6D110] text-[#1F1F1C] font-ui tracking-[.25em] text-xs uppercase font-bold hover:bg-white rounded-xl transition-colors cursor-pointer"
                >
                  RETOUR À L'ACCUEIL
                </button>
              </div>
            ) : checkoutStep === 'checkout' ? (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="font-ui text-xs tracking-widest text-[#F6D110] uppercase font-bold">
                  EXPÉDITION ATELIER // ABIDJAN — PARIS — TOKYO
                </div>
                <div>
                  <label className="font-ui text-[11px] tracking-widest text-[#FFFAFA]/60 block mb-1">
                    NOM COMPLET
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="ex: Jean-Marc Kouassi"
                    className="w-full bg-[#181816] border border-[#FFFAFA]/20 px-3.5 py-2.5 rounded-xl text-sm text-[#FFFAFA] focus:outline-none focus:border-[#F6D110]"
                  />
                </div>
                <div>
                  <label className="font-ui text-[11px] tracking-widest text-[#FFFAFA]/60 block mb-1">
                    VILLE & PAYS DE LIVRAISON
                  </label>
                  <input
                    type="text"
                    required
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    placeholder="ex: Abidjan, Côte d'Ivoire / Paris, France"
                    className="w-full bg-[#181816] border border-[#FFFAFA]/20 px-3.5 py-2.5 rounded-xl text-sm text-[#FFFAFA] focus:outline-none focus:border-[#F6D110]"
                  />
                </div>
                <div>
                  <label className="font-ui text-[11px] tracking-widest text-[#FFFAFA]/60 block mb-1">
                    CONTACT WHATSAPP / TÉLÉPHONE
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+225 07 11 05 92 28"
                    className="w-full bg-[#181816] border border-[#FFFAFA]/20 px-3.5 py-2.5 rounded-xl text-sm text-[#FFFAFA] focus:outline-none focus:border-[#F6D110]"
                  />
                </div>

                <div className="p-4 bg-[#181816] border border-[#FFFAFA]/10 space-y-2 font-ui text-sm rounded-xl">
                  <div className="flex justify-between">
                    <span className="text-[#FFFAFA]/70">SOUS-TOTAL :</span>
                    <span>{subtotal} €</span>
                  </div>
                  <div className="flex justify-between text-[#F6D110]">
                    <span>LIVRAISON MONDIALE :</span>
                    <span>OFFERTE (ÉDITION LIMITÉE)</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-[#FFFAFA]/10">
                    <span>TOTAL :</span>
                    <span className="text-[#F6D110]">{total} €</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="w-1/3 py-3 border border-[#FFFAFA]/20 text-[#FFFAFA] font-ui text-xs tracking-widest uppercase rounded-xl hover:bg-white/5 cursor-pointer"
                  >
                    RETOUR
                  </button>
                  <button
                    type="submit"
                    data-cursor="PAY"
                    className="w-2/3 py-3 bg-[#F6D110] text-[#1F1F1C] font-ui text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-white transition-colors cursor-pointer"
                  >
                    VALIDER LA COMMANDE
                  </button>
                </div>
              </form>
            ) : items.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <p className="font-ui text-base tracking-widest text-[#FFFAFA]/40 uppercase">
                  VOTRE PANIER EST VIDE
                </p>
                <p className="font-ui text-xs font-light text-[#FFFAFA]/60 max-w-xs mx-auto">
                  Explorez la collection NEÏROUA et réservez une pièce exclusive numérotée.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="p-3.5 border border-[#FFFAFA]/15 bg-[#181816] rounded-2xl flex gap-4 items-center"
                >
                  <div className="w-16 h-20 bg-[#141412] border border-[#FFFAFA]/15 flex items-center justify-center relative overflow-hidden shrink-0 rounded-xl">
                    {item.product.views?.[0]?.image ? (
                      <img
                        src={item.product.views[0].image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <span className="font-ui text-[10px] font-bold text-[#F6D110] p-1 text-center">
                        {item.product.name}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-ui text-[10px] tracking-widest text-[#F6D110] uppercase font-semibold">
                      TAILLE : {item.size}
                    </div>
                    <h4 className="font-display text-lg font-semibold truncate text-[#FFFAFA]">
                      {item.product.name}
                    </h4>
                    <div className="font-ui text-sm text-[#FFFAFA]/80">
                      {item.product.price} € / unité
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-[#FFFAFA]/20 bg-[#141412] rounded-lg">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.size, -1)}
                          data-cursor="MINUS"
                          className="px-2 py-1 text-xs hover:text-[#F6D110] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-ui text-xs font-bold text-[#FFFAFA]">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.size, 1)}
                          data-cursor="PLUS"
                          className="px-2 py-1 text-xs hover:text-[#F6D110] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id, item.size)}
                        data-cursor="REMOVE"
                        className="text-[#FFFAFA]/40 hover:text-red-400 p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="font-ui text-base font-bold text-[#F6D110] self-end">
                    {item.product.price * item.quantity} €
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout Button */}
          {checkoutStep === 'cart' && items.length > 0 && (
            <div className="p-6 border-t border-[#FFFAFA]/15 bg-[#181816] space-y-4">
              <div className="flex justify-between font-ui text-sm">
                <span className="text-[#FFFAFA]/60 uppercase tracking-widest">TOTAL</span>
                <span className="text-2xl font-bold text-[#F6D110]">{total} €</span>
              </div>
              <button
                onClick={() => setCheckoutStep('checkout')}
                className="w-full py-4 bg-[#F6D110] text-[#1F1F1C] font-ui text-xs font-bold tracking-[.25em] uppercase hover:bg-white rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>COMMANDER LA PIÈCE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
