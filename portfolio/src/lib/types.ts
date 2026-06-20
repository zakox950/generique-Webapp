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

export type CaptureStatus = "PENDING" | "CAPTURING" | "CACHED" | "FAILED";

/** Cible telle qu'exposée par l'API admin /api/admin/targets (tous statuts). */
export interface AdminTarget {
  id: string;
  title: string;
  url: string;
  slug: string;
  desktopShot: string | null;
  mobileShot: string | null;
  status: CaptureStatus;
  capturedAt: string | null;
  order: number;
  tags: string[];
  description: string | null;
  createdAt: string;
}
