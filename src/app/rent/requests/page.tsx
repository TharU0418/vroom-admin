'use client';

import React, { useEffect, useState } from 'react'

export interface RequestsCard {
  id: string;
  carId: string;
  userId: string;
  days: number;
  pickupDate?: string;
  returnDate?: string;
  pickupLocation?: string;
  status: string
}

export interface CarCard {
  id: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  images: string[];
  location?: string;
  description?: string; // ← Add this if it's used
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  location: string;
}


function Requests() {

  const [rentRequests, setRentRequests] = useState<RequestsCard[]>([]);
  const [cars, setCars] = useState<CarCard[]>([]);

  const [priceRange, setPriceRange] = useState(1000);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);

  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: { star: number; reason: string } }>({});
  const [users, setUsers] = useState<User[]>([]);

    
useEffect(() => {
  const fetchRentRequests = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_RENT_REQUESTS}`);
      const contentType = response.headers.get('content-type');

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setRentRequests(data);
      } else {
        throw new Error('Expected JSON response');
      }
    } catch (error) {
      console.error('Failed to fetch rent-requests:', error);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_RENT}` );
      const contentType = response.headers.get('content-type');

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setCars(data);
      } else {
        throw new Error('Expected JSON response');
      }
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const contentType = response.headers.get('content-type');

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setUsers(data);
      } else {
        throw new Error('Expected JSON response for users');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  // Call all fetches only once on mount
  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchRentRequests(), fetchCars(), fetchUsers()]);
    setLoading(false);
  };

  fetchAllData();
}, []);


const handleUpdate = async (status: 'accept' | 'reject', rentRequestId: string, id: string) => {
  const rentRequest = rentRequests.find(r => r.id === rentRequestId);
  if (!rentRequest) {
    console.error('Rent request not found');
    return;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_RENT}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id:rentRequestId,
        status: status,
      //  star: formData[rentRequestId]?.star,
        reason: formData[rentRequestId]?.reason,
       // pickupDate: rentRequest.pickupDate,
       // returnDate: rentRequest.returnDate,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to update rent request');
    }
  } catch (error) {
    console.error('Failed to update rent request:', error);
  }

  console.log('dates',rentRequest.pickupDate, id)

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_RENT}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id:id,
        bookedDate: {
            "pickedDate": rentRequest.pickupDate,
            "returnDate": rentRequest.returnDate
         }
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to update rent dates');
    }
  } catch (error) {
    console.error('Failed to update rent dates:', error);
  }

  
};


  
    if (loading) return <div className="text-white text-center mt-10">Loading rent-requests...</div>;
        return (
            <div className="glass-container bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg border border-white border-opacity-20 max-w-6xl w-full mx-4 p-8">
                <h1 className="text-4xl font-bold text-white mb-8 text-center">Rent Car Requests</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                </div>

                <div className="max-w-6xl mx-auto px-4 py-8">
                  {/* <h1 className="text-4xl text-white font-bold mb-8 text-center">Available Cars</h1> */}
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {rentRequests
                   //.filter(rentRequest => rentRequest?.status === 'pending')
                    .map(rentRequest => {
                      const matchedCar = cars.find(car => car.id === rentRequest.carId);
                      const isExpanded = expandedCardId === rentRequest.id;
                      const currentForm = formData[rentRequest.id] || { star: 0, reason: '' };
                      const matchedUser = users.find(user => user.email === rentRequest.userId);

                      console.log('1', matchedCar)
                      console.log('2', isExpanded)
                      console.log('3', currentForm)
                      console.log('4', matchedUser)
                      console.log('5', users)

                      return (
                        <div
                          key={rentRequest.id}
                          className="bg-white/10 border border-white/20 rounded-xl p-4 shadow-lg backdrop-blur cursor-pointer"
                          onClick={() => setExpandedCardId(prev => (prev === rentRequest.id ? null : rentRequest.id))}
                        >
                          <div className="flex flex-col lg:flex-row gap-8">
                          <div className="md:w-1/2">
                          {matchedCar?.images?.[0] && (
                            <img
                              src={matchedCar.images[0]}
                              alt={`${matchedCar.brand} ${matchedCar.model}`}
                              className="w-full h-58 object-cover rounded-lg mb-2"
                            />
                          )}
                          </div>
                          <div className="md:w-1/2">
                          <h2 className="text-xl text-white font-semibold mb-1">
                            {matchedCar ? `${matchedCar.brand} ${matchedCar.model}` : 'Car not found'}
                          </h2>
                          <p className="text-white text-m mb-2">User Name: {matchedUser?.firstName} {matchedUser?.lastName}</p>
                          <p className="text-white text-m mb-2">Mobile Number: {matchedUser?.mobileNumber || 'N/A'}</p>
                          <p className="text-white text-m mb-2">Year: {matchedCar?.year}</p>
                                <p className="text-white text-m mb-2">Price: ${matchedCar?.price} for a day </p>
                                <p className="text-white text-m mb-2">Requested for {rentRequest?.days} days</p>
                                <p className="text-white text-m mb-2">Status {rentRequest?.status}</p>
                                <p className="text-white text-m mb-2">pickup Date: {rentRequest?.pickupDate} </p>
                                <p className="text-white text-m mb-2">return Date for {rentRequest?.returnDate} </p>
                                <p className="text-white text-m mb-2">pickup Location {rentRequest?.pickupLocation}</p>
                                  


                          </div>
                          </div>
                          <div>
                          {isExpanded && (
                            <div className="mt-4 space-y-2">
                              {/* <input
                                type="number"
                                placeholder="Star (1-5)"
                                className="w-full p-2 rounded bg-white/20 text-white"
                                value={currentForm.star}
                                onClick={(e) => e.stopPropagation()} // 🔥 Prevent collapse
                                onChange={(e) =>
                                  setFormData(prev => ({
                                    ...prev,
                                    [rentRequest.id]: { ...currentForm, star: Number(e.target.value) }
                                  }))
                                }
                              /> */}
                              <input
                                type="text"
                                placeholder="Reason"
                                className="w-full p-2 rounded bg-white/20 text-white"
                                value={currentForm.reason}
                                onClick={(e) => e.stopPropagation()} // 🔥 Prevent collapse
                                onChange={(e) =>
                                setFormData(prev => ({
                                  ...prev,
                                  [rentRequest.id]: { ...currentForm, reason: e.target.value }
                                }))
                                }
                              />

                              <div className="flex gap-4 mt-2">
                                <button
                                  className="bg-green-500 text-white px-4 py-2 rounded"
                                  onClick={(e) => {
  e.stopPropagation();
  if (!matchedCar) {
    console.error('No matched car found for this request');
    return;
  }
  handleUpdate('accept', rentRequest.id, matchedCar.id);
}}

                                >
                                  Accept
                                </button>

                                <button
                                  className="bg-red-500 text-white px-4 py-2 rounded"
                                  onClick={(e) => {
  e.stopPropagation();
  if (!matchedCar) {
    console.error('No matched car found for this request');
    return;
  }
  handleUpdate('reject', rentRequest.id, matchedCar.id);
}}

                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
            </div>
        )
}

export default Requests