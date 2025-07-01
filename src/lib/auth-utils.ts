import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
const TOKEN_EXPIRY = '24h'; // Token expires in 24 hours

export async function generateDownloadToken(resourceId: string) {
  return await new SignJWT({ resourceId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyDownloadToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { valid: true, resourceId: payload.resourceId };
  } catch (error) {
    return { valid: false, error: 'Invalid or expired token' };
  }
}
