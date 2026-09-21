import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  PackageCheck, 
  Sparkles, 
  X, 
  ChevronRight, 
  LogOut, 
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenProfile }) => {
  const { 
    currentUser, 
    logout, 
    cartCount, 
    setIsCartDrawerOpen, 
    activeView, 
    setActiveView, 
    searchQuery, 
    setSearchQuery, 
    products, 
    setSelectedProduct,
    orders
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search preview items
  const searchPreviewProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSelectSearchedProduct = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setActiveView('catalog');
    setIsSearchOpen(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const userOrdersCount = orders.filter(
    (o) => currentUser && (o.userId === currentUser.id || o.userEmail.toLowerCase() === currentUser.email.toLowerCase())
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      {/* Top micro announcement banner */}
      <div className="bg-neutral-900 text-neutral-300 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-4">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Stocks synchronisés en temps réel &amp; Garantie de cohérence d'achat</span>
        </span>
        <span className="hidden md:inline text-neutral-500">•</span>
        <span className="hidden md:inline text-neutral-300">
          Livraison offerte dès 60 € d'achat avec le code <strong className="text-white">LUMINA10</strong> (-10%)
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => {
                setActiveView('catalog');
                setSelectedProduct(null);
              }}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-black tracking-tighter text-lg shadow-sm group-hover:scale-105 transition-transform">
                L
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-neutral-900 block leading-none">
                  LUMINA
                </span>
                <span className="text-[10px] tracking-widest uppercase text-neutral-400 font-semibold block mt-0.5">
                  Concept Store
                </span>
              </div>
            </button>

            {/* Navigation links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => {
                  setActiveView('catalog');
                  setSelectedProduct(null);
                }}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeView === 'catalog'
                    ? 'text-neutral-900 bg-neutral-100'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                Catalogue
              </button>
              <button
                onClick={() => setActiveView('orders')}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                  activeView === 'orders'
                    ? 'text-neutral-900 bg-neutral-100'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <PackageCheck className="w-4 h-4 text-neutral-500" />
                <span>Mes commandes</span>
                {userOrdersCount > 0 && (
                  <span className="bg-neutral-200 text-neutral-800 text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                    {userOrdersCount}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Search bar with live suggestions (Requirement 3: Rechercher un produit) */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                  if (activeView !== 'catalog') {
                    setActiveView('catalog');
                  }
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Rechercher un casque, clavier, cafetière..."
                className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white text-sm text-neutral-900 pl-10 pr-9 py-2.5 rounded-full border border-transparent focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all placeholder:text-neutral-400"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5"
                  title="Effacer la recherche"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Instant search autocomplete popup */}
            {isSearchOpen && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden z-50">
                <div className="p-3 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-medium">
                  <span>Résultats instantanés ({searchPreviewProducts.length})</span>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="hover:text-neutral-800"
                  >
                    Fermer
                  </button>
                </div>
                {searchPreviewProducts.length === 0 ? (
                  <div className="p-5 text-center text-sm text-neutral-500">
                    Aucun produit ne correspond à « <span className="font-semibold text-neutral-800">{searchQuery}</span> »
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100 max-h-80 overflow-y-auto">
                    {searchPreviewProducts.map((prod) => (
                      <button
                        key={prod.id}
                        onClick={() => handleSelectSearchedProduct(prod)}
                        className="w-full p-3 flex items-center gap-3 hover:bg-neutral-50 text-left transition-colors group"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-12 h-12 rounded-lg object-cover bg-neutral-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-neutral-400 font-medium">{prod.category} • {prod.brand}</p>
                          <p className="text-sm font-semibold text-neutral-900 truncate group-hover:text-neutral-600">
                            {prod.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-neutral-900">
                              {prod.price.toFixed(2)} €
                            </span>
                            {prod.stock > 0 ? (
                              <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                                Stock : {prod.stock}
                              </span>
                            ) : (
                              <span className="text-[10px] text-rose-600 font-medium bg-rose-50 px-1.5 py-0.5 rounded">
                                Rupture
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-700 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons: Demo tester, User profile, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile search trigger */}
            <button
              onClick={() => {
                setActiveView('catalog');
                setIsSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }}
              className="sm:hidden p-2.5 rounded-full hover:bg-neutral-100 text-neutral-700"
              aria-label="Rechercher"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Account / Login button */}
            <div className="relative" ref={userMenuRef}>
              {currentUser ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-full sm:rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
                  aria-label="Mon compte"
                >
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-xs font-semibold text-neutral-800 max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Connexion / Inscription</span>
                </button>
              )}

              {/* User dropdown menu */}
              {isUserMenuOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="text-xs font-semibold text-neutral-900 truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-neutral-500 truncate">
                      {currentUser.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onOpenProfile();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-xs font-medium text-left text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-neutral-400" />
                    Mon profil &amp; Adresses
                  </button>
                  <button
                    onClick={() => {
                      setActiveView('orders');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-xs font-medium text-left text-neutral-700 hover:bg-neutral-50 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <PackageCheck className="w-3.5 h-3.5 text-neutral-400" />
                      Mes commandes
                    </span>
                    {userOrdersCount > 0 && (
                      <span className="text-[10px] font-bold bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded">
                        {userOrdersCount}
                      </span>
                    )}
                  </button>
                  <div className="border-t border-neutral-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-xs font-medium text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button (Requirements 4 & 5: Ajouter & Consulter le panier) */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-sm flex items-center justify-center group"
              aria-label="Voir le panier"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-neutral-950 text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
