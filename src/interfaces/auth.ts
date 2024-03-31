export interface User {
  id: number;
  email: string;
}

export interface JwtPayload extends User {
  signedAt: string;
}

export interface RefreshTokenPayload extends JwtPayload {
  refreshToken: string;
}
