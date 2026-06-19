function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "[AUTH] FATAL: JWT_SECRET environment variable is not set. " +
        "The application cannot start without it in production."
      );
    }
    // Dev-only fallback — loud warning so it's never missed
    console.warn(
      "\x1b[33m[AUTH WARNING]\x1b[0m JWT_SECRET is not set. Using an insecure dev-only " +
      "fallback. Set JWT_SECRET in .env.local before deploying."
    );
    return "dev_only_insecure_jwt_secret_DO_NOT_USE_IN_PRODUCTION";
  }
  return secret;
}

// Helper to convert base64url to string
function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
}

// Helper to convert string to base64url
function base64urlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Web Crypto HMAC SHA-256 Sign
async function hmacSign(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sigBuffer = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
  const sigBytes = new Uint8Array(sigBuffer);
  
  let binary = "";
  for (let i = 0; i < sigBytes.byteLength; i++) {
    binary += String.fromCharCode(sigBytes[i]);
  }
  
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Sign a payload to create a JWT
 */
export async function signJWT(
  payload: Record<string, any>,
  expiresInSeconds: number
): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + expiresInSeconds;
  const iat = now;

  const headerStr = base64urlEncode(JSON.stringify(header));
  const payloadStr = base64urlEncode(JSON.stringify({ ...payload, exp, iat }));
  const message = `${headerStr}.${payloadStr}`;

  const signature = await hmacSign(message, getJwtSecret());
  return `${message}.${signature}`;
}

/**
 * Verify a JWT and return the payload if valid, or null if invalid/expired
 */
export async function verifyJWT(token: string): Promise<Record<string, any> | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    const [headerStr, payloadStr, signature] = parts;
    const message = `${headerStr}.${payloadStr}`;
    
    const expectedSignature = await hmacSign(message, getJwtSecret());
    if (signature !== expectedSignature) return null;
    
    const decodedPayload = JSON.parse(base64urlDecode(payloadStr));
    
    // Check expiration
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return decodedPayload;
  } catch {
    return null;
  }
}
