import React, { useState } from 'react';
import { X, UserPlus, LogIn, CheckCircle2, ShieldCheck, Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'register'
}) => {
  const { register, login } = useStore();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regStreet, setRegStreet] = useState('');
  const [regPostalCode, setRegPostalCode] = useState('');
  const [regCity, setRegCity] = useState('');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await register(
      regName,
      regEmail,
      regPassword,
      {
        street: regStreet || '12 Avenue des Champs-Élysées',
        postalCode: regPostalCode || '75008',
        city: regCity || 'Paris',
        country: 'France'
      },
      regPhone
    );
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(loginEmail, loginPassword);
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-sm sm:max-w-md w-full shadow-2xl overflow-hidden border border-neutral-200 my-auto p-4 sm:p-6 space-y-3.5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 pt-1">
          <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center mx-auto shadow-sm">
            {mode === 'register' ? (
              <UserPlus className="w-4 h-4" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-neutral-900">
            {mode === 'register' ? 'Créer un compte client' : 'Connexion à votre espace'}
          </h2>
          <p className="text-[11px] text-neutral-500 leading-tight">
            {mode === 'register'
              ? 'Accédez au suivi de vos colis et déposez des avis certifiés.'
              : 'Retrouvez votre historique de commandes et vos adresses.'}
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex rounded-xl bg-neutral-100 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-1.5 rounded-lg transition-all text-xs ${
              mode === 'register'
                ? 'bg-white text-neutral-900 shadow-xs font-bold'
                : 'text-neutral-500 hover:text-neutral-800 font-medium'
            }`}
          >
            Créer un compte
          </button>
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-1.5 rounded-lg transition-all text-xs ${
              mode === 'login'
                ? 'bg-white text-neutral-900 shadow-xs font-bold'
                : 'text-neutral-500 hover:text-neutral-800 font-medium'
            }`}
          >
            Se connecter
          </button>
        </div>

        {/* Mode: Registration Form */}
        {mode === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-2.5 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1 text-[11px]">
                Nom complet *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Camille Bernard"
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
                />
                <User className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1 text-[11px]">
                Adresse email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="camille@exemple.fr"
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
                />
                <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1 text-[11px]">
                Mot de passe *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
                />
                <Lock className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1 text-[11px]">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="06 12 34 56 78"
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1 text-[11px]">
                  Ville
                </label>
                <input
                  type="text"
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  placeholder="Paris, Lyon..."
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
                />
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-transform active:scale-98 flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Créer mon compte Lumina</span>
              </button>
            </div>
          </form>
        ) : (
          /* Mode: Login Form */
          <form onSubmit={handleLogin} className="space-y-2.5 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1 text-[11px]">
                Adresse email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="alexandre.martin@example.fr"
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
                />
                <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1 text-[11px]">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
                />
                <Lock className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-transform active:scale-98 flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Se connecter</span>
              </button>
            </div>
          </form>
        )}

        <div className="text-center pt-1 text-[10px] text-neutral-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Données protégées et stockées en conformité RGPD</span>
        </div>
      </div>
    </div>
  );
};
