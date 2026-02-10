import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../utils/error'
import { verifyJWT } from '../utils/jwt';
import { UpdatedJWTPayload } from '../types/jwt';

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new UnauthorizedError('Invalid Token')
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    throw new UnauthorizedError('Invalid Token')
  }

  try {
    const decoded = verifyJWT(token) as UpdatedJWTPayload
    if (decoded) {
      req.userId = decoded.userId
      req.username = decoded.username
      next()
      return;
    }
    throw new UnauthorizedError('Invalid token')
  } catch {
    throw new UnauthorizedError('Invalid Token')
  }
}
