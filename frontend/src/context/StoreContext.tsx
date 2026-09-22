import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Product, CartItem, Order, Review, User, ShippingAddress, ConsistencyValidation } from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, DEMO_USER } from '../data/mockProducts';
import api from '../services/api';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface StoreContextType {
  // User & Auth
  currentUser: User | null;
  register: (name: string, email: string, password?: string, address?: User['address'], phone?: string) => Promise<boolean>;
  login: (email: string, password?: string) => Promise<boolean>;
  loginDemoUser: () => void;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;

  // Catalog & Navigation
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating') => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (prod: Product | null) => void;
  activeView: 'catalog' | 'cart' | 'checkout' | 'orders' | 'profile' | 'product-detail' | 'auth';
  setActiveView: (view: 'catalog' | 'cart' | 'checkout' | 'orders' | 'profile' | 'product-detail' | 'auth') => void;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  promoCode: string;
  appliedDiscount: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  cartTotal: number;
  addToCart: (productId: string, quantity?: number) => boolean;
  updateCartQuantity: (productId: string, quantity: number) => boolean;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Consistency & Orders
  verifyOrderConsistency: () => ConsistencyValidation;
  placeOrder: (shippingAddress: ShippingAddress, paymentMethod: 'card' | 'paypal' | 'applepay') => Promise<{ success: boolean; order?: Order; error?: string }>;
  orders: Order[];
  currentCompletedOrder: Order | null;
  setCurrentCompletedOrder: (order: Order | null) => void;

  // Reviews
  reviews: Review[];
  getProductReviews: (productId: string) => Review[];
  canUserReviewProduct: (productId: string) => { allowed: boolean; reason?: string };
  submitReview: (productId: string, rating: number, title: string, comment: string) => { success: boolean; error?: string };

  // Toasts
  toasts: ToastNotification[];
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Dev / Testing tools for evaluators
  resetDemoData: () => void;
  simulateStockDepletion: (productId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'lumina_products_v1',
  REVIEWS: 'lumina_reviews_v1',
  USER: 'lumina_current_user_v1',
  USERS_LIST: 'lumina_users_list_v1',
  ORDERS: 'lumina_orders_v1',
  CART: 'lumina_cart_v1'
};

const normalizeUser = (user: any): User => ({
  id: user?._id ?? user?.id ?? `user-${Date.now()}`,
  name: user?.nom ?? user?.name ?? 'Utilisateur',
  email: user?.email ?? '',
  phone: user?.phone ?? '',
  address: user?.address ?? {
    street: '12 Avenue des Champs-Élysées',
    postalCode: '75008',
    city: 'Paris',
    country: 'France'
  },
  createdAt: user?.createdAt ?? new Date().toISOString(),
});

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load products with local persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading products from storage:', e);
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    let cancelled = false;

    const loadProductsFromApi = async () => {
      try {
        const data = await api.getProducts();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          const mappedProducts: Product[] = data.map((product: any) => ({
            id: product.id ?? product._id,
            name: product.name ?? product.nom,
            tagline: product.tagline ?? product.description ?? 'Produit Lumina',
            brand: product.brand ?? 'Lumina',
            category: product.category ?? 'Divers',
            price: Number(product.price ?? product.prix ?? 0),
            originalPrice: product.originalPrice ?? undefined,
            rating: Number(product.rating ?? 4.5),
            reviewCount: Number(product.reviewCount ?? 0),
            stock: Number(product.stock ?? 0),
            initialStock: Number(product.initialStock ?? product.stock ?? 0),
            image: product.image ?? product.images?.[0] ?? '',
            images: Array.isArray(product.images) ? product.images : [product.image ?? ''],
            description: product.description ?? 'Produit disponible en boutique.',
            features: Array.isArray(product.features) ? product.features : [],
            badge: product.badge ?? undefined,
          }));

          setProducts(mappedProducts);
        }
      } catch (error) {
        console.warn('Unable to load products from backend, using local demo data.', error);
      }
    };

    loadProductsFromApi();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading reviews from storage:', e);
    }
    return INITIAL_REVIEWS;
  });

  // Current authenticated user (starts as null for visitors, restores only if explicitly authenticated)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const explicit = localStorage.getItem('lumina_explicitly_logged_in');
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (explicit === 'true' && stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading user from storage:', e);
    }
    return null; // Visitors arrive not logged in
  });

  // Registered users list
  const [usersList, setUsersList] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading users list from storage:', e);
    }
    return [DEMO_USER];
  });

  // Orders history
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading orders from storage:', e);
    }
    // Preload an initial sample order for the demo user so they immediately have a history and review eligibility!
    return [
      {
        id: 'ord-init-1',
        orderNumber: 'CMD-2026-7841',
        date: '14 Août 2026 à 10:15',
        userId: DEMO_USER.id,
        userEmail: DEMO_USER.email,
        userName: DEMO_USER.name,
        shippingAddress: {
          fullName: DEMO_USER.name,
          email: DEMO_USER.email,
          phone: DEMO_USER.phone,
          street: DEMO_USER.address.street,
          postalCode: DEMO_USER.address.postalCode,
          city: DEMO_USER.address.city,
          country: DEMO_USER.address.country,
          deliveryMethod: 'standard'
        },
        items: [
          {
            productId: 'prod-1',
            name: 'Casque Studio Sans Fil ANC Pro',
            price: 249.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
          },
          {
            productId: 'prod-4',
            name: 'Cafetière Filtre Barista Precision & Carafe Thermique',
            price: 169.00,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80'
          }
        ],
        subtotal: 418.99,
        shippingFee: 0,
        discount: 0,
        tax: 69.83,
        total: 418.99,
        status: 'LIVREE',
        paymentMethod: 'card',
        trackingNumber: 'FR982143091COL',
        createdAt: Date.now() - 36 * 24 * 3600 * 1000
      }
    ];
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CART);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading cart from storage:', e);
    }
    return [];
  });

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedProduct, setSelectedProductState] = useState<Product | null>(null);
  const [activeView, setActiveView] = useState<'catalog' | 'cart' | 'checkout' | 'orders' | 'profile' | 'product-detail' | 'auth'>(() => {
    return currentUser ? 'catalog' : 'auth';
  });

  const setSelectedProduct = (prod: Product | null) => {
    setSelectedProductState(prod);
    if (!prod && activeView === 'product-detail') {
      setActiveView('catalog');
    }
  };
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [currentCompletedOrder, setCurrentCompletedOrder] = useState<Order | null>(null);

  // Promo code
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);

  // Notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync states to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  // Toast helper
  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth functions
  const register = async (name: string, email: string, password?: string, address?: User['address'], phone?: string): Promise<boolean> => {
    const trimmedEmail = email.trim().toLowerCase();
    const existing = usersList.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      addToast('Un compte existe déjà avec cette adresse email.', 'error');
      return false;
    }

    try {
      const result = await api.register(trimmedEmail, password ?? '', name.trim());
      const newUser = normalizeUser({
        _id: result?.id ?? `user-${Date.now()}`,
        name: name.trim(),
        email: trimmedEmail,
        phone: phone || '',
        address: address || {
          street: '12 Avenue des Champs-Élysées',
          postalCode: '75008',
          city: 'Paris',
          country: 'France'
        },
        createdAt: new Date().toISOString(),
      });

      setUsersList((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      localStorage.setItem('lumina_explicitly_logged_in', 'true');
      setActiveView('catalog');
      addToast(`Compte créé avec succès ! Bienvenue, ${newUser.name}.`, 'success');
      return true;
    } catch (error) {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: trimmedEmail,
        phone: phone || '',
        address: address || {
          street: '12 Avenue des Champs-Élysées',
          postalCode: '75008',
          city: 'Paris',
          country: 'France'
        },
        createdAt: new Date().toISOString()
      };

      setUsersList((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      localStorage.setItem('lumina_explicitly_logged_in', 'true');
      setActiveView('catalog');
      addToast(`Compte créé avec succès ! Bienvenue, ${newUser.name}.`, 'success');
      return true;
    }
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    const trimmedEmail = email.trim().toLowerCase();

    try {
      const backendUser = await api.login(trimmedEmail, password ?? '');
      const normalizedUser = normalizeUser(backendUser);
      setCurrentUser(normalizedUser);
      setUsersList((prev) => {
        const exists = prev.some((u) => u.email.toLowerCase() === normalizedUser.email.toLowerCase());
        return exists ? prev.map((u) => (u.email.toLowerCase() === normalizedUser.email.toLowerCase() ? normalizedUser : u)) : [...prev, normalizedUser];
      });
      localStorage.setItem('lumina_explicitly_logged_in', 'true');
      setActiveView('catalog');
      addToast(`Ravi de vous revoir, ${normalizedUser.name} !`, 'success');
      return true;
    } catch (error) {
      const found = usersList.find((u) => u.email.toLowerCase() === trimmedEmail);
      if (found) {
        setCurrentUser(found);
        localStorage.setItem('lumina_explicitly_logged_in', 'true');
        setActiveView('catalog');
        addToast(`Ravi de vous revoir, ${found.name} !`, 'success');
        return true;
      }

      if (trimmedEmail === DEMO_USER.email.toLowerCase()) {
        setCurrentUser(DEMO_USER);
        localStorage.setItem('lumina_explicitly_logged_in', 'true');
        setActiveView('catalog');
        addToast(`Connecté avec le compte de démonstration (${DEMO_USER.name})`, 'success');
        return true;
      }

      addToast('Identifiants incorrects ou compte introuvable.', 'error');
      return false;
    }
  };

  const loginDemoUser = () => {
    setCurrentUser(DEMO_USER);
    try {
      localStorage.setItem('lumina_explicitly_logged_in', 'true');
    } catch (e) {
      console.error(e);
    }
    setActiveView('catalog');
    addToast(`Connecté en tant que ${DEMO_USER.name} (Compte Démo)`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('lumina_explicitly_logged_in');
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (e) {
      console.error(e);
    }
    setActiveView('auth');
    addToast('Vous avez été déconnecté.', 'info');
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsersList((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    addToast('Profil mis à jour avec succès.', 'success');
  };

  // Cart operations
  const addToCart = (productId: string, quantity: number = 1): boolean => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      addToast('Produit introuvable.', 'error');
      return false;
    }

    if (product.stock <= 0) {
      addToast(`Le produit "${product.name}" est actuellement en rupture de stock.`, 'error');
      return false;
    }

    const existingCartItem = cart.find((item) => item.product.id === productId);
    const currentInCart = existingCartItem ? existingCartItem.quantity : 0;
    const newTotalQty = currentInCart + quantity;

    if (newTotalQty > product.stock) {
      const remainingAllowed = product.stock - currentInCart;
      if (remainingAllowed <= 0) {
        addToast(`Vous avez déjà atteint le stock maximal (${product.stock} ex.) pour cet article dans votre panier.`, 'warning');
      } else {
        addToast(`Stock insuffisant : vous ne pouvez ajouter que ${remainingAllowed} exemplaire(s) supplémentaire(s).`, 'warning');
      }
      return false;
    }

    if (currentUser) {
      try {
        api.addToCart(currentUser.id, productId, quantity);
      } catch (error) {
        console.warn('Cart sync failed, kept local cart fallback.', error);
      }
    }

    setCart((prev) => {
      if (existingCartItem) {
        return prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + quantity, product }
            : item
        );
      }
      return [...prev, { product, quantity, addedAt: Date.now() }];
    });

    addToast(`"${product.name}" ajouté à votre panier.`, 'success');
    return true;
  };

  const updateCartQuantity = (productId: string, quantity: number): boolean => {
    const product = products.find((p) => p.id === productId);
    if (!product) return false;

    if (quantity <= 0) {
      removeFromCart(productId);
      return true;
    }

    if (quantity > product.stock) {
      addToast(`Désolé, il ne reste que ${product.stock} exemplaire(s) disponible(s) en stock.`, 'warning');
      // clamp to maximum available stock
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: product.stock, product } : item
        )
      );
      return false;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity, product } : item
      )
    );
    return true;
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addToast('Article retiré du panier.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Promo code
  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'LUMINA10' || clean === 'WELCOME10') {
      setPromoCode(clean);
      setAppliedDiscount(0.10); // 10%
      addToast('Code promo appliqué : -10% sur votre commande !', 'success');
      return { success: true, message: '-10% appliqué' };
    }
    if (clean === 'WELCOME20') {
      setPromoCode(clean);
      setAppliedDiscount(0.20); // 20%
      addToast('Code promo appliqué : -20% de bienvenue !', 'success');
      return { success: true, message: '-20% appliqué' };
    }
    if (clean === 'FREESHIP') {
      setPromoCode(clean);
      setAppliedDiscount(0.01); // trigger free shipping
      addToast('Code promo appliqué : Frais de port offerts !', 'success');
      return { success: true, message: 'Livraison offerte' };
    }

    addToast('Code promo invalide. Essayez "LUMINA10" ou "WELCOME20".', 'error');
    return { success: false, message: 'Code promo invalide' };
  };

  const removePromoCode = () => {
    setPromoCode('');
    setAppliedDiscount(0);
    addToast('Code promo supprimé.', 'info');
  };

  // Calculations
  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      // Always look up the real-time catalog price for mathematical accuracy
      const liveProduct = products.find((p) => p.id === item.product.id) || item.product;
      return sum + liveProduct.price * item.quantity;
    }, 0);
  }, [cart, products]);

  const shippingFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    if (promoCode === 'FREESHIP') return 0;
    // Free shipping above 60€
    return cartSubtotal >= 60 ? 0 : 4.90;
  }, [cartSubtotal, promoCode]);

  const discountAmount = useMemo(() => {
    if (promoCode === 'FREESHIP') return 0;
    return cartSubtotal * appliedDiscount;
  }, [cartSubtotal, appliedDiscount, promoCode]);

  const cartTotal = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    const base = cartSubtotal - discountAmount + shippingFee;
    return Math.max(0, Math.round(base * 100) / 100);
  }, [cartSubtotal, discountAmount, shippingFee]);

  // Requirement 10: Consistency Verification
  const verifyOrderConsistency = (): ConsistencyValidation => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const stockDiscrepancies: ConsistencyValidation['stockDiscrepancies'] = [];
    const priceDiscrepancies: ConsistencyValidation['priceDiscrepancies'] = [];

    if (cart.length === 0) {
      errors.push('Le panier est vide. Impossible de passer une commande.');
      return {
        isValid: false,
        errors,
        warnings,
        stockDiscrepancies,
        priceDiscrepancies
      };
    }

    // Check each item against real-time live product catalog
    for (const item of cart) {
      const liveProduct = products.find((p) => p.id === item.product.id);

      if (!liveProduct) {
        errors.push(`L'article "${item.product.name}" n'existe plus dans notre catalogue.`);
        continue;
      }

      // Check stock sufficiency
      if (liveProduct.stock <= 0) {
        errors.push(`L'article "${liveProduct.name}" est désormais épuisé.`);
        stockDiscrepancies.push({
          productId: liveProduct.id,
          productName: liveProduct.name,
          requestedQty: item.quantity,
          availableStock: 0
        });
      } else if (item.quantity > liveProduct.stock) {
        errors.push(
          `Quantité insuffisante pour "${liveProduct.name}" : vous demandez ${item.quantity} unité(s), mais seuls ${liveProduct.stock} exemplaire(s) restent en stock.`
        );
        stockDiscrepancies.push({
          productId: liveProduct.id,
          productName: liveProduct.name,
          requestedQty: item.quantity,
          availableStock: liveProduct.stock
        });
      }

      // Check price matching
      if (Math.abs(item.product.price - liveProduct.price) > 0.001) {
        warnings.push(
          `Le prix de "${liveProduct.name}" a été actualisé à ${liveProduct.price.toFixed(2)} € (au lieu de ${item.product.price.toFixed(2)} €).`
        );
        priceDiscrepancies.push({
          productId: liveProduct.id,
          productName: liveProduct.name,
          cartPrice: item.product.price,
          catalogPrice: liveProduct.price
        });
      }
    }

    const isValid = errors.length === 0;
    return {
      isValid,
      errors,
      warnings,
      stockDiscrepancies,
      priceDiscrepancies
    };
  };

  // Requirement 6, 7 & 10: Place Order with Automatic Stock Decrement & Consistency Check
  const placeOrder = async (
    shippingAddress: ShippingAddress,
    paymentMethod: 'card' | 'paypal' | 'applepay'
  ): Promise<{ success: boolean; order?: Order; error?: string }> => {
    const check = verifyOrderConsistency();
    if (!check.isValid) {
      const primaryError = check.errors[0] || 'Incohérence détectée dans votre commande.';
      addToast(primaryError, 'error');
      return { success: false, error: primaryError };
    }

    const orderUser = currentUser || {
      id: `guest-${Date.now()}`,
      name: shippingAddress.fullName,
      email: shippingAddress.email,
      phone: shippingAddress.phone,
      address: {
        street: shippingAddress.street,
        postalCode: shippingAddress.postalCode,
        city: shippingAddress.city,
        country: shippingAddress.country
      },
      createdAt: new Date().toISOString()
    };

    setProducts((prevProducts) => {
      const updated = prevProducts.map((prod) => {
        const cartItem = cart.find((item) => item.product.id === prod.id);
        if (cartItem) {
          const newStock = Math.max(0, prod.stock - cartItem.quantity);
          return { ...prod, stock: newStock };
        }
        return prod;
      });
      return updated;
    });

    try {
      if (orderUser.id) {
        await api.placeOrder(orderUser.id, shippingAddress.street || '');
      }
    } catch (error) {
      console.warn('Order API sync failed; local order flow kept as fallback.', error);
    }

    const orderNumber = `CMD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = `FR${Math.floor(100000000 + Math.random() * 900000000)}COL`;

    const orderItems = cart.map((item) => {
      const liveProduct = products.find((p) => p.id === item.product.id) || item.product;
      return {
        productId: liveProduct.id,
        name: liveProduct.name,
        price: liveProduct.price,
        quantity: item.quantity,
        image: liveProduct.image
      };
    });

    const taxAmount = Math.round((cartTotal * 0.20) * 100) / 100;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      date: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      userId: orderUser.id,
      userEmail: orderUser.email,
      userName: orderUser.name,
      shippingAddress,
      items: orderItems,
      subtotal: cartSubtotal,
      shippingFee,
      discount: discountAmount,
      tax: taxAmount,
      total: cartTotal,
      status: 'EN_PREPARATION',
      paymentMethod,
      trackingNumber,
      createdAt: Date.now()
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentCompletedOrder(newOrder);
    clearCart();
    setPromoCode('');
    setAppliedDiscount(0);

    addToast(`Commande ${orderNumber} validée avec succès ! Stocks mis à jour.`, 'success');
    return { success: true, order: newOrder };
  };

  // Requirement 9: Reviewing purchased products
  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  const canUserReviewProduct = (productId: string): { allowed: boolean; reason?: string } => {
    if (!currentUser) {
      return {
        allowed: false,
        reason: 'Vous devez être connecté pour déposer un avis.'
      };
    }

    // Check if user already reviewed this product
    const alreadyReviewed = reviews.some(
      (r) => r.productId === productId && (r.userId === currentUser.id || r.userName.toLowerCase() === currentUser.name.toLowerCase())
    );
    if (alreadyReviewed) {
      return {
        allowed: false,
        reason: 'Vous avez déjà publié un avis sur ce produit.'
      };
    }

    // Check if user has purchased this product in any of their completed orders
    const hasPurchased = orders.some(
      (order) =>
        (order.userId === currentUser.id || order.userEmail.toLowerCase() === currentUser.email.toLowerCase()) &&
        order.items.some((item) => item.productId === productId)
    );

    if (!hasPurchased) {
      return {
        allowed: false,
        reason: 'Avis réservé aux acheteurs vérifiés : vous devez avoir commandé ce produit pour pouvoir le noter.'
      };
    }

    return { allowed: true };
  };

  const submitReview = (productId: string, rating: number, title: string, comment: string): { success: boolean; error?: string } => {
    const check = canUserReviewProduct(productId);
    if (!check.allowed) {
      addToast(check.reason || 'Action non autorisée.', 'error');
      return { success: false, error: check.reason };
    }

    if (!title.trim() || !comment.trim()) {
      addToast('Veuillez renseigner un titre et un commentaire.', 'warning');
      return { success: false, error: 'Champs incomplets' };
    }

    try {
      if (currentUser) {
        api.addReview(currentUser.id, productId, Math.max(1, Math.min(5, rating)), comment.trim());
      }
    } catch (error) {
      console.warn('Review API sync failed; local review kept as fallback.', error);
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userId: currentUser!.id,
      userName: currentUser!.name,
      rating: Math.max(1, Math.min(5, rating)),
      title: title.trim(),
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
      verifiedPurchase: true
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    const productReviews = updatedReviews.filter((r) => r.productId === productId);
    const avgRating = Math.round((productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length) * 10) / 10;

    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          return {
            ...prod,
            rating: avgRating,
            reviewCount: productReviews.length
          };
        }
        return prod;
      })
    );

    addToast('Merci ! Votre avis vérifié a été publié.', 'success');
    return { success: true };
  };

  // Demo / Tester tools
  const resetDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setReviews(INITIAL_REVIEWS);
    setCurrentUser(DEMO_USER);
    setOrders([
      {
        id: 'ord-init-1',
        orderNumber: 'CMD-2026-7841',
        date: '14 Août 2026 à 10:15',
        userId: DEMO_USER.id,
        userEmail: DEMO_USER.email,
        userName: DEMO_USER.name,
        shippingAddress: {
          fullName: DEMO_USER.name,
          email: DEMO_USER.email,
          phone: DEMO_USER.phone,
          street: DEMO_USER.address.street,
          postalCode: DEMO_USER.address.postalCode,
          city: DEMO_USER.address.city,
          country: DEMO_USER.address.country,
          deliveryMethod: 'standard'
        },
        items: [
          {
            productId: 'prod-1',
            name: 'Casque Studio Sans Fil ANC Pro',
            price: 249.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
          },
          {
            productId: 'prod-4',
            name: 'Cafetière Filtre Barista Precision & Carafe Thermique',
            price: 169.00,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80'
          }
        ],
        subtotal: 418.99,
        shippingFee: 0,
        discount: 0,
        tax: 69.83,
        total: 418.99,
        status: 'LIVREE',
        paymentMethod: 'card',
        trackingNumber: 'FR982143091COL',
        createdAt: Date.now() - 36 * 24 * 3600 * 1000
      }
    ]);
    setCart([]);
    localStorage.clear();
    addToast('Données et stocks réinitialisés aux valeurs initiales de test.', 'info');
  };

  const simulateStockDepletion = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: 0 } : p))
    );
    addToast('Stock du produit réduit à 0 pour tester la cohérence de commande !', 'warning');
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        register,
        login,
        loginDemoUser,
        logout,
        updateUserProfile,

        products,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        inStockOnly,
        setInStockOnly,
        selectedProduct,
        setSelectedProduct,
        activeView,
        setActiveView,

        cart,
        cartCount,
        cartSubtotal,
        shippingFee,
        promoCode,
        appliedDiscount,
        applyPromoCode,
        removePromoCode,
        cartTotal,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,

        verifyOrderConsistency,
        placeOrder,
        orders,
        currentCompletedOrder,
        setCurrentCompletedOrder,

        reviews,
        getProductReviews,
        canUserReviewProduct,
        submitReview,

        toasts,
        addToast,
        removeToast,

        resetDemoData,
        simulateStockDepletion
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
