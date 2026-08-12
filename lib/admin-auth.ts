export const ADMIN_COOKIE = "recoveryflow_admin_session";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 12;

const encoder = new TextEncoder();

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) throw new Error("ADMIN_SESSION_SECRET is not configured");
  return value;
}

async function signingKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function encode(bytes: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function decode(value: string) {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

async function sign(value: string) {
  return encode(await crypto.subtle.sign("HMAC", await signingKey(), encoder.encode(value)));
}

export async function createAdminSession() {
  const expires = Date.now() + ADMIN_SESSION_SECONDS * 1000;
  const payload = `v1.${expires}`;
  return `${payload}.${await sign(payload)}`;
}

export async function verifyAdminSession(token?: string) {
  if (!token) return false;
  const [version, expiresValue, signature] = token.split(".");
  if (version !== "v1" || !expiresValue || !signature) return false;
  const expires = Number(expiresValue);
  if (!Number.isFinite(expires) || expires <= Date.now()) return false;
  try {
    return await crypto.subtle.verify(
      "HMAC",
      await signingKey(),
      decode(signature),
      encoder.encode(`${version}.${expiresValue}`),
    );
  } catch {
    return false;
  }
}

export async function verifyAdminPassword(candidate: unknown) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || typeof candidate !== "string") return false;
  const signature = await sign(`password:${password}`);
  return crypto.subtle.verify(
    "HMAC",
    await signingKey(),
    decode(signature),
    encoder.encode(`password:${candidate}`),
  );
}
