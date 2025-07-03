import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/dbConnect';
import Car from '@/models/Car';

export const config = {
  api: {
    bodyParser: false, // Required for formidable
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await dbConnect();

  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), '/uploads'),
    keepExtensions: true,
    multiples: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Error parsing form data' });

    try {
      const images = Array.isArray(files.images)
        ? files.images.map((file) => path.basename(file.filepath))
        : [path.basename((files.images as any)?.filepath)];

      const car = await Car.create({
        ...fields,
        mileage: Number(fields.mileage),
        engine_capacity: Number(fields.engine_capacity),
        price: Number(fields.price),
        images,
      });

      res.status(201).json({ message: 'Car listing created!', car });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to save car listing' });
    }
  });
}
