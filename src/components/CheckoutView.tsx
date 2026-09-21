import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  Lock, 
  ArrowLeft, 
  ShoppingBag, 
  Sparkles, 
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { ShippingAddress } from '../types';

interface CheckoutViewProps {
  onOrderSuccess: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onOrderSuccess }) => {
  const {
    cart,
    cartSubtotal,
    shippingFee,
    appliedDiscount,
    promoCode,
    cartTotal,
    currentUser,
    placeOrder,
    verifyOrderConsistency,
    setActiveView,
    products
  } = useStore();

  // Shipping form state pre-filled from user profile if available
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [street, setStreet] = useState(currentUser?.address?.street || '');
  const [postalCode, setPostalCode] = useState(currentUser?.address?.postalCode || '');
  const [city, setCity] = useState(currentUser?.address?.city || '');
  const [country, setCountry] = useState(currentUser?.address?.country || 'France');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express' | 'relais'>('standard');

  React.useEffect(() => {
    if (currentUser) {
      if (!fullName) setFullName(currentUser.name);
      if (!email) setEmail(currentUser.email);
      if (!phone && currentUser.phone) setPhone(currentUser.phone);
      if (!street && currentUser.address?.street) setStreet(currentUser.address.street);
      if (!postalCode && currentUser.address?.postalCode) setPostalCode(currentUser.address.postalCode);
      if (!city && currentUser.address?.city) setCity(currentUser.address.city);
    }
  }, [currentUser]);

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'applepay'>('card');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('739');
  const [isProcessing, setIsProcessing] = useState(false);

  // Live order consistency status (Requirement 10: Garantir la cohérence de la commande)
  const consistencyReport = useMemo(() => {
    return verifyOrderConsistency();
  }, [cart, products, verifyOrderConsistency]);

  const handleTriggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore if canvas-confetti is not available
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consistencyReport.isValid) {
      return;
    }

    setIsProcessing(true);

    const shippingAddress: ShippingAddress = {
      fullName,
      email,
      phone,
      street,
      postalCode,
      city,
      country,
      deliveryMethod
    };

    // Simulate safe transaction processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    const result = await placeOrder(shippingAddress, paymentMethod);
    setIsProcessing(false);

    if (result.success) {
      handleTriggerConfetti();
      onOrderSuccess();
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">Votre panier est vide</h2>
        <p className="text-xs text-neutral-500">
          Vous devez avoir au moins un article dans votre panier pour finaliser une commande.
        </p>
        <button
          onClick={() => setActiveView('catalog')}
          className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
        >
          Retourner au catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 pt-4 px-4 sm:px-6 space-y-8">
      {/* Back button & Title */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <button
          onClick={() => setActiveView('catalog')}
          className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continuer mes achats</span>
        </button>
        <span className="text-xs text-neutral-500 font-medium">
          Tunnel de commande sécurisé SSL 256-bit
        </span>
      </div>

      {/* Order Security & Consistency Guarantee Box */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              consistencyReport.isValid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-neutral-900">
                  Garantie de Sécurité &amp; Cohérence de la Commande
                </h3>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  consistencyReport.isValid 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {consistencyReport.isValid ? 'COHÉRENCE VALIDÉE 100%' : 'INCOHÉRENCE DÉTECTÉE'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Vérification atomique en temps réel : conformité des prix du catalogue, suffisance absolue des stocks et intégrité du montant total.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Consistency Diagnostic */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-neutral-800 block">Stocks en temps réel</span>
              <span className="text-neutral-500 text-[11px]">
                {consistencyReport.stockDiscrepancies.length === 0
                  ? 'Tous les articles sont physiquement disponibles.'
                  : `${consistencyReport.stockDiscrepancies.length} produit(s) en dépassement de stock.`}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-neutral-800 block">Conformité des prix unitaires</span>
              <span className="text-neutral-500 text-[11px]">
                Prix panier alignés au centime près sur la base de données.
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-neutral-800 block">Verrouillage transactionnel</span>
              <span className="text-neutral-500 text-[11px]">
                Décrémentation atomique automatique dès paiement validé.
              </span>
            </div>
          </div>
        </div>

        {/* Error / Block message if inconsistency detected */}
        {!consistencyReport.isValid && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>La commande ne peut pas être validée en raison des alertes suivantes :</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1">
              {consistencyReport.errors.map((err, idx) => (
                <li key={idx} className="font-medium">
                  {err}
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-rose-700 italic pt-1">
              Cliquez sur « Réinitialiser » ci-dessus ou ajustez votre panier pour restaurer la cohérence.
            </p>
          </div>
        )}
      </section>

      {/* Main 2-Column Checkout Layout */}
      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Shipping & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Coordonnées & Livraison */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center">1</span>
                <span>Coordonnées &amp; Adresse de livraison</span>
              </h2>
              {currentUser && (
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                  Client : {currentUser.name}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nom et prénom du destinataire *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  placeholder="Ex: Alexandre Martin"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Adresse email de notification *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  placeholder="nom@exemple.fr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Numéro de téléphone *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Rue et numéro d'adresse *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  placeholder="14 Rue de la Paix"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Code postal *
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  placeholder="75002"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Ville *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  placeholder="Paris"
                />
              </div>
            </div>

            {/* Delivery Method Choice */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-neutral-800">
                Mode d'expédition :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`p-3.5 rounded-2xl border cursor-pointer flex items-start gap-3 transition-colors ${
                  deliveryMethod === 'standard'
                    ? 'border-neutral-900 bg-neutral-50/80 ring-1 ring-neutral-900'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}>
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'standard'}
                    onChange={() => setDeliveryMethod('standard')}
                    className="mt-1"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-neutral-900 block">Colissimo Domicile</span>
                    <span className="text-neutral-500 text-[11px]">Livraison sous 48h ouvrées</span>
                    <span className="text-emerald-700 font-semibold block mt-1">
                      {shippingFee === 0 ? 'Gratuit' : `${shippingFee.toFixed(2)} €`}
                    </span>
                  </div>
                </label>

                <label className={`p-3.5 rounded-2xl border cursor-pointer flex items-start gap-3 transition-colors ${
                  deliveryMethod === 'express'
                    ? 'border-neutral-900 bg-neutral-50/80 ring-1 ring-neutral-900'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}>
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'express'}
                    onChange={() => setDeliveryMethod('express')}
                    className="mt-1"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-neutral-900 block">Chronopost Express 24h</span>
                    <span className="text-neutral-500 text-[11px]">Livraison demain avant 13h</span>
                    <span className="text-neutral-800 font-semibold block mt-1">+ 4.00 €</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Step 2: Paiement Sécurisé */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center">2</span>
                <span>Paiement sécurisé crypté</span>
              </h2>
              <div className="flex items-center gap-1.5 text-neutral-400">
                <Lock className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">3D Secure</span>
              </div>
            </div>

            {/* Payment Method Switcher */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Carte bancaire</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('applepay')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  paymentMethod === 'applepay'
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span>Apple Pay</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  paymentMethod === 'paypal'
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span>PayPal</span>
              </button>
            </div>

            {/* Credit Card Inputs */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 bg-neutral-50/80 p-4 rounded-2xl border border-neutral-200">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Numéro de carte bancaire
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="4532 0000 0000 0000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Expiration (MM/AA)
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-neutral-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      placeholder="12/28"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Cryptogramme (CVV)
                    </label>
                    <input
                      type="text"
                      required
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-neutral-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Summary Column: Recap, Totals, Final Confirmation Button (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-sm space-y-5 sticky top-24">
            <h2 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3 flex items-center justify-between">
              <span>Récapitulatif de commande</span>
              <span className="text-xs font-semibold text-neutral-500">
                {cart.length} référence{cart.length > 1 ? 's' : ''}
              </span>
            </h2>

            {/* List of items being ordered */}
            <div className="divide-y divide-neutral-100 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => {
                const liveProduct = products.find((p) => p.id === item.product.id) || item.product;
                return (
                  <div key={item.product.id} className="py-3 flex items-center gap-3">
                    <img
                      src={liveProduct.image}
                      alt={liveProduct.name}
                      className="w-12 h-12 rounded-xl object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate">
                        {liveProduct.name}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        Qté : <strong className="text-neutral-800">{item.quantity}</strong> × {liveProduct.price.toFixed(2)} €
                      </p>
                      <p className="text-[10px] text-emerald-600 font-medium">
                        Stock actuel : {liveProduct.stock} ex. (décrémentation auto)
                      </p>
                    </div>
                    <span className="text-xs font-bold text-neutral-900 shrink-0">
                      {(liveProduct.price * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs text-neutral-600">
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
                <span>Frais d'expédition</span>
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
                  <span>Code {promoCode}</span>
                  <span>-{(cartSubtotal * appliedDiscount).toFixed(2)} €</span>
                </div>
              )}

              <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-3 border-t border-neutral-200">
                <span>Total à régler</span>
                <span className="text-lg text-neutral-900">
                  {cartTotal.toFixed(2)} €
                </span>
              </div>
            </div>

            {/* Requirement 7 Notice */}
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 text-[11px] text-neutral-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
              <span>
                En validant cette commande, les stocks de chaque produit seront automatiquement mis à jour et réservés pour vous.
              </span>
            </div>

            {/* Place Order CTA Button (Requirement 6, 7 & 10) */}
            <button
              type="submit"
              disabled={isProcessing || !consistencyReport.isValid}
              className="w-full py-4 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 disabled:text-neutral-500 text-white font-extrabold text-sm shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Traitement et décrémentation en cours...'
                  : !consistencyReport.isValid
                  ? 'Commande bloquée (incohérence)'
                  : `Régler et finaliser ma commande • ${cartTotal.toFixed(2)} €`}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
