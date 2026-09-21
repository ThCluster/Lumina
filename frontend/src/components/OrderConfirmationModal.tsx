import React from 'react';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Star, 
  ArrowRight, 
  Receipt, 
  ShieldCheck, 
  X 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface OrderConfirmationModalProps {
  onClose: () => void;
  onOpenReviewForProduct?: (productId: string) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  onClose,
  onOpenReviewForProduct
}) => {
  const { currentCompletedOrder, setActiveView, setSelectedProduct, products } = useStore();

  if (!currentCompletedOrder) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-neutral-200 my-8 p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Celebration Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900">
            Merci pour votre commande !
          </h2>
          <p className="text-xs text-neutral-500">
            Votre commande a été confirmée et transmise à notre centre logistique.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/70 pb-3">
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Numéro de commande</span>
              <span className="font-mono font-bold text-neutral-900 text-sm">
                {currentCompletedOrder.orderNumber}
              </span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Date de commande</span>
              <span className="font-semibold text-neutral-800">
                {currentCompletedOrder.date}
              </span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Statut</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                <Package className="w-3 h-3" />
                En préparation
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Livraison à :</span>
              <p className="font-semibold text-neutral-900 mt-0.5">
                {currentCompletedOrder.shippingAddress.fullName}
              </p>
              <p className="text-neutral-600">
                {currentCompletedOrder.shippingAddress.street}, {currentCompletedOrder.shippingAddress.postalCode} {currentCompletedOrder.shippingAddress.city}
              </p>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Numéro de suivi Colissimo :</span>
              <p className="font-mono font-bold text-neutral-800 mt-0.5 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-neutral-500" />
                {currentCompletedOrder.trackingNumber}
              </p>
              <p className="text-emerald-700 text-[11px] font-medium mt-0.5">
                Livraison estimée sous 48 heures ouvrées
              </p>
            </div>
          </div>
        </div>

        {/* Real-time Inventory Update Badge */}
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Stocks actualisés en temps réel</span>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Les unités commandées ont été immédiatement déduites de notre inventaire physique.
            </p>
          </div>
        </div>

        {/* Purchased Items List with quick Review button (Requirement 9) */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
            Articles commandés ({currentCompletedOrder.items.length})
          </h4>
          <div className="divide-y divide-neutral-100 max-h-56 overflow-y-auto">
            {currentCompletedOrder.items.map((item) => {
              const liveProd = products.find((p) => p.id === item.productId);
              return (
                <div key={item.productId} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-neutral-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-neutral-900 truncate">{item.name}</p>
                      <p className="text-neutral-500 text-[11px]">
                        Quantité : {item.quantity} × {item.price.toFixed(2)} €
                      </p>
                    </div>
                  </div>

                  {/* Direct button to leave a review (Requirement 9) */}
                  <button
                    onClick={() => {
                      if (liveProd) {
                        setSelectedProduct(liveProd);
                        onClose();
                      }
                    }}
                    className="shrink-0 px-2.5 py-1 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>Déposer un avis</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-neutral-100">
          <button
            onClick={() => {
              onClose();
              setActiveView('orders');
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98"
          >
            <Package className="w-4 h-4" />
            <span>Voir mon historique de commandes</span>
          </button>
          <button
            onClick={() => {
              onClose();
              setActiveView('catalog');
            }}
            className="py-3 px-4 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>Retour au catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
