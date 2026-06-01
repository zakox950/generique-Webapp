-- Migration 001 — Ajout de la colonne prete sur commandedirect
-- À exécuter une seule fois sur la base de données existante.

ALTER TABLE commandedirect
  ADD COLUMN IF NOT EXISTS prete BOOLEAN NOT NULL DEFAULT FALSE;
