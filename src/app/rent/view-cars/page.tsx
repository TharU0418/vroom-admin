'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export interface CarCard {
  _id: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  images: string[];
  district?: string;
  description?: string; // ← Add this if it's used
}

function ViewCars() {
  const [cars, setCars] = useState<CarCard[]>([]);
  const [priceRange, setPriceRange] = useState(1000);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('https://qjfm2z3b55.execute-api.eu-north-1.amazonaws.com/rent-request/rent');
        const contentType = response.headers.get('content-type');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Fetched cars:', data);
          setCars(data); // ✅ Set the fetched data into state
          setLoading(false); // ✅ Set loading to false after fetching
        } else {
          throw new Error('Expected JSON response');
        }
      } catch (error) {
        console.error('Failed to fetch cars:', error);
        setLoading(false); // ✅ Ensure loading state ends even on error
      }
    };
    fetchCars();
  }, []);

  // Filter cars based on price range and brand search query
  const filteredCars = cars.filter(
    (car) =>
      (searchQuery === '' || car.brand.toLowerCase().includes(searchQuery.toLowerCase())) // Filter by brand only if searchQuery is not empty
  );

  if (loading) return <div className="text-white text-center mt-10">Loading cars...</div>;

  return (
    <div className="glass-container bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg border border-white border-opacity-20 max-w-6xl w-full mx-4 p-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">View Rent Cars</h1>

      {/* Search Bar */}
      <div className="mb-8 text-center">
        <input
          type="text"
          className="bg-white/20 text-white rounded-xl p-3 w-full max-w-lg"
          placeholder="Search by car brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on change
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* <h1 className="text-4xl text-white font-bold mb-8 text-center">Available Cars</h1> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <div
                key={car._id}
                className="bg-white/10 border border-white/20 rounded-xl cursor-pointer p-4 shadow-lg backdrop-blur"
                onClick={() => router.push(`/rent/view-cars/${car._id}`)}
              >
                <img
                  src={car.images[0]}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h2 className="text-xl text-white font-semibold mb-1">
                  {car.brand} {car.model} ({car.year})
                </h2>
                <p className="text-white/70 mb-2">Price: ${car.price}</p>
                <p className="text-white text-sm">{car.district}</p>
              </div>
            ))
          ) : (
            <p className="text-white text-center">No cars found for the selected brand.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewCars;
