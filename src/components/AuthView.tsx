import React, { useState } from 'react';
import { 
  UserPlus, 
  LogIn, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight,
  Package,
  Star,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AuthView: React.FC = () => {
  const { register, login, setActiveView } = useStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regStreet, setRegStreet] = useState('');
  const [regPostalCode, setRegPostalCode] = useState('');
  const [regCity, setRegCity] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setActiveView('catalog');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(loginEmail, loginPassword);
    setIsSubmitting(false);
    if (success) {
      setActiveView('catalog');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 px-4 sm:px-6">
      {/* Brand Hero Welcome */}
      <div className="text-center space-y-2 mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Boutique officielle Lumina • E-Commerce Certifié</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
          Bienvenue sur Lumina
        </h1>

        <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto">
          Connectez-vous ou créez votre compte client pour commander, suivre vos livraisons et déposer vos avis vérifiés.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Guarantees & Guest option */}
        <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs space-y-3.5">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Pourquoi créer un compte Lumina ?
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-neutral-900 block text-xs">Stocks synchronisés en direct</span>
                  <span className="text-[11px] text-neutral-500">Mise à jour instantanée des stocks lors de votre commande.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-neutral-900 block text-xs">Suivi &amp; Historique Colissimo</span>
                  <span className="text-[11px] text-neutral-500">Consultez l'historique complet et téléchargez vos factures.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-neutral-900 block text-xs">Avis certifiés réservés aux acheteurs</span>
                  <span className="text-[11px] text-neutral-500">Partagez votre avis vérifié après réception de vos articles.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick guest exploration button */}
          <div className="bg-neutral-900 text-white rounded-2xl p-5 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-neutral-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Visiteur libre</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Vous souhaitez d'abord découvrir nos articles et tester le panier sans créer de compte ?
            </p>
            <button
              type="button"
              onClick={() => setActiveView('catalog')}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-xs"
            >
              <span>Explorer le catalogue en tant qu'invité</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Side: The Auth Card (Login & Register) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 shadow-lg p-5 sm:p-7 space-y-4 order-1 lg:order-2">
          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-neutral-100 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Créer un compte
            </button>
          </div>

          {/* Form: LOGIN */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3 text-xs">
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
                    placeholder="vous@exemple.fr"
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
                  <span>Se connecter à mon compte</span>
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-[11px] text-neutral-500 hover:text-neutral-900 underline"
                >
                  Pas encore de compte ? Créer un compte client
                </button>
              </div>
            </form>
          ) : (
            /* Form: REGISTER (Exigence 1: Créer un compte) */
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1 text-[11px]">
                  Nom et prénom *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ex: Camille Bernard"
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
                    placeholder="camille.bernard@example.fr"
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
                    Ville de livraison
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

              <div>
                <label className="block font-semibold text-neutral-700 mb-1 text-[11px]">
                  Adresse de livraison (Rue)
                </label>
                <input
                  type="text"
                  value={regStreet}
                  onChange={(e) => setRegStreet(e.target.value)}
                  placeholder="12 Avenue des Champs-Élysées"
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
                />
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

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[11px] text-neutral-500 hover:text-neutral-900 underline"
                >
                  Déjà client ? Se connecter
                </button>
              </div>
            </form>
          )}

          <div className="text-center pt-1 text-[10px] text-neutral-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Données confidentielles et sécurisées</span>
          </div>
        </div>
      </div>
    </div>
  );
};
