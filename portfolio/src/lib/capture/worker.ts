import prisma from "@/lib/prisma";
import { capture } from "@/lib/capture";
import { previewShots } from "@/lib/storage";

/**
 * Worker de capture in-process, concurrence 1.
 * La base de données EST la file : on "claim" atomiquement la prochaine cible
 * PENDING (FOR UPDATE SKIP LOCKED), on la traite, on écrit CACHED/FAILED.
 * Aucune promesse détachée : toute erreur est catchée dans la boucle.
 */

let started = false;
const IDLE_MS = 1500;

type Claimed = { id: string; url: string; slug: string };

async function claimNext(): Promise<Claimed | null> {
  const rows = await prisma.$queryRawUnsafe<Claimed[]>(`
    UPDATE "Target" SET status = 'CAPTURING'::"CaptureStatus"
    WHERE id = (
      SELECT id FROM "Target"
      WHERE status = 'PENDING'::"CaptureStatus"
      ORDER BY "createdAt" ASC
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    )
    RETURNING id, url, slug
  `);
  return rows[0] ?? null;
}

async function processOne(job: Claimed): Promise<void> {
  try {
    await capture(job.url, job.slug);
    await prisma.target.update({
      where: { id: job.id },
      data: {
        status: "CACHED",
        capturedAt: new Date(),
        ...previewShots(job.slug),
      },
    });
    console.log(`[worker] CACHED ${job.slug}`);
  } catch (err) {
    console.error(`[worker] CAPTURE FAILED ${job.slug}:`, err);
    await prisma.target
      .update({ where: { id: job.id }, data: { status: "FAILED" } })
      .catch(() => {});
  }
}

async function loop(): Promise<void> {
  for (;;) {
    let job: Claimed | null = null;
    try {
      job = await claimNext();
    } catch (err) {
      console.error("[worker] erreur de claim:", err);
    }
    if (!job) {
      await new Promise((r) => setTimeout(r, IDLE_MS));
      continue;
    }
    await processOne(job);
  }
}

/** Repasse en PENDING les captures interrompues par un restart. */
export async function recoverOrphans(): Promise<void> {
  const n = await prisma.$executeRawUnsafe(`
    UPDATE "Target" SET status = 'PENDING'::"CaptureStatus"
    WHERE status = 'CAPTURING'::"CaptureStatus"
  `);
  if (n) console.log(`[worker] recovery: ${n} capture(s) orpheline(s) → PENDING`);
}

export function startWorker(): void {
  if (started) return;
  started = true;
  console.log("[worker] démarrage (concurrence 1)");
  void loop();
}
