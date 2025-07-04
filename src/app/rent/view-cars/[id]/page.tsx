// app/car/[id]/page.tsx

import mongoose from 'mongoose';
import { notFound } from 'next/navigation';
import ImageSlider from '@/components/ImageSlider';
import ViewCarForm from './ViewCarForm';
// import ImageSlider from '@/app/components/asserts/imageSlider';

interface CarDetailProps {
  params: {
    id: string;
  };
}

interface Car {
  id: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  images: string[];
  location?: string;
  description?: string;
    status?: string;

}

export default async function CarDetail({ params }: CarDetailProps) {
  await mongoose.connect(process.env.MONGODB_URI!);

 const car = await Car.findById(params.id).lean();

 //const car = {}

  if (!car) return notFound();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#FD1D1D] to-[#FCB045] p-4"> 
      <div className="glass-container bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg border border-white border-opacity-20 max-w-6xl w-full mx-4 p-8 mt-20 justify-center ">
        <h1 className="text-4xl font-bold mb-4 text-center text-black">{car.brand} {car.model}</h1>
        
        {/* Image slider with centered alignment */}
        <ImageSlider images={car.images} />

        <ul className="space-y-4 text-l text-white">
          <li><strong>Type:</strong> {car.type}</li>
          <li><strong>Year:</strong> {car.year}</li>
          <li><strong>Transmission:</strong> {car.transmission}</li>
          <li><strong>Fuel:</strong> {car.fueltype}</li>
          <li><strong>Price:</strong> ${car.price}/day</li>
          <li><strong>Description:</strong> {car.description}</li>
          {/* <li><strong>Contact:</strong> {car.mobileNum}</li> */}
        </ul>

        <ViewCarForm carId={params.id} />

      </div>
    </div>
  );
}
