/** Cible telle qu'exposée par l'API publique /api/targets (CACHED uniquement). */
export interface PublicTarget {
  id: string;
  title: string;
  url: string;
  slug: string;
  desktopShot: string | null;
  mobileShot: string | null;
  capturedAt: string | null;
  tags: string[];
  description: string | null;
  order: number;
}
