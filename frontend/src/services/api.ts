const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Erreur API');
  }

  return response.json() as Promise<T>;
}

export const api = {
  getProducts: () => request<any[]>('/api/produits'),
  searchProducts: (query: string) =>
    request<any[]>('/api/produits/rechercher', {
      method: 'POST',
      body: JSON.stringify({ recherche: query }),
    }),
  login: (email: string, mot_de_passe: string) =>
    request<any>('/api/utilisateurs/connexion', {
      method: 'POST',
      body: JSON.stringify({ email, mot_de_passe }),
    }),
  register: (email: string, mot_de_passe: string, nom = '') =>
    request<any>('/api/utilisateurs/creer-compte', {
      method: 'POST',
      body: JSON.stringify({ email, mot_de_passe, nom }),
    }),
  getCart: (userId: string) => request<any>(`/api/paniers/${userId}`),
  addToCart: (userId: string, produitId: string, quantite = 1) =>
    request<any>('/api/paniers/ajouter', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, produit_id: produitId, quantite }),
    }),
  placeOrder: (userId: string, adresse_livraison = '') =>
    request<any>('/api/commandes', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, adresse_livraison }),
    }),
  getOrders: (userId: string) => request<any>(`/api/commandes/${userId}`),
  addReview: (userId: string, produitId: string, note: number, commentaire = '') =>
    request<any>('/api/avis', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, produit_id: produitId, note, commentaire }),
    }),
};

export default api;
