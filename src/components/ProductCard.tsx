import React from 'react';
import { Star, ShoppingBag, Eye, Check, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart, cart, setActiveView, setSelectedProduct } = useStore();

  const cartItem = cart.find((item) => item.product.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0;
  const isMaxInCart = inCartQty >= product.stock && product.stock > 0;

  const handleCardClick = () => {
    onOpenDetails(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock && !isMaxInCart) {
      addToCart(product.id, 1);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer hover:border-neutral-300"
    >
      {/* Image container */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="bg-neutral-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {product.badge}
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Live Stock Indicator Badge (Requirement 7: Suivi du stock en temps réel) */}
        <div className="absolute top-3 right-3 z-10">
          {isOutOfStock ? (
            <span className="bg-rose-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              Rupture
            </span>
          ) : product.stock <= 3 ? (
            <span className="bg-amber-500/95 backdrop-blur-sm text-neutral-950 text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-950" />
              Plus que {product.stock} ex. !
            </span>
          ) : (
            <span className="bg-white/90 backdrop-blur-sm text-emerald-700 border border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
              Stock : {product.stock}
            </span>
          )}
        </div>

        {/* Quick View overlay on hover */}
        <div className="absolute inset-0 bg-neutral-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(product);
            }}
            className="bg-white text-neutral-900 px-4 py-2 rounded-full text-xs font-semibold shadow-lg hover:bg-neutral-100 flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            Voir la fiche &amp; Avis
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-neutral-400 font-medium mb-1">
            <span>{product.brand}</span>
            <span>{product.category}</span>
          </div>

          <h3 className="font-bold text-neutral-900 text-base leading-snug line-clamp-1 group-hover:text-neutral-700 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-neutral-800">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-xs text-neutral-400">
              ({product.reviewCount} avis)
            </span>
          </div>
        </div>

        {/* Price & Add to Cart button */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-neutral-900">
                {product.price.toFixed(2)} €
              </span>
              {product.originalPrice && (
                <span className="text-xs text-neutral-400 line-through">
                  {product.originalPrice.toFixed(2)} €
                </span>
              )}
            </div>
            <span className="text-[10px] text-neutral-400 block">TVA incluse</span>
          </div>

          {/* Add button (Requirement 4: Ajouter un produit au panier) */}
          {isOutOfStock ? (
            <button
              disabled
              className="px-3 py-2 rounded-xl bg-neutral-100 text-neutral-400 text-xs font-semibold cursor-not-allowed flex items-center gap-1.5"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Épuisé
            </button>
          ) : isMaxInCart ? (
            <button
              disabled
              title="Stock maximal déjà présent dans votre panier"
              className="px-3 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold cursor-not-allowed flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              Max ({inCartQty})
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
              title="Ajouter au panier"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{inCartQty > 0 ? `Ajouter (+${inCartQty})` : 'Ajouter'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
