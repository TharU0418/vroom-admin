'use client';
//import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export interface DriverCard {
  id: string;
  fullname: string;
  driverId: string;
  email: string;
  contact: number;
  star: number;
  images: string[];
  description?: string;
  tour_types: string[]; // Added this field for filtering
  experience:string;
}

function ViewDrivers() {
  const [drivers, setDrivers] = useState<DriverCard[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<DriverCard[]>([]); // To store filtered results
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_DRIVERS}`);
        const contentType = response.headers.get('content-type');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Fetched drivers:', data);
          setDrivers(data);
          setFilteredDrivers(data); // Set the filtered list initially to all drivers
          setLoading(false);
        } else {
          throw new Error('Expected JSON response');
        }
      } catch (error) {
        console.error('Failed to fetch cars:', error);
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // Filter drivers based on selectedType
  useEffect(() => {
    if (selectedType === 'all') {
      setFilteredDrivers(drivers);
    } else {
      const filtered = drivers.filter(driver =>
        driver.tour_types.includes(selectedType)
      );
      setFilteredDrivers(filtered);
    }
  }, [selectedType, drivers]);

  if (loading) return <div className="text-white text-center mt-10">Loading drivers...</div>;

  // Function to copy email to clipboard
  const copyToClipboard = (email: string) => {
    navigator.clipboard.writeText(email)
      .then(() => {
        alert(`Email ${email} copied to clipboard!`);
      })
      .catch(err => {
        console.error('Failed to copy email: ', err);
      });
  };

  return (
    <div className="glass-container bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg border border-white border-opacity-20 max-w-6xl w-full mx-4 p-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">View Drivers</h1>

      {/* Dropdown for selecting type */}
<div className="mb-6" style={{ position: 'absolute', right: 20, top: '20px' }}>
        <label htmlFor="tourType" className="text-black font-semibold">Select Tour Type:</label>
        <select
          id="tourType"
          className="bg-white/20 text-black border border-white/40 rounded-xl p-2 mt-2 ml-2"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="full-day">Full Day</option>
          <option value="one-time">One Time</option>
          <option value="drinkdrive">Drink Drive</option>
          <option value="long-term">Long Term</option>
        </select>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredDrivers.map(driver => (
            <div key={driver.id} className="bg-white/10 border border-white/20 rounded-xl p-4 shadow-lg backdrop-blur">
              {/* <im
                src={driver.images[0]}
                alt={`${driver.fullname}`}
                className="w-full h-48 object-cover rounded-lg"
              /> */}
              <h2 className="text-xl text-white font-semibold mb-1">Name: {driver.fullname}</h2>
              <h2 className="text-white mb-1">Driver ID: {driver.id}</h2>
              <p className="text-white mb-2">Email: 
                <span className="flex items-center gap-2">
                  {driver.email}
                 
                </span>
              </p>
              <p className="text-white mb-2">Contact: {driver.contact}</p>
              <p className="text-white mb-2">Experience Years: {driver.experience}</p>
              <p className="text-white mb-2">Star: {driver.star}</p>
              <p className="text-white mb-2">Description: {driver.description}</p>
              <p className="text-white mb-2">Tour Types:</p>
                <ul>
                  {driver.tour_types.map((type, index) => (
                    <li key={index}>{type}</li>
                  ))}
                </ul>
              

               <button
                    onClick={() => copyToClipboard(driver.id)}
                    className="bg-red-950 p-1 rounded-sm text-white hover:text-green-500 transition"
                    aria-label="Copy email"
                  >
                    Copy Driver
                  </button>

            </div>

            
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewDrivers;
