// admin/lib/tokens.ts
import crypto from "crypto";

const SECRET =
  process.env.UNSUBSCRIBE_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "dev-secret-change-me";
const ALGO = "sha256";

function base64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function createSignedToken(payload: {
  email: string;
  expSeconds?: number;
}) {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (payload.expSeconds ?? 60 * 60 * 24 * 30);
  const body = { email: payload.email, iat: now, exp };
  const payloadB64 = base64url(JSON.stringify(body));
  const toSign = `${header}.${payloadB64}`;
  const sig = crypto.createHmac(ALGO, SECRET).update(toSign).digest("base64");
  const sigB64url = sig
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `${toSign}.${sigB64url}`;
}

export function verifySignedToken(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, payloadB64, sigB64url] = parts;
    const toSign = `${header}.${payloadB64}`;
    const expectedSig = crypto
      .createHmac(ALGO, SECRET)
      .update(toSign)
      .digest("base64");
    const expectedSigB64url = expectedSig
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    const a = Buffer.from(sigB64url);
    const b = Buffer.from(expectedSigB64url);
    if (a.length !== b.length) return null;
    if (!crypto.timingSafeEqual(a, b)) return null;
    const payloadJson = Buffer.from(payloadB64, "base64").toString("utf8");
    const payload = JSON.parse(payloadJson) as {
      email: string;
      iat: number;
      exp: number;
    };
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) return null;
    return payload;
  } catch (err) {
    return null;
  }
}
