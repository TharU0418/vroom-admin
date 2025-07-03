import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File } from 'formidable';
import fs from 'fs/promises'; // use promises version
import { dbConnect } from '@/lib/dbConnect';
import Driver from '../../../models/Driver';

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
      const drivers = await Driver.find().sort({ createdAt: -1 });
      return res.status(200).json(drivers);
    } catch (error) {
      console.error('Fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch cars' });
    }
  }

  if (req.method === 'POST') {
    const form = new IncomingForm({
      multiples: true,
      keepExtensions: true,
    });

    try {
      const { fields, files }: { fields: any; files: any } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) return reject(err);
          resolve({ fields, files });
        });
      });

      const uploadedFiles = Object.values(files).flat();
      if (uploadedFiles.length === 0) {
        return res.status(400).json({ error: 'At least one image is required' });
      }

      const images = await Promise.all(
        uploadedFiles.map(async (file: File) => {
          const data = await fs.readFile(file.filepath);
          return `data:${file.mimetype};base64,${data.toString('base64')}`;
        })
      );

      const newDriver = await Driver.create({
        fullname: toString(fields.fullname),
        email: toString(fields.email),
        contact: toString(fields.contact),
        experience: toString(fields.experience),
        star: toString(fields.star),
        description: toString(fields.description),
        images: images,
        tour_types: Array.isArray(fields.tour_types)
        ? fields.tour_types
        : [fields.tour_types].filter(Boolean), // ensures it's always an array
      });




      return res.status(201).json({ message: 'Driver created successfully', driver: newDriver });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ error: 'Server error while uploading car' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
