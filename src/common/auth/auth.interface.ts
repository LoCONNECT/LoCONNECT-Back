import { Request } from 'express';

export interface JwtPayload {
  id: number;
  role: string;
  acceptStatus: string;
}

export interface AuthRequest extends Request {
  user: JwtPayload;
}
