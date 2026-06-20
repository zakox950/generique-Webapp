/**
 * Démarrage unique au boot du serveur Node : recovery des captures orphelines
 * puis lancement du worker de capture. Ne s'exécute que dans le runtime nodejs
 * (jamais en edge — Playwright/Prisma sont node-only).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { recoverOrphans, startWorker } = await import("@/lib/capture/worker");
  await recoverOrphans();
  startWorker();
}
