import React, { useState } from 'react';
import { 
  PackageCheck, 
  Truck, 
  Calendar, 
  Star, 
  FileText, 
  ExternalLink, 
  ArrowLeft, 
  Clock, 
  CheckCircle,
  Receipt,
  Printer,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, Product } from '../types';

interface OrdersHistoryViewProps {
  onOpenProductReview: (product: Product) => void;
  onOpenAuth: () => void;
}

export const OrdersHistoryView: React.FC<OrdersHistoryViewProps> = ({
  onOpenProductReview,
  onOpenAuth
}) => {
  const { orders, currentUser, setActiveView, products, setSelectedProduct } = useStore();
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Filter orders related to user
  const userOrders = currentUser
    ? orders.filter(
        (o) => o.userId === currentUser.id || o.userEmail.toLowerCase() === currentUser.email.toLowerCase()
      )
    : [];

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'EN_PREPARATION':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            En préparation
          </span>
        );
      case 'EXPEDIEE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            Expédiée
          </span>
        );
      case 'LIVREE':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Livrée
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 pt-4 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <button
            onClick={() => setActiveView('catalog')}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour au catalogue</span>
          </button>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
            Historique de mes commandes
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Consultez le statut de vos commandes, téléchargez vos factures et déposez des avis vérifiés sur vos achats.
          </p>
        </div>

        {currentUser && (
          <div className="text-right self-start sm:self-auto">
            <span className="text-xs font-bold text-neutral-900 block">
              {currentUser.name}
            </span>
            <span className="text-[11px] text-neutral-500">
              {currentUser.email}
            </span>
          </div>
        )}
      </div>

      {/* Guest Notice if not connected */}
      {!currentUser && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-4">
          <span>
            Vous n'êtes pas connecté. Connectez-vous pour retrouver l'historique complet lié à votre compte client.
          </span>
          <button
            onClick={onOpenAuth}
            className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800 shrink-0 text-xs"
          >
            Se connecter
          </button>
        </div>
      )}

      {/* Orders List */}
      {userOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <PackageCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              Aucune commande trouvée
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Vous n'avez pas encore passé de commande sur Lumina.
            </p>
          </div>
          <button
            onClick={() => setActiveView('catalog')}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
          >
            Découvrir le catalogue
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden hover:border-neutral-300 transition-colors"
            >
              {/* Card Header */}
              <div className="p-5 sm:p-6 bg-neutral-50/80 border-b border-neutral-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div>
                    <span className="text-neutral-400 font-semibold text-[10px] uppercase block">
                      Commande
                    </span>
                    <span className="font-mono font-bold text-neutral-900 text-sm">
                      {order.orderNumber}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-400 font-semibold text-[10px] uppercase block">
                      Date d'achat
                    </span>
                    <span className="font-semibold text-neutral-700">
                      {order.date}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-400 font-semibold text-[10px] uppercase block">
                      Montant total
                    </span>
                    <span className="font-extrabold text-neutral-900 text-sm">
                      {order.total.toFixed(2)} €
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}

                  <button
                    onClick={() => setSelectedInvoiceOrder(order)}
                    className="p-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 flex items-center gap-1.5 transition-colors font-semibold"
                    title="Voir et imprimer la facture"
                  >
                    <Receipt className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="hidden sm:inline">Facture</span>
                  </button>
                </div>
              </div>

              {/* Delivery and tracking bar */}
              <div className="px-5 py-3 bg-neutral-100/50 border-b border-neutral-100 text-xs flex flex-wrap items-center justify-between gap-2 text-neutral-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-neutral-400" />
                  <span>
                    Livré à : <strong>{order.shippingAddress.fullName}</strong> ({order.shippingAddress.city})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400 font-mono">Suivi Colissimo :</span>
                  <span className="font-mono font-bold text-neutral-800 text-xs bg-white px-2 py-0.5 rounded border border-neutral-200">
                    {order.trackingNumber}
                  </span>
                </div>
              </div>

              {/* Items in order */}
              <div className="p-5 sm:p-6 divide-y divide-neutral-100">
                {order.items.map((item) => {
                  const liveProduct = products.find((p) => p.id === item.productId);

                  return (
                    <div
                      key={item.productId}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-2xl object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900 leading-snug">
                            {item.name}
                          </h4>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Quantité : <strong className="text-neutral-800">{item.quantity}</strong> × {item.price.toFixed(2)} €
                          </p>
                          <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                            Achat vérifié
                          </span>
                        </div>
                      </div>

                      {/* Direct button to leave verified review (Requirement 9) */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          onClick={() => {
                            if (liveProduct) {
                              onOpenProductReview(liveProduct);
                            } else {
                              // If deleted or custom, set selected and view
                              setSelectedProduct({
                                id: item.productId,
                                name: item.name,
                                tagline: '',
                                brand: 'Lumina',
                                category: 'Tech & Bureau',
                                price: item.price,
                                rating: 5,
                                reviewCount: 1,
                                stock: 5,
                                initialStock: 10,
                                image: item.image,
                                images: [item.image],
                                description: '',
                                features: []
                              });
                            }
                          }}
                          className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>Déposer un avis sur cet article</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl p-6 sm:p-8 space-y-6 border border-neutral-200">
            <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-black text-sm">
                    L
                  </div>
                  <span className="font-extrabold text-lg tracking-tight">LUMINA E-COMMERCE</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Facture d'achat officielle • TVA FR89 291 029 384
                </p>
              </div>

              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-400 font-bold uppercase text-[10px] block">Facturé à :</span>
                <p className="font-bold text-neutral-900 mt-1">{selectedInvoiceOrder.shippingAddress.fullName}</p>
                <p className="text-neutral-600">{selectedInvoiceOrder.shippingAddress.street}</p>
                <p className="text-neutral-600">
                  {selectedInvoiceOrder.shippingAddress.postalCode} {selectedInvoiceOrder.shippingAddress.city}, {selectedInvoiceOrder.shippingAddress.country}
                </p>
                <p className="text-neutral-500 mt-1">{selectedInvoiceOrder.userEmail}</p>
              </div>

              <div className="text-right">
                <span className="text-neutral-400 font-bold uppercase text-[10px] block">Facture N°</span>
                <p className="font-mono font-bold text-neutral-900 text-sm mt-1">{selectedInvoiceOrder.orderNumber}</p>
                <p className="text-neutral-500 mt-1">{selectedInvoiceOrder.date}</p>
                <p className="text-emerald-700 font-bold mt-1">Statut : PAYÉE</p>
              </div>
            </div>

            {/* Table of items */}
            <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold text-neutral-600">
                  <tr>
                    <th className="p-3">Désignation</th>
                    <th className="p-3 text-center">Qté</th>
                    <th className="p-3 text-right">Prix Unitaire</th>
                    <th className="p-3 text-right">Total TTC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {selectedInvoiceOrder.items.map((it) => (
                    <tr key={it.productId}>
                      <td className="p-3 font-semibold text-neutral-900">{it.name}</td>
                      <td className="p-3 text-center">{it.quantity}</td>
                      <td className="p-3 text-right">{it.price.toFixed(2)} €</td>
                      <td className="p-3 text-right font-bold">{(it.price * it.quantity).toFixed(2)} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Invoice Total recap */}
            <div className="space-y-1.5 text-xs text-neutral-600 text-right">
              <div>
                Sous-total HT : <strong className="text-neutral-900">{(selectedInvoiceOrder.total * 0.8).toFixed(2)} €</strong>
              </div>
              <div>
                TVA (20%) : <strong className="text-neutral-900">{(selectedInvoiceOrder.total * 0.2).toFixed(2)} €</strong>
              </div>
              <div>
                Frais d'envoi : <strong className="text-neutral-900">{selectedInvoiceOrder.shippingFee === 0 ? 'Offerts' : `${selectedInvoiceOrder.shippingFee.toFixed(2)} €`}</strong>
              </div>
              <div className="text-base font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
                Total TTC Réglé : {selectedInvoiceOrder.total.toFixed(2)} €
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-semibold text-xs flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer / PDF</span>
              </button>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
