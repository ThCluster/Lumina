import React, { useState } from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones, ArrowRight, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { addToast } = useStore();

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      addToast('Merci pour votre inscription à notre lettre d’information !', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-neutral-900 text-neutral-400 text-xs border-t border-neutral-800">
      {/* Guarantees bar */}
      <div className="border-b border-neutral-800/80 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 text-white flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Expédition 24/48h</h4>
              <p className="text-[11px] text-neutral-500">Colissimo &amp; Chronopost sécurisé</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Stocks synchronisés</h4>
              <p className="text-[11px] text-neutral-500">Cohérence de commande certifiée</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 text-white flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Retours 30 jours</h4>
              <p className="text-[11px] text-neutral-500">Remboursement intégral garanti</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 text-white flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Atelier &amp; Conseil</h4>
              <p className="text-[11px] text-neutral-500">Support réactif 6j/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white text-neutral-900 flex items-center justify-center font-black text-sm">
              L
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">LUMINA</span>
          </div>
          <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
            Boutique d'objets soigneusement conçus pour élever votre quotidien. Système d'inventaire atomique garantissant la cohérence et l'authenticité de chaque achat.
          </p>
          <div className="pt-2">
            <form onSubmit={handleNewsletter} className="flex max-w-xs gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="bg-neutral-800 border border-neutral-700 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-neutral-500 flex-1"
              />
              <button
                type="submit"
                className="bg-white hover:bg-neutral-200 text-neutral-900 font-bold px-3 py-2 rounded-xl transition-colors shrink-0"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
            Navigation
          </h4>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-white transition-colors cursor-pointer">Audio &amp; Son haute fidélité</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Claviers &amp; Ergonomie</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Café de spécialité &amp; Barista</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Maroquinerie &amp; Sacs urbains</span></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
            Engagements Lumina
          </h4>
          <ul className="space-y-2 text-xs">
            <li><span className="text-emerald-400">✓ Stocks vérifiés en direct</span></li>
            <li><span>✓ Décrémentation automatique</span></li>
            <li><span>✓ Avis 100% réservés aux acheteurs</span></li>
            <li><span>✓ Facturation conforme TTC/HT</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-800/80 py-6 px-4 text-center text-[11px] text-neutral-500">
        <p>© 2026 Lumina E-Commerce. Conçu avec React, TypeScript, Tailwind CSS et Vite.</p>
      </div>
    </footer>
  );
};
