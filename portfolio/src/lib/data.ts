export interface Service {
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    title: "Sites & Landing",
    description: "Sites vitrines et landing pages animés, pensés pour convertir et marquer les esprits.",
  },
  {
    title: "Applications Web",
    description: "Applications Next.js performantes, architectures modernes, scalables et maintenables.",
  },
  {
    title: "Design UI/UX",
    description: "Interfaces soignées et accessibles — chaque pixel au service de l'expérience.",
  },
  {
    title: "Backend & API",
    description: "APIs robustes, bases de données optimisées, authentification et intégrations tierces.",
  },
  {
    title: "DevOps & Deploy",
    description: "CI/CD, Docker, déploiement VPS ou cloud, monitoring et mise à l'échelle.",
  },
];

export const stack = [
  "Next.js", "React", "TypeScript", "Node.js",
  "PostgreSQL", "Prisma", "Docker", "Framer Motion",
];
