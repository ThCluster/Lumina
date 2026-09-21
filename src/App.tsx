import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { CatalogView } from './components/CatalogView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrdersHistoryView } from './components/OrdersHistoryView';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { AuthModal } from './components/AuthModal';
import { AuthView } from './components/AuthView';
import { UserProfileModal } from './components/UserProfileModal';
import { ReviewModal } from './components/ReviewModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';
import { Product } from './types';

const MainAppContent: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    selectedProduct, 
    setSelectedProduct,
    currentCompletedOrder,
    setCurrentCompletedOrder
  } = useStore();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authDefaultMode, setAuthDefaultMode] = useState<'login' | 'register'>('register');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [reviewModalProduct, setReviewModalProduct] = useState<Product | null>(null);

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setActiveView('auth');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/70 text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onOpenAuth={() => handleOpenAuth('login')}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeView === 'auth' && <AuthView />}

        {(activeView === 'catalog' || activeView === 'product-detail') && (
          <CatalogView onOpenProductDetail={(prod) => setSelectedProduct(prod)} />
        )}

        {activeView === 'checkout' && (
          <CheckoutView
            onOrderSuccess={() => {
              // Order confirmation is opened automatically via currentCompletedOrder
            }}
          />
        )}

        {activeView === 'orders' && (
          <OrdersHistoryView
            onOpenProductReview={(prod) => setReviewModalProduct(prod)}
            onOpenAuth={() => handleOpenAuth('login')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
            if (activeView === 'product-detail') {
              setActiveView('catalog');
            }
          }}
          onOpenAuth={() => handleOpenAuth('login')}
        />
      )}

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Order Confirmation Celebration Modal */}
      {currentCompletedOrder && (
        <OrderConfirmationModal
          onClose={() => setCurrentCompletedOrder(null)}
          onOpenReviewForProduct={(productId) => {
            setCurrentCompletedOrder(null);
            // opened review modal
          }}
        />
      )}

      {/* Auth Modal (Requirement 1: Créer un compte & Connexion) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authDefaultMode}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Dedicated Review Modal (Requirement 9: Déposer un avis sur un produit acheté) */}
      {reviewModalProduct && (
        <ReviewModal
          product={reviewModalProduct}
          onClose={() => setReviewModalProduct(null)}
        />
      )}

      {/* Global Notifications Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
