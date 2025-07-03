import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/dbConnect';
import Rentrequests from '../../../../models/rentrequests';
import Car from '../../../../models/Car';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'PATCH') {
    const { id } = req.query;
    const { status, star, reason, pickupDate, returnDate } = req.body;

    if (!id || !status || !pickupDate || !returnDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // 1. Update rent request
      const updated = await Rentrequests.findByIdAndUpdate(
        id,
        {
          status,
          ...(star !== undefined && { star }),
          ...(reason !== undefined && { reason }),
          pickupDate,
          returnDate
        },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ error: 'Rent request not found' });
      }

      // 2. Get the car using carId from rent request
      const car = await Car.findById(updated.carId);
      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }

      // 3. Push booking dates to the car
      car.bookedDates.push({
        startDate: new Date(pickupDate),
        endDate: new Date(returnDate)
      });

      await car.save();

      return res.status(200).json(updated);
    } catch (error) {
      console.error('Update error:', error);
      return res.status(500).json({ error: 'Failed to update rent request' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
