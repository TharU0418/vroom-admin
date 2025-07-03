// /pages/api/current-user.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import User from '../../models/user';
import { dbConnect } from '@/lib/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    await dbConnect();

    const user = await User.findById(decoded.userId).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      location: user.location,
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
