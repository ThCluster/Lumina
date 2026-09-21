import React, { useMemo } from 'react';
import { 
  ArrowUpDown, 
  Package
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface CatalogViewProps {
  onOpenProductDetail: (product: Product) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ onOpenProductDetail }) => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    inStockOnly,
    setInStockOnly
  } = useStore();

  const categories = useMemo(() => {
    const cats = ['Toutes', 'Audio & Son', 'Maison & Déco', 'Tech & Bureau', 'Accessoires', 'Café & Barista'];
    return cats.map((cat) => ({
      name: cat,
      count: cat === 'Toutes' ? products.length : products.filter((p) => p.category === cat).length
    }));
  }, [products]);

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'Toutes' && p.category !== selectedCategory) {
          return false;
        }
        // In-stock only filter
        if (inStockOnly && p.stock <= 0) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(query);
          const matchTagline = p.tagline.toLowerCase().includes(query);
          const matchBrand = p.brand.toLowerCase().includes(query);
          const matchCategory = p.category.toLowerCase().includes(query);
          if (!matchName && !matchTagline && !matchBrand && !matchCategory) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // default featured
      });
  }, [products, selectedCategory, inStockOnly, searchQuery, sortBy]);

  return (
    <div className="pb-16 space-y-6">
      {/* Filter and Search Bar Controls (Requirement 2 & 3: Catalogue & Recherche) */}
      <div className="space-y-4">
        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === cat.name
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:text-neutral-900'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat.name
                    ? 'bg-neutral-700 text-white'
                    : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Second Row: Filters, Search indicator, Sorting */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-neutral-200/80 shadow-xs">
          {/* Active Search & count info */}
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            {searchQuery ? (
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {filteredProducts.length} résultat{filteredProducts.length > 1 ? 's' : ''} pour «{' '}
                  <strong className="text-neutral-900">{searchQuery}</strong> »
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-neutral-400 hover:text-neutral-900 underline text-xs ml-1"
                >
                  Effacer
                </button>
              </div>
            ) : (
              <span className="font-medium text-neutral-500">
                Affichage de <strong className="text-neutral-900">{filteredProducts.length}</strong> produit{filteredProducts.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* In stock only toggle */}
            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer select-none bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
              />
              <span>En stock uniquement</span>
            </label>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-neutral-800 focus:outline-none cursor-pointer"
              >
                <option value="featured">Recommandés</option>
                <option value="price-asc">Prix : croissant</option>
                <option value="price-desc">Prix : décroissant</option>
                <option value="rating">Mieux notés</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid (Requirement 2: Consulter le catalogue) */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center max-w-md mx-auto space-y-4 my-8">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900">Aucun produit trouvé</h3>
            <p className="text-xs text-neutral-500 mt-1">
              {searchQuery
                ? `Aucun article ne correspond à votre recherche "${searchQuery}". Essayez avec d'autres termes.`
                : 'Aucun article ne correspond aux filtres sélectionnés.'}
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Toutes');
              setInStockOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
          >
            Réinitialiser tous les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenProductDetail}
            />
          ))}
        </div>
      )}
    </div>
  );
};
