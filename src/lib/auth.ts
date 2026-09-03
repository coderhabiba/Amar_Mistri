import jwt from 'jsonwebtoken';

const JWT_SECRET =
  process.env.JWT_SECRET ||
  '8ae3aaf447a4acf515652ff2aebc627546a15e0134f4d94c6459307a3ff650f873407df1c6120d2f3dba1da065da1f228f985335557fe1c2a7e46354083f0d88';

export interface TokenPayload {
  role?: string;
  email?: string;
  id?: string;
  phone?: string;
  mistriId?: string;
  [key: string]: any;
}

export function signToken(payload: TokenPayload, expiresIn: string = '30d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as any);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}
