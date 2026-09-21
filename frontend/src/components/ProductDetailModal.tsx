import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Check, 
  MessageSquarePlus, 
  ChevronRight,
  Info
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenAuth
}) => {
  const {
    addToCart,
    cart,
    getProductReviews,
    canUserReviewProduct,
    submitReview,
    currentUser
  } = useStore();

  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Review form states
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const cartItem = cart.find((item) => item.product.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0;
  const maxCanAdd = Math.max(0, product.stock - inCartQty);

  const reviews = getProductReviews(product.id);
  const reviewEligibility = canUserReviewProduct(product.id);

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= maxCanAdd) {
      addToCart(product.id, quantity);
      setQuantity(1);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    const res = submitReview(product.id, rating, reviewTitle, reviewComment);
    setIsSubmittingReview(false);
    if (res.success) {
      setReviewTitle('');
      setReviewComment('');
    }
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-hidden bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
    >
      {/* Compact & Refined Container */}
      <div 
        id="product-detail-modal"
        className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-neutral-200 flex flex-col max-h-[82vh] transition-all"
      >
        {/* Compact Header */}
        <div className="px-4 py-2.5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 truncate pr-3">
            <span className="font-semibold text-neutral-800">{product.brand}</span>
            <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
            <span className="truncate">{product.category}</span>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-200/70 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors shrink-0"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 py-2 border-b border-neutral-100 flex items-center gap-2 shrink-0 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'details'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Aperçu &amp; Fiche
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>Avis clients</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'reviews' ? 'bg-neutral-700 text-neutral-100' : 'bg-neutral-200 text-neutral-700'
            }`}>
              {reviews.length}
            </span>
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3.5 text-xs">
          {activeTab === 'details' ? (
            <>
              {/* Product Visual Showcase */}
              <div className="space-y-2">
                <div className="relative h-44 sm:h-48 w-full rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                  <img
                    src={product.images[selectedImageIndex] || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />

                  {product.badge && (
                    <span className="absolute top-2 left-2 bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Thumbnails if multiple */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-10 h-10 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                          selectedImageIndex === idx
                            ? 'border-neutral-900 shadow-2xs'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Tagline */}
              <div>
                <h2 className="text-base font-bold text-neutral-900 leading-snug">
                  {product.name}
                </h2>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  {product.tagline}
                </p>
              </div>

              {/* Price, Rating & Stock Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/80">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-extrabold text-neutral-900">
                    {product.price.toFixed(2)} €
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-neutral-400 line-through">
                      {product.originalPrice.toFixed(2)} €
                    </span>
                  )}
                  <span className="text-[10px] text-neutral-400">TTC</span>
                </div>

                <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-neutral-200 text-neutral-800 text-[11px] font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-neutral-400 font-normal">({product.reviewCount})</span>
                </div>

                {/* Stock Tag */}
                {isOutOfStock ? (
                  <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] border border-rose-200">
                    Rupture de stock
                  </span>
                ) : product.stock <= 3 ? (
                  <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-300">
                    Plus que {product.stock} ex.
                  </span>
                ) : (
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                    En stock ({product.stock} ex.)
                  </span>
                )}
              </div>

              {/* Stock Bar */}
              <div className="space-y-1">
                <div className="w-full bg-neutral-200 h-1 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isOutOfStock ? 'bg-rose-500 w-0' : product.stock <= 3 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{
                      width: isOutOfStock ? '0%' : `${Math.min(100, (product.stock / product.initialStock) * 100)}%`
                    }}
                  />
                </div>
                {inCartQty > 0 && (
                  <p className="text-[10px] text-neutral-500">
                    {inCartQty} article{inCartQty > 1 ? 's' : ''} déjà présent{inCartQty > 1 ? 's' : ''} dans votre panier.
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="pt-1.5 border-t border-neutral-100">
                <h4 className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider mb-1">
                  Description
                </h4>
                <p className="text-neutral-600 text-[11px] leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Key Features */}
              <div>
                <h4 className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                  Points forts
                </h4>
                <div className="grid grid-cols-1 gap-1">
                  {product.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-neutral-600">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges Reassurance */}
              <div className="pt-2 border-t border-neutral-100 grid grid-cols-2 gap-2 text-[11px] text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Garantie 2 ans</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                  <span>Colissimo 48h</span>
                </div>
              </div>
            </>
          ) : (
            /* TAB: Reviews */
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <h3 className="text-xs font-bold text-neutral-900">
                  Avis clients certifiés ({reviews.length})
                </h3>
                {!currentUser && (
                  <button
                    onClick={onOpenAuth}
                    className="text-[11px] font-semibold text-neutral-800 hover:underline"
                  >
                    Se connecter pour donner un avis
                  </button>
                )}
              </div>

              {/* Submit Review Form if eligible */}
              {currentUser && reviewEligibility.allowed ? (
                <form
                  onSubmit={handleReviewSubmit}
                  className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-200 space-y-2.5"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Achat vérifié : Partagez votre retour d'expérience</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-neutral-600 mb-0.5">
                      Note :
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-[11px] font-bold text-neutral-700 ml-1.5">
                        {rating} / 5
                      </span>
                    </div>
                  </div>

                  <input
                    type="text"
                    required
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Titre de votre avis..."
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />

                  <textarea
                    required
                    rows={2}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Votre avis détaillé..."
                    className="w-full text-xs p-2 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="py-1.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>Publier mon avis vérifié</span>
                  </button>
                </form>
              ) : currentUser && !reviewEligibility.allowed ? (
                <div className="bg-neutral-50 rounded-xl p-2.5 border border-neutral-200 text-[11px] text-neutral-600 flex items-start gap-2">
                  <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <p>
                    <span className="font-semibold text-neutral-800">{reviewEligibility.reason}</span>
                    <br />
                    Seuls les clients ayant acheté ce produit peuvent publier un avis certifié.
                  </p>
                </div>
              ) : null}

              {/* Reviews List */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {reviews.length === 0 ? (
                  <p className="text-center py-4 text-neutral-400 text-xs">
                    Aucun avis pour le moment.
                  </p>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-white rounded-xl p-3 border border-neutral-200 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-neutral-900 text-xs">
                            {rev.userName}
                          </span>
                          {rev.verifiedPurchase && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                              Vérifié
                            </span>
                          )}
                        </div>

                        <div className="flex items-center text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="font-semibold text-neutral-800 text-xs">
                        {rev.title}
                      </p>
                      <p className="text-neutral-600 text-[11px] leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pinned Action Footer (Always 100% visible, never cut off) */}
        <div className="p-3 bg-white border-t border-neutral-200/90 flex items-center justify-between gap-3 shrink-0 z-10 shadow-xs">
          {/* Quantity Selector */}
          <div className="flex items-center border border-neutral-300 rounded-xl bg-neutral-50 p-0.5">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={isOutOfStock || quantity <= 1}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-white disabled:opacity-30 font-bold"
            >
              -
            </button>
            <span className="w-8 text-center text-xs font-bold text-neutral-900">
              {isOutOfStock ? 0 : quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(maxCanAdd, q + 1))}
              disabled={isOutOfStock || quantity >= maxCanAdd}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-white disabled:opacity-30 font-bold"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || maxCanAdd <= 0}
            className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-bold text-xs shadow-sm transition-transform active:scale-98 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {isOutOfStock
                ? 'Rupture de stock'
                : maxCanAdd <= 0
                ? 'Stock panier atteint'
                : `Ajouter au panier • ${(product.price * quantity).toFixed(2)} €`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
