// pages/api/users/index.ts
//import { dbConnect } from '@/lib/dbConnect';
import type { NextApiRequest, NextApiResponse } from 'next';
//import User from '../../../models/User';




export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  //await dbConnect();


  if (req.method === 'GET') {
    try {
    //  const users = await User.find({}, 'firstName lastName email mobileNumber location'); // Select only needed fields
     // res.status(200).json(users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      res.status(500).json({ message: 'Server error while fetching users' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
