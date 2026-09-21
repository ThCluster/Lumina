import { Product, Review } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Casque Studio Sans Fil ANC Pro',
    tagline: 'Réduction de bruit active hybride et son spatial haute fidélité',
    brand: 'Acoustics Lab',
    category: 'Audio & Son',
    price: 249.99,
    originalPrice: 299.99,
    rating: 4.8,
    reviewCount: 38,
    stock: 7,
    initialStock: 10,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Une acoustique d’exception sculptée dans de l’aluminium anodisé et des coussinets à mémoire de forme en cuir végétal. Autonomie de 40 heures avec charge rapide USB-C.',
    features: [
      'Réduction active de bruit adaptative (ANC)',
      'Transducteurs titane 40 mm certifiés Hi-Res',
      'Autonomie 40 heures (charge 10 min = 5 heures)',
      'Connexion multipoint Bluetooth 5.3'
    ],
    badge: 'Bestseller'
  },
  {
    id: 'prod-2',
    name: 'Lampe de Bureau Minimaliste LumiTouch',
    tagline: 'Éclairage d’ambiance à variateur tactile et charge induction Qi',
    brand: 'Nordic Light',
    category: 'Maison & Déco',
    price: 89.00,
    originalPrice: 110.00,
    rating: 4.6,
    reviewCount: 19,
    stock: 4,
    initialStock: 8,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Conçue à Copenhague, cette lampe allie aluminium brossé et bois de chêne massif. Base lestée intégrant un chargeur sans fil 15W pour smartphone.',
    features: [
      'Variateur tactile d’intensité 10% - 100%',
      'Température de couleur réglable (2700K - 5000K)',
      'Socle avec charge rapide par induction 15W',
      'Design scandinave primé Red Dot 2025'
    ],
    badge: 'Stock Limité'
  },
  {
    id: 'prod-3',
    name: 'Clavier Mécanique Sans Fil Apex 75',
    tagline: 'Switches linéaires pré-lubrifiés et touches PBT double-shot',
    brand: 'Keycraft',
    category: 'Tech & Bureau',
    price: 139.50,
    rating: 4.9,
    reviewCount: 42,
    stock: 2,
    initialStock: 6,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Format compact 75% ergonomique idéal pour libérer de l’espace sur votre bureau. Molette en métal pour le contrôle du volume et triple connectivité.',
    features: [
      'Format 75% compact avec molette multimédia',
      'Switches Hot-Swap interchangeables à chaud',
      'Triple connectivité (2.4 GHz, Bluetooth 5.1, USB-C)',
      'Structure Gasket Mount insonorisée'
    ],
    badge: 'Derniers exemplaires'
  },
  {
    id: 'prod-4',
    name: 'Cafetière Filtre Barista Precision & Carafe Thermique',
    tagline: 'Extraction optimale certifiée SCA pour un café de spécialité',
    brand: 'Kaffebrew',
    category: 'Café & Barista',
    price: 169.00,
    originalPrice: 195.00,
    rating: 4.7,
    reviewCount: 25,
    stock: 5,
    initialStock: 8,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Température d’infusion rigoureusement maintenue entre 92°C et 96°C pour révéler toutes les notes aromatiques de vos grains. Carafe isotherme inox double paroi.',
    features: [
      'Tête de douchette à 9 trous pour saturation uniforme',
      'Résistance cuivre haute puissance 1450W',
      'Arrêt automatique et maintien au chaud',
      'Capacité 1 litre (8 tasses de dégustation)'
    ]
  },
  {
    id: 'prod-5',
    name: 'Sac à Dos Urbain Étanche Horizon 20L',
    tagline: 'Toile recyclée Cordura déperlante et compartiment PC 16"',
    brand: 'Atelier Nomad',
    category: 'Accessoires',
    price: 119.00,
    rating: 4.8,
    reviewCount: 31,
    stock: 9,
    initialStock: 12,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Conçu pour vos trajets quotidiens et escapades de week-end. Compartiment matelassé antichoc pour ordinateur portable jusqu’à 16 pouces et poches antivol.',
    features: [
      'Tissu technique imperméable 100% recyclé',
      'Compartiment renforcé pour ordinateur 16"',
      'Sangle de maintien sur valise trolley',
      'Fermetures éclair étanches YKK Aquaguard'
    ],
    badge: 'Nouveauté'
  },
  {
    id: 'prod-6',
    name: 'Enceinte Bluetooth Nomade TerraSound 360',
    tagline: 'Diffusion audio immersive à 360° et résistance totale à l’eau IP67',
    brand: 'Acoustics Lab',
    category: 'Audio & Son',
    price: 99.90,
    originalPrice: 129.00,
    rating: 4.5,
    reviewCount: 16,
    stock: 12,
    initialStock: 15,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Une clarté sonore bluffante avec deux radiateurs de basses passifs. Flotte sur l’eau, résiste à la poussière et aux chocs. 24h d’autonomie non-stop.',
    features: [
      'Son immersif 360 degrés avec basses profondes',
      'Certification IP67 (étanche à l’eau et poussière)',
      '24 heures de musique continue sur batterie',
      'Mode PartySync : jumelez jusqu’à 50 enceintes'
    ]
  },
  {
    id: 'prod-7',
    name: 'Moulins à Café Manuel Titane Précision 48mm',
    tagline: 'Meules coniques en acier inoxydable et réglage micrométrique',
    brand: 'Kaffebrew',
    category: 'Café & Barista',
    price: 79.00,
    rating: 4.9,
    reviewCount: 22,
    stock: 6,
    initialStock: 10,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Le compagnon parfait des amateurs d’espresso et de filtre. Corps monobloc en aluminium anodisé texturé anti-dérapant et double roulement à billes.',
    features: [
      'Meules coniques haute précision 48 mm',
      'Réglage externe avec 60 crans micrométriques',
      'Double roulement pour une stabilité axiale absolue',
      'Capacité réservoir : 35 g de grains de café'
    ]
  },
  {
    id: 'prod-8',
    name: 'Tapis de Bureau en Cuir Végétal Grand Format',
    tagline: 'Sous-main protecteur réversible et surface de glisse ultra-douce',
    brand: 'Atelier Nomad',
    category: 'Tech & Bureau',
    price: 45.00,
    rating: 4.6,
    reviewCount: 14,
    stock: 8,
    initialStock: 12,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Transformez votre espace de travail avec ce sous-main en cuir végétal haut de gamme. Résistant à l’eau, facile à nettoyer et doux sous les poignets.',
    features: [
      'Dimensions généreuses : 90 x 45 cm',
      'Surface imperméable et résistante aux rayures',
      'Glisse de souris optimisée et ultra-précise',
      'Finition bordure cousue main haute durabilité'
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userId: 'user-demo-1',
    userName: 'Sophie Fontaine',
    rating: 5,
    title: 'Une isolation acoustique bluffante !',
    comment: 'J’utilise ce casque tous les jours en open-space et en train. La réduction de bruit active est remarquable et le confort après 4h de port d’affilée est parfait. Finitions luxueuses.',
    createdAt: '2026-08-14T10:30:00Z',
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userId: 'user-demo-2',
    userName: 'Thomas Laurent',
    rating: 5,
    title: 'Qualité studio au rendez-vous',
    comment: 'Les basses sont nettes, les aigus jamais criards. L’application permet d’ajuster l’EQ finement. Vraiment au-dessus des références habituelles du marché.',
    createdAt: '2026-08-28T16:45:00Z',
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    productId: 'prod-3',
    userId: 'user-demo-3',
    userName: 'Julien Mercier',
    rating: 5,
    title: 'Le meilleur clavier mécanique que j’ai possédé',
    comment: 'Frappe onctueuse, son "thock" feutré grâce à la structure gasket. La molette de volume en aluminium est super agréable au quotidien. Reçu très rapidement.',
    createdAt: '2026-09-02T09:12:00Z',
    verifiedPurchase: true
  },
  {
    id: 'rev-4',
    productId: 'prod-4',
    userId: 'user-demo-1',
    userName: 'Sophie Fontaine',
    rating: 4,
    title: 'Café excellent et carafe très efficace',
    comment: 'La température d’extraction fait une vraie différence sur des grains d’Éthiopie. La carafe garde le café bien chaud toute la matinée sans le brûler.',
    createdAt: '2026-09-05T14:20:00Z',
    verifiedPurchase: true
  },
  {
    id: 'rev-5',
    productId: 'prod-2',
    userId: 'user-demo-4',
    userName: 'Clara Dubois',
    rating: 5,
    title: 'Objet magnifique sur mon bureau',
    comment: 'La charge induction sur le socle est ultra pratique. La lumière est douce et ne fatigue pas les yeux le soir en télétravail. Je recommande les yeux fermés.',
    createdAt: '2026-09-10T11:00:00Z',
    verifiedPurchase: true
  }
];

export const DEMO_USER = {
  id: 'user-demo-alexandre',
  name: 'Alexandre Martin',
  email: 'alexandre.martin@example.fr',
  phone: '06 12 34 56 78',
  address: {
    street: '14 Rue de la Paix',
    postalCode: '75002',
    city: 'Paris',
    country: 'France'
  },
  createdAt: '2026-07-01T08:00:00Z'
};
