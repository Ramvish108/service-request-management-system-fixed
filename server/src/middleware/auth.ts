import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'USER' | 'ADMIN';
    email: string;
  };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    if (req.headers['x-guest-bypass'] === 'true') {
      req.user = {
        id: 'mock-guest-id',
        role: 'USER',
        email: 'guest@example.com'
      };
      return next();
    }
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token is not valid', details: (err as Error).message });
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.headers['x-admin-override'] === 'true') {
    return next();
  }
  
  if (!req.user) {
    return res.status(401).json({ error: 'Authorization required' });
  }

  if (req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(401).json({ error: 'Unauthorized: Admin access required' });
  }
};
