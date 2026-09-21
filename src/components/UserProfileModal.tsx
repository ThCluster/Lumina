import React, { useState } from 'react';
import { X, User, MapPin, Phone, Mail, Package, Star, Save, LogOut } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile, logout, orders, reviews, setActiveView } = useStore();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [street, setStreet] = useState(currentUser?.address?.street || '');
  const [postalCode, setPostalCode] = useState(currentUser?.address?.postalCode || '');
  const [city, setCity] = useState(currentUser?.address?.city || '');

  if (!isOpen || !currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      address: {
        street,
        postalCode,
        city,
        country: currentUser.address?.country || 'France'
      }
    });
    onClose();
  };

  const userOrdersCount = orders.filter(
    (o) => o.userId === currentUser.id || o.userEmail.toLowerCase() === currentUser.email.toLowerCase()
  ).length;

  const userReviewsCount = reviews.filter((r) => r.userId === currentUser.id).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 sm:p-8 space-y-6 border border-neutral-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* User Card Header */}
        <div className="flex items-center gap-4 border-b border-neutral-100 pb-5">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center text-xl font-bold">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">{currentUser.name}</h2>
            <p className="text-xs text-neutral-500">{currentUser.email}</p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-600">
              <span className="flex items-center gap-1 font-semibold">
                <Package className="w-3.5 h-3.5 text-neutral-400" />
                {userOrdersCount} commande{userOrdersCount > 1 ? 's' : ''}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {userReviewsCount} avis déposé{userReviewsCount > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
            Informations personnelles &amp; Adresse
          </h3>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Nom complet
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Rue et numéro
            </label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Code postal
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Ville
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Se déconnecter</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold flex items-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
