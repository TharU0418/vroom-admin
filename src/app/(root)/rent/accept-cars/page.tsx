'use client';

import React, { useEffect, useState } from 'react';

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
  description?: string;
    status?: string;

}

function AcceptRequests() {
  const [rentRequests, setRentRequests] = useState<RequestsCard[]>([]);
  const [cars, setCars] = useState<CarCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [statusForm, setStatusForm] = useState<{ [key: string]: { status: string; repairDays?: number } }>({});

  useEffect(() => {
    const fetchRentRequests = async () => {
      try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_RENT_REQUESTS}`);
        const data = await response.json();
        setRentRequests(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch rent-requests:', error);
        setLoading(false);
      }
    };

    const fetchCars = async () => {
      try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_RENT}` );
        const data = await response.json();
        setCars(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
        setLoading(false);
      }
    };

    fetchRentRequests();
    fetchCars();
  }, []);

  const handleUpdate = async (rentRequestId: string) => {
    const updateData = statusForm[rentRequestId];
    if (!updateData) return;

    try {
      const res = await fetch(`/api/accept-hire-requests/${rentRequestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: updateData.status,
          repairDays: updateData.repairDays,
        }),
      });

      console.log('updateData', updateData)

      if (!res.ok) throw new Error('Failed to update rent request');

      const updated = await res.json();
      console.log('Update successful:', updated);

      // Optional: Refresh rentRequests after update
      setRentRequests(prev =>
        prev.map(req => (req.id === updated._id ? updated : req))
      );
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (loading) return <div className="text-white text-center mt-10">Loading rent-requests...</div>;

  return (
    <div className="glass-container bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg border border-white border-opacity-20 max-w-6xl w-full mx-4 p-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Rent Car Requests</h1>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {rentRequests
            .filter(rentRequest => rentRequest?.status === 'accept' || rentRequest?.status === 'on-going')
            .map(rentRequest => {
              const matchedCar = cars.find(car => car.id === rentRequest.carId);
              const isExpanded = expandedCardId === rentRequest.id;
              const currentForm = statusForm[rentRequest.id] || { status: 'available' };

              return (
                <div
                  key={rentRequest.id}
                  className="bg-white/10 border border-white/20 rounded-xl p-4 shadow-lg backdrop-blur cursor-pointer"
                  onClick={() =>
                    setExpandedCardId(prev => (prev === rentRequest.id ? null : rentRequest.id))
                  }
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
                      <p className="text-white text-m mb-2">Year: {matchedCar?.year}</p>
                      <p className="text-white text-m mb-2">Price: ${matchedCar?.price} for a day</p>
                      <p className="text-white text-m mb-2">Requested for {rentRequest?.days} days</p>
                      <p className="text-white text-m mb-2">Availability: {rentRequest?.status}</p>
                      <p className="text-white text-m mb-2">Pickup Date: {rentRequest?.pickupDate}</p>
                      <p className="text-white text-m mb-2">Return Date: {rentRequest?.returnDate}</p>
                      <p className="text-white text-m mb-2">Pickup Location: {rentRequest?.pickupLocation}</p>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-white mb-2">Status</label>
                        <select
            className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-black"
                          value={currentForm.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            setStatusForm(prev => ({
                              ...prev,
                              [rentRequest.id]: {
                                ...currentForm,
                                status: e.target.value
                              }
                            }))
                          }
                        >
                          <option value="">Select </option>
                          <option value="on-going">On Going</option>
                          <option value="completed">Completed</option>
                          <option value="cancel">Cancel</option>
                        </select>
                      </div>

                      {currentForm.status === 'repaired' && (
                        <div>
                          <label className="block text-white mb-2">Repair Duration (days)</label>
                          <input
                            type="number"
                            className="w-full p-2 rounded bg-white/20 text-white"
                            value={currentForm.repairDays || ''}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setStatusForm(prev => ({
                                ...prev,
                                [rentRequest.id]: {
                                  ...currentForm,
                                  repairDays: Number(e.target.value)
                                }
                              }))
                            }
                          />
                        </div>
                      )}

                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdate(rentRequest.id);
                        }}
                      >
                        Update
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default AcceptRequests;
