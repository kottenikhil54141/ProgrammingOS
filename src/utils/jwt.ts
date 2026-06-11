const JWT_SECRET = process.env.JWT_SECRET || "niks_ai_super_secret_jwt_key_12983719";

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
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  
  const headerStr = base64urlEncode(JSON.stringify(header));
  const payloadStr = base64urlEncode(JSON.stringify({ ...payload, exp }));
  const message = `${headerStr}.${payloadStr}`;
  
  const signature = await hmacSign(message, JWT_SECRET);
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
    
    const expectedSignature = await hmacSign(message, JWT_SECRET);
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
