
import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File } from 'formidable';
import fs from 'fs/promises'; // use promises version
import { dbConnect } from '@/lib/dbConnect';
import Rentrequests from '../../../models/rentrequests';

export const config = {
  api: {
    bodyParser: false,
  },
};

const toString = (val: any) => Array.isArray(val) ? val[0] : val;
const toNumber = (val: any) => Number(toString(val));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const rentrequests = await Rentrequests.find().sort({ createdAt: -1 });
      return res.status(200).json(rentrequests);
    } catch (error) {
      console.error('Fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch rent requests' });
    }
  }

  if (req.method === 'PATCH') {
  try {
    const { id, availability, star, reason } = req.body;

    if (!id || !availability) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updated = await Rentrequests.findByIdAndUpdate(id, {
      availability,
      ...(star !== undefined && { star }),
      ...(reason !== undefined && { reason }),
    }, { new: true });

    if (!updated) {
      return res.status(404).json({ error: 'Rent request not found' });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({ error: 'Failed to update rent request' });
  }
}


  

  return res.status(405).json({ message: 'Method not allowed' });
}
