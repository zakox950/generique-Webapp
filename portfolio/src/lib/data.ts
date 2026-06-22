export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  url?: string;
  github?: string;
  featured?: boolean;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "La Françoise",
    description: "Site vitrine moderne pour un restaurant gastronomique. Réservation en ligne, menu dynamique, galerie photo immersive.",
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    image: "/projects/lafrancoise.jpg",
    url: "https://lafrancoise.fr",
    featured: true,
  },
  {
    id: "2",
    title: "Pâtisserie Artisanale",
    description: "Boutique e-commerce avec gestion des commandes, paiement en ligne et tableau de bord admin pour une pâtisserie.",
    tags: ["Next.js", "Stripe", "Prisma", "Docker"],
    image: "/projects/patisserie.jpg",
    url: "https://patisserie-demo.fr",
    featured: true,
  },
  {
    id: "3",
    title: "Dashboard Analytics",
    description: "Interface de visualisation de données en temps réel avec graphiques interactifs et rapports automatisés.",
    tags: ["React", "D3.js", "Node.js", "WebSocket"],
    image: "/projects/dashboard.jpg",
    featured: true,
  },
  {
    id: "4",
    title: "App Mobile Fitness",
    description: "Application de suivi d'entraînement avec plans personnalisés, tracking GPS et communauté intégrée.",
    tags: ["React Native", "TypeScript", "Firebase"],
    image: "/projects/fitness.jpg",
  },
  {
    id: "5",
    title: "Plateforme SaaS RH",
    description: "Solution complète de gestion des ressources humaines : congés, paie, entretiens, onboarding.",
    tags: ["Next.js", "tRPC", "Prisma", "Tailwind"],
    image: "/projects/saas.jpg",
  },
  {
    id: "6",
    title: "Site Vitrine Architecte",
    description: "Portfolio immersif pour un cabinet d'architecture avec galerie 3D et présentation de projets en plein écran.",
    tags: ["Next.js", "Three.js", "GSAP", "Vercel"],
    image: "/projects/archi.jpg",
  },
];

export const services: Service[] = [
  {
    icon: "⬡",
    title: "Développement Web",
    description: "Applications Next.js performantes, SEO-optimisées, avec des architectures modernes et scalables.",
  },
  {
    icon: "◈",
    title: "Design UI/UX",
    description: "Interfaces soignées, accessibles et converties — chaque pixel au service de l'expérience utilisateur.",
  },
  {
    icon: "◎",
    title: "API & Backend",
    description: "APIs robustes, bases de données optimisées, authentification sécurisée et intégrations tierces.",
  },
  {
    icon: "⬙",
    title: "DevOps & Deploy",
    description: "CI/CD, Docker, déploiement sur VPS ou cloud, monitoring et scalabilité garantis.",
  },
];

export const stack = [
  "Next.js", "React", "TypeScript", "Node.js",
  "PostgreSQL", "Prisma", "Docker", "Tailwind CSS",
  "Three.js", "Framer Motion", "Vercel", "Stripe",
];
