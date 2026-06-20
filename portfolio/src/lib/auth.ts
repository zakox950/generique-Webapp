/**
 * Gate admin mono-utilisateur, sans next-auth.
 * Cookie HTTP-only `spyfie_session` = payload signé HMAC-SHA256 (Web Crypto),
 * donc vérifiable dans le middleware edge. Le payload porte un `exp` : un
 * cookie expiré est rejeté (pas de session à vie).
 */

export const SESSION_COOKIE = "spyfie_session";
const DEFAULT_TTL_MS = 1000 * 60 * 60 * 12; // 12h

function secret(): string {
  return process.env.SESSION_SECRET || "";
}

function b64urlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): Uint8Array {
  const norm = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(norm);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmac(data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return new Uint8Array(sig);
}

/** Comparaison à temps constant (longueur égale requise). */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function createSessionToken(ttlMs = DEFAULT_TTL_MS): Promise<string> {
  const payload = { exp: Date.now() + ttlMs };
  const payloadB64 = b64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = b64urlEncode(await hmac(payloadB64));
  return `${payloadB64}.${sig}`;
}

export async function verifySessionToken(token?: string | null): Promise<boolean> {
  if (!token || !secret()) return false;
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return false;

  const expected = b64urlEncode(await hmac(payloadB64));
  if (!timingSafeEqual(sig, expected)) return false;

  try {
    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(payloadB64)));
    return typeof payload.exp === "number" && Date.now() < payload.exp;
  } catch {
    return false;
  }
}

/** Vérifie le mot de passe admin (env), à temps constant. */
export function checkPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD || "";
  if (!pw) return false;
  return timingSafeEqual(input, pw);
}

export const SESSION_TTL_MS = DEFAULT_TTL_MS;
