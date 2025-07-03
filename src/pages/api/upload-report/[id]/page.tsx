import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/dbConnect';
import Sell from '../../../../models/Sell'; // 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') return res.status(405).end('Method Not Allowed');

  await dbConnect();

  const { id } = req.query;
  const { report } = req.body;

  if (!report || typeof report !== 'string') {
    return res.status(400).json({ error: 'Invalid report value' });
  }

  try {
    const updatedCar = await Sell.findByIdAndUpdate(id, { report }, { new: true });
    if (!updatedCar) {
      return res.status(404).json({ error: 'Car not found' });
    }
    return res.status(200).json({ message: 'Report updated', car: updatedCar });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update car report' });
  }
}
