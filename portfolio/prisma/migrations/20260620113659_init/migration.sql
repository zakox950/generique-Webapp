-- CreateEnum
CREATE TYPE "CaptureStatus" AS ENUM ('PENDING', 'CAPTURING', 'CACHED', 'FAILED');

-- CreateTable
CREATE TABLE "Target" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "desktopShot" TEXT,
    "mobileShot" TEXT,
    "status" "CaptureStatus" NOT NULL DEFAULT 'PENDING',
    "capturedAt" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[],
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Target_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Target_slug_key" ON "Target"("slug");

-- CreateIndex
CREATE INDEX "Target_status_idx" ON "Target"("status");

-- CreateIndex
CREATE INDEX "Target_order_idx" ON "Target"("order");
