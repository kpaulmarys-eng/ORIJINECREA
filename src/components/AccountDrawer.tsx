import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Trash2,
  CheckCircle2,
  Package,
  Shield,
  Clock,
  Sparkles,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import { UserProfile, PastOrder } from '../types';
import { formatPrice } from '../utils/formatters';

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  pastOrders: PastOrder[];
  onLoginWithGoogle: () => void;
  onLogout: () => void;
  onDeletePastOrder: (orderId: string) => void;
}

export const AccountDrawer: React.FC<AccountDrawerProps> = ({
  isOpen,
  onClose,
  user,
  pastOrders,
  onLoginWithGoogle,
  onLogout,
  onDeletePastOrder,
}) => {
  // Confirmation state for deleting a past order
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Derive initial for avatar
  const userInitial = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'N';

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label="Espace Compte NEÏROUA"
      >
        {/* Backdrop click to dismiss */}
        <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-10 w-full max-w-lg bg-[#141412] border-l border-[#FFFAFA]/15 h-full flex flex-col justify-between shadow-2xl text-[#FFFAFA] overflow-hidden"
        >
          {/* Top Bar */}
          <div className="p-5 pb-4 border-b border-[#FFFAFA]/10 flex items-center justify-between bg-[#10100E]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#F6D110] animate-pulse" />
              <span className="font-ui text-[10px] sm:text-[11px] tracking-[0.3em] text-[#F6D110] uppercase font-semibold">
                NEÏROUA // ESPACE INITIÉ
              </span>
            </div>

            <button
              onClick={onClose}
              data-cursor="CLOSE"
              aria-label="Fermer le compte"
              className="p-2 text-[#FFFAFA]/70 hover:text-[#F6D110] border border-[#FFFAFA]/15 hover:border-[#F6D110] rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            <AnimatePresence mode="wait">
              {!user ? (
                /* ================= ÉTAT NON CONNECTÉ ================= */
                <motion.div
                  key="unauthenticated-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="py-12 flex flex-col items-center text-center space-y-6"
                >
                  {/* Emblem */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-[#1A1A17] border border-[#F6D110]/40 flex items-center justify-center text-[#F6D110] shadow-[0_0_30px_rgba(246,209,16,0.2)]">
                      <User className="w-9 h-9 stroke-[1.5]" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#F6D110] text-[#1F1F1C] flex items-center justify-center">
                      <Shield className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Copy */}
                  <div className="space-y-2 max-w-sm">
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-wide text-[#FFFAFA] uppercase">
                      ACCÉDER À VOTRE ESPACE PRIVILÉGIÉ
                    </h3>
                    <p className="font-ui text-xs sm:text-sm font-light text-[#FFFAFA]/65 leading-relaxed">
                      Connectez-vous pour retrouver l'ensemble de vos pièces acquises, consulter vos archives de confections et bénéficier d'un statut d'Initié NEÏROUA.
                    </p>
                  </div>

                  {/* Google Login Button */}
                  <div className="w-full max-w-sm pt-2 space-y-3">
                    <button
                      type="button"
                      onClick={onLoginWithGoogle}
                      data-cursor="LOGIN"
                      className="w-full flex items-center justify-center gap-3.5 bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 font-ui text-xs sm:text-sm font-semibold tracking-wider uppercase py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer group active:scale-[0.98]"
                    >
                      {/* Standard Google G SVG Icon */}
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span className="font-bold">SE CONNECTER AVEC GOOGLE</span>
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[10px] font-ui tracking-widest text-[#FFFAFA]/40 uppercase">
                      <Shield className="w-3 h-3 text-[#F6D110]" />
                      <span>AUTHENTIFICATION SÉCURISÉE // ÉDITION LIMITÉE</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* ================= ÉTAT CONNECTÉ ================= */
                <motion.div
                  key="authenticated-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* User Profile Header Card */}
                  <div className="p-5 rounded-2xl bg-[#1A1A17] border border-[#FFFAFA]/10 flex items-center gap-4">
                    {/* User Avatar Circle */}
                    <div className="w-14 h-14 rounded-full bg-[#10100E] border-2 border-[#F6D110] flex items-center justify-center text-[#F6D110] text-xl font-bold font-display shadow-[0_0_15px_rgba(246,209,16,0.3)] shrink-0">
                      {userInitial}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-wide text-[#FFFAFA] truncate uppercase">
                          {user.name}
                        </h3>
                      </div>
                      <p className="font-ui text-xs text-[#FFFAFA]/60 truncate">
                        {user.email}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F6D110]/15 border border-[#F6D110]/50 text-[#F6D110] text-[9px] font-ui font-bold tracking-widest uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F6D110] animate-pulse" />
                          STATUT : INITIÉ PRIVILÉGIÉ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section Title: ARCHIVES DES COMMANDES */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b border-[#FFFAFA]/10 pb-2">
                      <h4 className="font-display text-2xl font-semibold tracking-wide text-[#FFFAFA] uppercase">
                        ARCHIVES DES COMMANDES
                      </h4>
                      <span className="font-ui text-[11px] tracking-widest text-[#F6D110] font-bold">
                        ({pastOrders.length})
                      </span>
                    </div>

                    {/* Conteneur scrollable max-h-96 */}
                    <div className="max-h-96 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin">
                      {pastOrders.length === 0 ? (
                        /* Empty Archives */
                        <div className="py-12 text-center space-y-3 bg-[#181816]/60 border border-[#FFFAFA]/10 rounded-2xl p-6">
                          <div className="w-12 h-12 rounded-full bg-[#10100E] border border-[#FFFAFA]/10 mx-auto flex items-center justify-center text-[#FFFAFA]/30">
                            <Package className="w-6 h-6" />
                          </div>
                          <p className="font-ui text-xs sm:text-sm tracking-[0.2em] text-[#FFFAFA]/60 uppercase font-semibold">
                            AUCUNE COMMANDE ARCHIVÉE.
                          </p>
                          <p className="font-ui text-[11px] font-light text-[#FFFAFA]/40 max-w-xs mx-auto leading-relaxed">
                            Lorsque vous confirmez la réception d'une pièce dans votre suivi de commande, elle est automatiquement transférée ici.
                          </p>
                        </div>
                      ) : (
                        /* List of Past Order Cards */
                        pastOrders.map((order) => {
                          const isConfirmingDelete = confirmDeleteId === order.id;

                          return (
                            <motion.div
                              key={order.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="relative opacity-75 hover:opacity-100 transition-all duration-300 grayscale-[35%] hover:grayscale-0 bg-[#181816] border border-[#FFFAFA]/15 rounded-2xl p-4 space-y-3 shadow-md group"
                            >
                              {/* Top Bar of the Card */}
                              <div className="flex items-start justify-between gap-2 border-b border-[#FFFAFA]/10 pb-2.5">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-bold text-[#F6D110] px-2 py-0.5 rounded bg-[#10100E] border border-[#F6D110]/30">
                                      #{order.orderNumber}
                                    </span>
                                    <span className="inline-flex items-center gap-1 font-ui text-[10px] font-bold tracking-widest uppercase text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>STATUT : LIVRÉE</span>
                                    </span>
                                  </div>
                                  <p className="font-ui text-[10px] tracking-wider text-[#FFFAFA]/50">
                                    Livrée le {order.deliveredAt || order.date}
                                  </p>
                                </div>

                                {/* Delete Button (Trash2) */}
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(order.id)}
                                  data-cursor="DELETE"
                                  title="Supprimer cette archive"
                                  className="p-1.5 text-[#FFFAFA]/40 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Confirmation Overlay inline if triggered */}
                              {isConfirmingDelete && (
                                <div className="p-3 bg-red-950/80 border border-red-500/40 rounded-xl space-y-2 text-center animate-fadeIn">
                                  <div className="flex items-center justify-center gap-1.5 text-xs font-ui font-bold text-red-300 tracking-wider">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span>SUPPRIMER CETTE ARCHIVE ?</span>
                                  </div>
                                  <div className="flex items-center justify-center gap-2 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteId(null)}
                                      className="px-3 py-1 bg-white/10 hover:bg-white/20 text-[#FFFAFA] font-ui text-[10px] font-bold tracking-widest uppercase rounded-lg cursor-pointer"
                                    >
                                      ANNULER
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onDeletePastOrder(order.id);
                                        setConfirmDeleteId(null);
                                      }}
                                      className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-ui text-[10px] font-bold tracking-widest uppercase rounded-lg cursor-pointer shadow-sm"
                                    >
                                      SUPPRIMER
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Items list */}
                              <div className="space-y-2">
                                {order.items.map((item) => (
                                  <div
                                    key={`${order.id}-${item.product.id}-${item.size}`}
                                    className="flex items-center justify-between text-xs font-ui py-1"
                                  >
                                    <div className="flex items-center gap-2.5 truncate max-w-[240px]">
                                      <div className="w-8 h-10 bg-[#121210] rounded border border-[#FFFAFA]/10 overflow-hidden shrink-0">
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

                                    <span className="font-bold text-[#FFFAFA]/80 text-xs">
                                      {formatPrice(item.product.price * item.quantity)}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {/* Card Footer Total */}
                              <div className="pt-2 border-t border-[#FFFAFA]/10 flex items-center justify-between font-ui text-xs">
                                <span className="text-[#FFFAFA]/60 tracking-wider uppercase text-[10px]">
                                  TOTAL RÉGLÉ
                                </span>
                                <span className="font-bold text-[#F6D110] text-sm">
                                  {formatPrice(order.total)}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Drawer Footer with Logout Action (when authenticated) */}
          {user && (
            <div className="p-5 border-t border-[#FFFAFA]/15 bg-[#10100E] flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={onLogout}
                data-cursor="LOGOUT"
                className="font-ui text-xs text-[#FFFAFA]/50 hover:text-white underline underline-offset-4 tracking-[0.2em] uppercase transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>SE DÉCONNECTER</span>
              </button>
              <span className="text-[9px] font-ui tracking-widest text-[#FFFAFA]/30 uppercase">
                SESSION ATELIER ACTIVE
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
