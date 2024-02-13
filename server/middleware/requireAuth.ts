import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

interface AuthRequest extends Request {
  user?: { _id: string };
}

const jwtSecret: string = process.env.JWT_SECRET || '';

const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Unauthorized Access' });
  }

  const token = authorization.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, jwtSecret) as { _id: string };
    const { _id } = decodedToken;
    req.user = await User.findOne({ _id }).select('_id');
    next();
  } catch (error: any) {
    console.error('JWT Verification Error:', error.message);
    res.status(401).json({ error: 'Unauthorized Access - Invalid Token' });
  }
};

export default requireAuth;
