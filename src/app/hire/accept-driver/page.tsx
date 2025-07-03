'use client';

import React, { useEffect, useState } from 'react'

export interface RequestsCard {
  _id: string;
  driverId: string;
  userId: string;
  //days: number;
}

export interface DriverCard {
  _id: string;
  fullname: string;
  star: string;
  description?: string; // ← Add this if it's used
}

function AcceptDriver() {

  const [hireRequests, setHireRequests] = useState<RequestsCard[]>([]);
  const [drivers, setDrivers] = useState<DriverCard[]>([]);
  const [priceRange, setPriceRange] = useState(1000);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: { star: number; reason: string } }>({});
  
  useEffect(() => {
    const fetchHireRequests = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_HIRE}`);
        const contentType = response.headers.get('content-type');
          
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
          
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Fetched hire-requests:', data);
          setHireRequests(data); // ✅ Set the fetched data into state
          setLoading(false); // ✅ Set loading to false after fetching
          console.log('hire-requests', hireRequests)
        } else {
          throw new Error('Expected JSON response');
        }
      } catch (error) {
        console.error('Failed to fetch hire-requests:', error);
        setLoading(false); // ✅ Ensure loading state ends even on error
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await fetch('/api/hire-drivers');
        const contentType = response.headers.get('content-type');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Fetched drivers:', data);
          setDrivers(data); // ✅ Set the fetched data into state
          setLoading(false); // ✅ Set loading to false after fetching
          console.log('drivers', drivers)
        } else {
          throw new Error('Expected JSON response');
        }
      } catch (error) {
        console.error('Failed to fetch cars:', error);
        setLoading(false); // ✅ Ensure loading state ends even on error
      }
    };
      fetchHireRequests();
      fetchDrivers();
    }, []);

    const handleUpdate = async (status: 'accept' | 'reject', hireRequestId: string) => {
      try {
        const res = await fetch(`/api/hire-requests/${hireRequestId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: status,
            //star: formData[hireRequestId]?.star,
            reason: formData[hireRequestId]?.reason,
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to update hire request');
        }

      const updated = await res.json();
      console.log(`${status.toUpperCase()} successful`, updated);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-white text-center mt-10">Loading hire-requests...</div>;
        return (
            <div className="glass-container bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg border border-white border-opacity-20 max-w-6xl w-full mx-4 p-8">
                <h1 className="text-4xl font-bold text-white mb-8 text-center">Hire Driver Requests</h1>

                    <div className="flex flex-col lg:flex-row gap-8">
                    </div>

                    <div className="max-w-6xl mx-auto px-4 py-8">
                        {/* <h1 className="text-4xl text-white font-bold mb-8 text-center">Available Cars</h1> */}
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                            

                            {hireRequests
                                        .filter(hireRequests => hireRequests?.status === 'accept' || hireRequests?.status === 'on-going')
                            .map(hireRequests => {
  const matchedCar = drivers.find(car => car._id === hireRequests.driverId);
  const isExpanded = expandedCardId === hireRequests._id;
  const currentForm = formData[hireRequests._id] || { star: 0, reason: '' };

  return (
    <div
      key={hireRequests._id}
      className="bg-white/10 border border-white/20 rounded-xl p-4 shadow-lg backdrop-blur cursor-pointer"
      onClick={() => setExpandedCardId(prev => (prev === hireRequests._id ? null : hireRequests._id))}
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
        {matchedCar ? `${matchedCar.fullname}` : 'Car not found'}
      </h2>
      <p className="text-white text-m mb-2">Price: ${matchedCar?.price} per day</p>
      <p className="text-white text-m mb-2">Star {hireRequests.star} </p>
      <p className="text-white text-m mb-2">pickup Date: {hireRequests?.pickupDate} </p>
      <p className="text-white text-m mb-2">return Date for {hireRequests?.returnDate} </p>
      <p className="text-white text-m mb-2">pickup Location {hireRequests?.pickupLocation}</p>

</div>
</div><div>

      {isExpanded && (
        <div className="mt-4 space-y-2">
         <input
  type="number"
  placeholder="Star (1-5)"
  className="w-full p-2 rounded bg-white/20 text-white"
  value={currentForm.star}
  onClick={(e) => e.stopPropagation()} // 🔥 Prevent collapse
  onChange={(e) =>
    setFormData(prev => ({
      ...prev,
      [hireRequests._id]: { ...currentForm, star: Number(e.target.value) }
    }))
  }
/>

<input
  type="text"
  placeholder="Reason"
  className="w-full p-2 rounded bg-white/20 text-white"
  value={currentForm.reason}
  onClick={(e) => e.stopPropagation()} // 🔥 Prevent collapse
  onChange={(e) =>
    setFormData(prev => ({
      ...prev,
      [hireRequests._id]: { ...currentForm, reason: e.target.value }
    }))
  }
/>

         
          <div className="flex gap-4 mt-2">
            <button
  className="bg-green-500 text-white px-4 py-2 rounded"
  onClick={(e) => {
    e.stopPropagation();
    handleUpdate('accept', hireRequests._id);
  }}
>
  Accept
</button>

<button
  className="bg-red-500 text-white px-4 py-2 rounded"
  onClick={(e) => {
    e.stopPropagation();
   handleUpdate('reject', hireRequests._id);
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

export default AcceptDriver