import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  PackageCheck,
  PackageOpen,
  Scissors,
  Truck,
  MapPin,
  Check,
  Sparkles,
} from 'lucide-react';
import { CartItem, ActiveOrder } from '../types';
import { formatPrice, generateOrderNumber, formatFrenchDate, getEstimatedDeliveryDate } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  activeOrder: ActiveOrder | null;
  initialTab?: 'cart' | 'tracking';
  onUpdateQuantity: (productId: string, size: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onClearCart: () => void;
  onCheckout?: (success: boolean) => void;
  onOrderConfirmed?: (orderData: ActiveOrder) => void;
  onCompleteOrder: () => void;
  onNavigateToCollection: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  activeOrder,
  initialTab = 'cart',
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onOrderConfirmed,
  onCompleteOrder,
  onNavigateToCollection,
}) => {
  // Navigation tabs: 'cart' | 'tracking'
  const [currentTab, setCurrentTab] = useState<'cart' | 'tracking'>(initialTab);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout'>('cart');
  const [customerName, setCustomerName] = useState('Visiteur Privilégié');
  const [customerCity, setCustomerCity] = useState("Abidjan, Côte d'Ivoire");
  const [isConfirmingDelivery, setIsConfirmingDelivery] = useState(false);

  // Sync initialTab when drawer opens
  useEffect(() => {
    if (isOpen) {
      if (initialTab) {
        setCurrentTab(initialTab);
      }
      setCheckoutStep('cart');
      setIsConfirmingDelivery(false);
    }
  }, [isOpen, initialTab]);

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const total = subtotal;
  const totalCartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  // Instant Buy / Direct Checkout
  const handleInstantBuy = () => {
    if (items.length === 0) return;
    const orderData: ActiveOrder = {
      orderNumber: generateOrderNumber(),
      items: [...items],
      total,
      date: formatFrenchDate(new Date()),
      estimatedDelivery: getEstimatedDeliveryDate(3),
      createdAt: Date.now(),
    };

    if (onCheckout) onCheckout(true);
    if (onOrderConfirmed) onOrderConfirmed(orderData);
    onClearCart();
    setCurrentTab('tracking');
    setCheckoutStep('cart');
  };

  // Form Checkout Submit
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    const orderData: ActiveOrder = {
      orderNumber: generateOrderNumber(),
      items: [...items],
      total,
      date: formatFrenchDate(new Date()),
      estimatedDelivery: getEstimatedDeliveryDate(3),
      createdAt: Date.now(),
    };

    if (onCheckout) onCheckout(true);
    if (onOrderConfirmed) onOrderConfirmed(orderData);
    onClearCart();
    setCurrentTab('tracking');
    setCheckoutStep('cart');
  };

  // Client confirms reception ("COMMANDE REÇUE")
  const handleClientReceipt = () => {
    setIsConfirmingDelivery(true);
    setTimeout(() => {
      onCompleteOrder();
      setIsConfirmingDelivery(false);
    }, 1400);
  };

  // Timeline definition for active order
  const timelineSteps = activeOrder
    ? [
        {
          id: 'validated',
          title: 'Commande validée',
          description: `Reçue le ${activeOrder.date}`,
          icon: CheckCircle2,
          status: 'active',
          badge: 'ACTIF // CONFIRMÉ',
        },
        {
          id: 'manufacturing',
          title: 'En cours de fabrication',
          description: 'Ta pièce est en préparation.',
          icon: Scissors,
          status: 'pending',
          badge: 'EN ATTENTE',
        },
        {
          id: 'carrier',
          title: 'Remise au coursier',
          description: 'En transit.',
          icon: Truck,
          status: 'pending',
          badge: 'EN ATTENTE',
        },
        {
          id: 'delivery',
          title: 'Livraison estimée',
          description: `Prévue le ${activeOrder.estimatedDelivery}`,
          icon: MapPin,
          status: 'pending',
          badge: 'ESTIMÉE',
        },
      ]
    : [];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label="Atelier NEÏROUA"
      >
        {/* Backdrop click to dismiss */}
        <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

        {/* Drawer panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-10 w-full max-w-lg bg-[#141412] border-l border-[#FFFAFA]/15 h-full flex flex-col justify-between shadow-2xl text-[#FFFAFA] overflow-hidden"
        >
          {/* Top Main Bar: Brand Title & Close */}
          <div className="p-5 pb-3 border-b border-[#FFFAFA]/10 flex items-center justify-between bg-[#10100E]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#F6D110] animate-pulse" />
              <span className="font-ui text-[10px] sm:text-[11px] tracking-[0.3em] text-[#F6D110] uppercase font-semibold">
                NEÏROUA // ATELIER NUMÉRIQUE
              </span>
            </div>

            <button
              onClick={onClose}
              data-cursor="CLOSE"
              aria-label="Fermer le panneau"
              className="p-2 text-[#FFFAFA]/70 hover:text-[#F6D110] border border-[#FFFAFA]/15 hover:border-[#F6D110] rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Minimalist 2-Tab Navigation (Permanently Accessible) */}
          <div className="px-5 pt-3 pb-2 bg-[#10100E] border-b border-[#FFFAFA]/10">
            <div className="grid grid-cols-2 p-1 bg-[#1A1A17] rounded-xl border border-[#FFFAFA]/10">
              {/* Onglet 1 : PANIER */}
              <button
                type="button"
                onClick={() => setCurrentTab('cart')}
                className={`relative py-2.5 px-3 rounded-lg font-ui text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  currentTab === 'cart'
                    ? 'bg-[#F6D110] text-[#1F1F1C] shadow-[0_2px_12px_rgba(246,209,16,0.35)]'
                    : 'text-[#FFFAFA]/60 hover:text-[#FFFAFA]'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>PANIER</span>
                {totalCartCount > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      currentTab === 'cart'
                        ? 'bg-[#1F1F1C] text-[#F6D110]'
                        : 'bg-[#F6D110] text-[#1F1F1C]'
                    }`}
                  >
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* Onglet 2 : SUIVI DE COMMANDE */}
              <button
                type="button"
                onClick={() => setCurrentTab('tracking')}
                className={`relative py-2.5 px-3 rounded-lg font-ui text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  currentTab === 'tracking'
                    ? 'bg-[#F6D110] text-[#1F1F1C] shadow-[0_2px_12px_rgba(246,209,16,0.35)]'
                    : 'text-[#FFFAFA]/60 hover:text-[#FFFAFA]'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>SUIVI DE COMMANDE</span>
                {activeOrder && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      currentTab === 'tracking' ? 'bg-[#1F1F1C]' : 'bg-[#F6D110] animate-ping'
                    }`}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Drawer Body Content based on Active Tab */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            <AnimatePresence mode="wait">
              {/* TAB 1: PANIER */}
              {currentTab === 'cart' ? (
                <motion.div
                  key="tab-cart"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#FFFAFA]/10">
                    <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-wide text-[#FFFAFA] uppercase">
                      VOS PIÈCES ({totalCartCount})
                    </h3>
                    {items.length > 0 && (
                      <button
                        onClick={onClearCart}
                        className="text-[11px] font-ui tracking-wider text-[#FFFAFA]/50 hover:text-red-400 transition-colors uppercase cursor-pointer"
                      >
                        VIDER
                      </button>
                    )}
                  </div>

                  {checkoutStep === 'checkout' ? (
                    <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-1">
                      <div className="font-ui text-xs tracking-widest text-[#F6D110] uppercase font-bold">
                        EXPÉDITION ATELIER // ABIDJAN — MONDE
                      </div>
                      <div>
                        <label className="font-ui text-[11px] tracking-widest text-[#FFFAFA]/60 block mb-1">
                          NOM COMPLET DU DESTINATAIRE
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
                          placeholder="+225 07 11 05 92 28"
                          className="w-full bg-[#181816] border border-[#FFFAFA]/20 px-3.5 py-2.5 rounded-xl text-sm text-[#FFFAFA] focus:outline-none focus:border-[#F6D110]"
                        />
                      </div>

                      <div className="p-4 bg-[#181816] border border-[#FFFAFA]/10 space-y-2 font-ui text-sm rounded-xl">
                        <div className="flex justify-between">
                          <span className="text-[#FFFAFA]/70">SOUS-TOTAL :</span>
                          <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-[#F6D110]">
                          <span>LIVRAISON MONDIALE :</span>
                          <span>OFFERTE (ÉDITION LIMITÉE)</span>
                        </div>
                        <div className="flex justify-between text-base font-bold pt-2 border-t border-[#FFFAFA]/10">
                          <span>TOTAL :</span>
                          <span className="text-[#F6D110]">{formatPrice(total)}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setCheckoutStep('cart')}
                          className="w-1/3 py-3.5 border border-[#FFFAFA]/20 text-[#FFFAFA] font-ui text-xs tracking-widest uppercase rounded-xl hover:bg-white/5 cursor-pointer"
                        >
                          RETOUR
                        </button>
                        <button
                          type="submit"
                          data-cursor="PAY"
                          className="w-2/3 py-3.5 bg-[#F6D110] text-[#1F1F1C] font-ui text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-white transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                        >
                          <span>VALIDER & SUIVRE</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  ) : items.length === 0 ? (
                    <div className="py-20 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-[#1A1A17] border border-[#FFFAFA]/10 mx-auto flex items-center justify-center text-[#FFFAFA]/40">
                        <ShoppingBag className="w-7 h-7" />
                      </div>
                      <p className="font-ui text-sm sm:text-base tracking-[0.2em] text-[#FFFAFA]/60 uppercase font-semibold">
                        VOTRE PANIER EST VIDE
                      </p>
                      <p className="font-ui text-xs font-light text-[#FFFAFA]/50 max-w-xs mx-auto leading-relaxed">
                        Explorez la collection NEÏROUA et réservez une pièce exclusive numérotée.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          onNavigateToCollection();
                          onClose();
                        }}
                        className="mt-2 py-3 px-6 rounded-full border border-[#F6D110]/50 text-[#F6D110] hover:bg-[#F6D110] hover:text-[#1F1F1C] font-ui text-xs font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer inline-flex items-center gap-2"
                      >
                        <span>DÉCOUVRIR LA COLLECTION</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div
                        key={`${item.product.id}-${item.size}`}
                        className="p-3.5 border border-[#FFFAFA]/15 bg-[#181816] rounded-2xl flex gap-3.5 items-center"
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
                          <h4 className="font-display text-base sm:text-lg font-semibold truncate text-[#FFFAFA]">
                            {item.product.name}
                          </h4>
                          <div className="font-ui text-xs text-[#FFFAFA]/80">
                            {formatPrice(item.product.price)} / unité
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
                              <span className="px-2 font-ui text-xs font-bold text-[#FFFAFA]">
                                {item.quantity}
                              </span>
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

                        <div className="font-ui text-sm font-bold text-[#F6D110] self-end whitespace-nowrap">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              ) : (
                /* TAB 2: SUIVI DE COMMANDE */
                <motion.div
                  key="tab-tracking"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6"
                >
                  {/* Feedback transition de réception */}
                  {isConfirmingDelivery ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="py-16 text-center space-y-4 bg-[#181816] border border-[#F6D110]/40 rounded-3xl p-6 shadow-2xl"
                    >
                      <div className="w-16 h-16 rounded-full bg-[#F6D110] text-[#1F1F1C] mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(246,209,16,0.6)]">
                        <PackageCheck className="w-8 h-8" />
                      </div>
                      <h4 className="font-display text-2xl font-bold uppercase tracking-wider text-[#F6D110]">
                        MERCI POUR VOTRE CONFIANCE
                      </h4>
                      <p className="font-ui text-xs sm:text-sm text-[#FFFAFA]/80 max-w-xs mx-auto leading-relaxed">
                        Votre pièce NEÏROUA est confirmée livrée. Bienvenue parmi les initiés.
                      </p>
                    </motion.div>
                  ) : !activeOrder ? (
                    /* ÉTAT INACTIF (Aucune commande) */
                    <div className="py-20 text-center space-y-5">
                      <div className="w-16 h-16 rounded-full bg-[#181816] border border-[#FFFAFA]/15 mx-auto flex items-center justify-center text-[#FFFAFA]/40">
                        <PackageOpen className="w-7 h-7" />
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-display text-2xl font-semibold tracking-wide text-[#FFFAFA] uppercase">
                          AUCUNE COMMANDE EN COURS.
                        </h4>
                        <p className="font-ui text-xs font-light text-[#FFFAFA]/60 max-w-xs mx-auto leading-relaxed">
                          Vos commandes exclusives et le suivi de leur confection à l'atelier apparaîtront ici dès confirmation.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onNavigateToCollection();
                          onClose();
                        }}
                        className="py-3.5 px-7 rounded-full border-2 border-[#F6D110] text-[#F6D110] hover:bg-[#F6D110] hover:text-[#1F1F1C] font-ui text-xs font-bold tracking-[0.25em] uppercase transition-all duration-300 shadow-[0_0_15px_rgba(246,209,16,0.15)] hover:shadow-[0_0_25px_rgba(246,209,16,0.4)] inline-flex items-center gap-2 cursor-pointer"
                      >
                        <span>DÉCOUVRIR LA COLLECTION</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    /* ÉTAT ACTIF (Commande passée) */
                    <div className="space-y-6">
                      {/* Header de la commande */}
                      <div className="p-4 rounded-2xl bg-[#1A1A17] border border-[#FFFAFA]/10 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-ui font-bold tracking-[0.25em] text-[#F6D110] uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F6D110] animate-pulse" />
                            EXPÉDITION EXCLUSIVE
                          </span>
                          <span className="font-mono text-xs text-[#F6D110] font-bold px-2 py-0.5 rounded bg-[#10100E] border border-[#F6D110]/30">
                            #{activeOrder.orderNumber}
                          </span>
                        </div>

                        <h4 className="font-display text-xl sm:text-2xl font-semibold tracking-wide text-[#FFFAFA] uppercase leading-tight">
                          COMMANDE CONFIRMÉE. BIENVENUE DANS LA VISION.
                        </h4>
                      </div>

                      {/* Timeline détaillée du cycle de vie de la pièce */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-ui text-[11px] tracking-[0.25em] text-[#FFFAFA]/60 uppercase font-semibold">
                            CYCLE DE VIE DE LA PIÈCE
                          </span>
                          <span className="font-ui text-[10px] tracking-widest text-[#F6D110] uppercase font-bold">
                            EN DIRECT DE L'ATELIER
                          </span>
                        </div>

                        <div className="relative pl-6 sm:pl-7 space-y-6 border-l-2 border-[#FFFAFA]/10 ml-3.5 py-1">
                          {timelineSteps.map((step) => {
                            const Icon = step.icon;
                            const isActive = step.status === 'active';

                            return (
                              <div
                                key={step.id}
                                className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                              >
                                {/* Step Circle Indicator */}
                                <div
                                  className={`absolute -left-[35px] sm:-left-[39px] flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border transition-all duration-300 ${
                                    isActive
                                      ? 'bg-[#F6D110] border-[#F6D110] text-[#1F1F1C] shadow-[0_0_16px_rgba(246,209,16,0.6)]'
                                      : 'bg-[#10100E] border-[#FFFAFA]/20 text-[#FFFAFA]/40'
                                  }`}
                                >
                                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>

                                {/* Step Title & Description */}
                                <div className="space-y-0.5">
                                  <div
                                    className={`font-ui text-xs sm:text-sm font-bold tracking-wide transition-colors ${
                                      isActive ? 'text-[#F6D110]' : 'text-[#FFFAFA]/90'
                                    }`}
                                  >
                                    {step.title}
                                  </div>
                                  <div
                                    className={`font-ui text-[11px] sm:text-xs font-light leading-relaxed ${
                                      isActive ? 'text-[#FFFAFA]' : 'text-[#FFFAFA]/50'
                                    }`}
                                  >
                                    {step.description}
                                  </div>
                                </div>

                                {/* Step Badge */}
                                <div
                                  className={`self-start sm:self-center px-2 py-0.5 rounded text-[9px] tracking-[0.18em] uppercase font-bold border transition-colors ${
                                    isActive
                                      ? 'bg-[#F6D110]/15 border-[#F6D110] text-[#F6D110]'
                                      : 'bg-[#181816] border-[#FFFAFA]/10 text-[#FFFAFA]/40'
                                  }`}
                                >
                                  {step.badge}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Aperçu des pièces de la commande */}
                      {activeOrder.items && activeOrder.items.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-[#161614] border border-[#FFFAFA]/10 space-y-2">
                          <div className="flex justify-between items-center text-[11px] font-ui tracking-wider text-[#FFFAFA]/60">
                            <span>PIÈCES EN CONFECTION ({activeOrder.items.reduce((acc, i) => acc + i.quantity, 0)})</span>
                            <span className="text-[#F6D110] font-bold">AUTHENTICITÉ VÉRIFIÉE</span>
                          </div>

                          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                            {activeOrder.items.map((item) => (
                              <div
                                key={`${item.product.id}-${item.size}`}
                                className="flex items-center justify-between py-1 border-b border-[#FFFAFA]/5 text-xs font-ui"
                              >
                                <div className="flex items-center gap-2.5 truncate max-w-[240px]">
                                  <div className="w-7 h-9 bg-[#1F1F1C] rounded border border-[#FFFAFA]/10 overflow-hidden shrink-0">
                                    {item.product.views?.[0]?.image && (
                                      <img
                                        src={item.product.views[0].image}
                                        alt={item.product.name}
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <div className="truncate">
                                    <p className="font-bold text-[#FFFAFA] truncate">
                                      {item.product.name}
                                    </p>
                                    <p className="text-[10px] text-[#FFFAFA]/50">
                                      Taille: {item.size} × {item.quantity}
                                    </p>
                                  </div>
                                </div>

                                <span className="font-bold text-[#F6D110] text-xs">
                                  {formatPrice(item.product.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 flex justify-between items-center text-xs font-ui border-t border-[#FFFAFA]/10">
                            <span className="text-[#FFFAFA]/70 tracking-wider">TOTAL RÉGLÉ :</span>
                            <span className="text-sm font-bold text-[#F6D110]">
                              {formatPrice(activeOrder.total)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-[#FFFAFA]/15 bg-[#10100E] space-y-2.5">
            {/* Si onglet Panier et articles présents */}
            {currentTab === 'cart' && checkoutStep === 'cart' && items.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex justify-between font-ui text-sm">
                  <span className="text-[#FFFAFA]/60 uppercase tracking-widest">TOTAL</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#F6D110]">
                    {formatPrice(total)}
                  </span>
                </div>
                <button
                  onClick={handleInstantBuy}
                  className="w-full py-4 bg-[#F6D110] text-[#1F1F1C] font-ui text-xs font-bold tracking-[.25em] uppercase hover:bg-white rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(246,209,16,0.3)]"
                >
                  <span>ACHETER // VALIDER ({formatPrice(total)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCheckoutStep('checkout')}
                  className="w-full py-2.5 border border-[#FFFAFA]/20 text-[#FFFAFA]/80 hover:text-white hover:border-[#F6D110] font-ui text-[11px] font-medium tracking-wider uppercase rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>COORDONNÉES DE LIVRAISON</span>
                </button>
              </div>
            )}

            {/* Si onglet Suivi et COMMANDE ACTIVE : Bouton d'action massif Jaune Vif #F6D110 */}
            {currentTab === 'tracking' && activeOrder && !isConfirmingDelivery && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleClientReceipt}
                  data-cursor="CHECK"
                  className="w-full py-4 bg-[#F6D110] hover:bg-[#ffe136] text-[#1F1F1C] font-ui text-xs sm:text-sm font-black tracking-[.25em] uppercase rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(246,209,16,0.4)] hover:shadow-[0_0_35px_rgba(246,209,16,0.7)] flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98]"
                >
                  <Check className="w-5 h-5 stroke-[2.5]" />
                  <span>COMMANDE REÇUE</span>
                </button>
                <p className="text-[10px] font-ui tracking-wider text-center text-[#FFFAFA]/40 mt-2">
                  CONFIRMEZ LA RÉCEPTION POUR CLÔTURER LE SUIVI DE L'ATELIER
                </p>
              </div>
            )}

            {/* Si onglet Suivi et AUCUNE COMMANDE : Bouton vers la collection */}
            {currentTab === 'tracking' && !activeOrder && !isConfirmingDelivery && (
              <button
                type="button"
                onClick={() => {
                  onNavigateToCollection();
                  onClose();
                }}
                className="w-full py-3.5 border border-[#F6D110]/60 hover:border-[#F6D110] text-[#F6D110] hover:bg-[#F6D110]/10 font-ui text-xs font-bold tracking-[.2em] uppercase rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>VOIR LA COLLECTION NEÏROUA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
