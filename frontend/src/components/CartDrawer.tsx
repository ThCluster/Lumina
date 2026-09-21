import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  AlertTriangle, 
  Check, 
  ShieldCheck 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    shippingFee,
    appliedDiscount,
    promoCode,
    applyPromoCode,
    removePromoCode,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    setActiveView,
    products
  } = useStore();

  const [inputPromo, setInputPromo] = useState('');

  if (!isCartDrawerOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setActiveView('checkout');
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPromo.trim()) {
      applyPromoCode(inputPromo);
      setInputPromo('');
    }
  };

  const freeShippingThreshold = 60;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-neutral-200 animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Mon Panier</h2>
              <p className="text-xs text-neutral-500 font-medium">
                {cartCount} article{cartCount > 1 ? 's' : ''} sélectionné{cartCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-neutral-200/70 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="p-3 bg-neutral-100/80 border-b border-neutral-200/80 text-xs">
          {remainingForFreeShipping === 0 ? (
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Félicitations ! Vous bénéficiez de la livraison offerte.</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-neutral-700">
                <span>Plus que <strong>{remainingForFreeShipping.toFixed(2)} €</strong> pour la livraison offerte !</span>
                <Truck className="w-3.5 h-3.5 text-neutral-500" />
              </div>
              <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-neutral-900 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-neutral-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">Votre panier est vide</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                  Découvrez nos produits d'exception et ajoutez vos coups de cœur en toute sérénité.
                </p>
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
              >
                Explorer le catalogue
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const liveProduct = products.find((p) => p.id === item.product.id) || item.product;
              const isLowStock = liveProduct.stock <= 3;
              const isMaxStockReached = item.quantity >= liveProduct.stock;

              return (
                <div key={item.product.id} className="py-4 flex gap-3.5 items-start">
                  <img
                    src={liveProduct.image}
                    alt={liveProduct.name}
                    className="w-16 h-16 rounded-xl object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-neutral-400 font-semibold block uppercase">
                          {liveProduct.brand}
                        </span>
                        <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">
                          {liveProduct.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-extrabold text-neutral-900">
                        {(liveProduct.price * item.quantity).toFixed(2)} €
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        ({liveProduct.price.toFixed(2)} € / unité)
                      </span>
                    </div>

                    {/* Stock Alert Warning inside cart item */}
                    {liveProduct.stock <= 0 ? (
                      <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Article devenu épuisé en stock !
                      </span>
                    ) : isMaxStockReached ? (
                      <span className="text-[10px] text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded inline-block">
                        Stock maximal atteint ({liveProduct.stock} ex.)
                      </span>
                    ) : isLowStock ? (
                      <span className="text-[10px] text-amber-600 font-medium">
                        Plus que {liveProduct.stock} exemplaires restants
                      </span>
                    ) : null}

                    {/* Quantity Selector Controls */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs font-bold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-l-lg"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          disabled={isMaxStockReached}
                          className="w-6 h-6 flex items-center justify-center text-xs font-bold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-r-lg disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Summary & Checkout Button */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50 space-y-3">
            {/* Promo Code Input */}
            <div>
              {promoCode ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Code {promoCode} activé</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-emerald-700 hover:text-emerald-900 text-xs underline"
                  >
                    Retirer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={inputPromo}
                    onChange={(e) => setInputPromo(e.target.value)}
                    placeholder="Code promo (ex: LUMINA10)"
                    className="flex-1 bg-white border border-neutral-200 text-xs p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 uppercase"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold"
                  >
                    Appliquer
                  </button>
                </form>
              )}
            </div>

            {/* Quick suggested promo tags */}
            {!promoCode && (
              <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                <span>Suggestions :</span>
                <button
                  type="button"
                  onClick={() => applyPromoCode('LUMINA10')}
                  className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 px-1.5 py-0.5 rounded font-mono font-bold"
                >
                  LUMINA10 (-10%)
                </button>
                <button
                  type="button"
                  onClick={() => applyPromoCode('WELCOME20')}
                  className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 px-1.5 py-0.5 rounded font-mono font-bold"
                >
                  WELCOME20 (-20%)
                </button>
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-1.5 pt-2 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Sous-total HT</span>
                <span className="font-semibold text-neutral-800">
                  {(cartSubtotal * 0.8).toFixed(2)} €
                </span>
              </div>
              <div className="flex justify-between">
                <span>TVA (20%)</span>
                <span className="font-semibold text-neutral-800">
                  {(cartSubtotal * 0.2).toFixed(2)} €
                </span>
              </div>
              <div className="flex justify-between">
                <span>Frais de livraison</span>
                <span className="font-semibold text-neutral-800">
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-600 font-bold">Offerts</strong>
                  ) : (
                    `${shippingFee.toFixed(2)} €`
                  )}
                </span>
              </div>

              {appliedDiscount > 0 && promoCode !== 'FREESHIP' && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Réduction promo (-{Math.round(appliedDiscount * 100)}%)</span>
                  <span>-{(cartSubtotal * appliedDiscount).toFixed(2)} €</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Total TTC</span>
                <span className="text-base text-neutral-900">
                  {cartTotal.toFixed(2)} €
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm shadow-md transition-transform active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Valider la commande • {cartTotal.toFixed(2)} €</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cohérence des stocks garantie avant règlement</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
