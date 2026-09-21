import React, { useState } from 'react';
import { X, Star, ShieldCheck, MessageSquarePlus } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

interface ReviewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ product, onClose }) => {
  const { currentUser, submitReview, canUserReviewProduct } = useStore();

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) return null;

  const eligibility = canUserReviewProduct(product.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = submitReview(product.id, rating, title, comment);
    setIsSubmitting(false);
    if (res.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 sm:p-8 space-y-5 border border-neutral-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product preview */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-neutral-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-14 h-14 rounded-2xl object-cover bg-neutral-100 border border-neutral-200 shrink-0"
          />
          <div>
            <span className="text-[10px] text-neutral-400 uppercase font-bold block">
              {product.brand} • {product.category}
            </span>
            <h3 className="text-sm font-extrabold text-neutral-900 leading-snug">
              {product.name}
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Achat vérifié
            </span>
          </div>
        </div>

        {eligibility.allowed ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-neutral-700 mb-1.5">
                Attribuez une note :
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm font-bold text-neutral-800 ml-2">
                  {rating} / 5 étoiles
                </span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Titre de votre retour d'expérience *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Confort exceptionnel et design élégant"
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Commentaire détaillé *
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre avis sur l'utilisation, la finition, la durabilité..."
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold flex items-center gap-2 shadow-sm"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Publier mon avis certifié</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
            <p className="font-bold">{eligibility.reason}</p>
            <p className="text-[11px] text-amber-800">
              Afin de préserver l'authenticité absolue des avis de la communauté Lumina, seuls les clients ayant réceptionné cet article peuvent donner leur avis.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-3 py-1.5 bg-neutral-900 text-white rounded-lg font-semibold"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
