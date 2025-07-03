import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/dbConnect';
import Sell from '../../../../models/Sell';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') return res.status(405).end('Method Not Allowed');

  await dbConnect();

  const { id } = req.query;

  const form = new IncomingForm({ multiples: true, keepExtensions: true, uploadDir: './public/uploads' });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Error parsing form data' });

    const uploadedFiles = Array.isArray(files.images) ? files.images : [files.images];
    if (uploadedFiles.length > 5) {
      return res.status(400).json({ error: 'Maximum of 5 images allowed' });
    }

    // Create accessible image URLs
    const imageUrls = uploadedFiles.map((file: any) => {
      const relativePath = `/uploads/${path.basename(file.filepath)}`;
      return relativePath;
    });

    try {
      const car = await Sell.findByIdAndUpdate(id, { images: imageUrls }, { new: true });
      return res.status(200).json({ message: 'Images updated', car });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update car images' });
    }
  });
}