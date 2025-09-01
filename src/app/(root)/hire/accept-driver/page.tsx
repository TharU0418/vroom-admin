'use client';

import React, { useEffect, useState } from 'react'

export interface RequestsCard {
  id: string;
  driverId: string;
  userId: string;
  days: number;
  pickupTime: String;
  message: String; 
  pickupDate: String;
  returnDate: String;
  pickupLocation: String;
  type: String;
  status: String;
  reason: String;
}

export interface DriverCard {
  id: string;
  fullname: string;
  star: string;
  description?: string;
}

function AcceptDriver() {
  const [hireRequests, setHireRequests] = useState<RequestsCard[]>([]);
  const [drivers, setDrivers] = useState<DriverCard[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all'); // ✅ new state
  const [loading, setLoading] = useState(true);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHireRequests = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_HIRE}`);
        const data = await response.json();
        setHireRequests(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch hire-requests:', error);
        setLoading(false);
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_DRIVERS}`);
        const data = await response.json();
        setDrivers(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch drivers:', error);
        setLoading(false);
      }
    };

    fetchHireRequests();
    fetchDrivers();
  }, []);

  const handleUpdate = async (status: 'completed', hireRequestId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_HIRE_REQUESTS}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: hireRequestId,
          status: status,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update hire request');
      }

      const updated = await res.json();

      alert(`${status.toUpperCase()} successful`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-white text-center mt-10">Loading hire-requests...</div>;

  // ✅ Filter the requests by selected status
  const filteredRequests = hireRequests
    .filter(req => ['accept', 'reject', 'cancel'].includes(req.status.toLowerCase()))
    .filter(req => selectedStatus === 'all' || req.status === selectedStatus);

  return (
    <div className="glass-container bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg border border-white border-opacity-20 max-w-6xl w-full mx-4 p-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Hire Driver Requests</h1>

      {/* ✅ Dropdown Filter */}
      <div className="mb-6 flex justify-end">
        <select
          className="p-2 rounded-md bg-white/20 text-white"
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="accept">Accepted</option>
          <option value="reject">Rejected</option>
          <option value="cancel">Cancelled</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {filteredRequests.map(hireRequest => {
          const matchedDriver = drivers.find(d => d.id === hireRequest.driverId);
              const isExpanded = expandedCardId === hireRequest.id;
          //    const currentForm = formData[hireRequest.id] || { driverId: '', reason: '' };

          return (
            <div
              key={hireRequest.id}
              className={`rounded-xl p-4 shadow-lg backdrop-blur cursor-pointer border border-white/20 ${
                hireRequest.status === 'accept'
                  ? 'bg-green-500/30'
                  : hireRequest.status === 'reject'
                  ? 'bg-red-500/30'
                  : hireRequest.status === 'cancel'
                  ? 'bg-yellow-500/30'
                  : 'bg-white/10'
              }`}
              onClick={() => setExpandedCardId(prev => (prev === hireRequest.id ? null : hireRequest.id))}
            >
              <div className="md:w-1/2">
                <h2 className="text-xl text-white font-semibold mb-1">{hireRequest?.type}</h2>
                <p className="text-white text-m mb-2">User Name: {hireRequest?.userId}</p>
                <p className="text-white text-m mb-2">Status: {hireRequest?.status}</p>
                <p className="text-white text-m mb-2">Pickup Date: {hireRequest?.pickupDate}</p>
                <p className="text-white text-m mb-2">Return Date: {hireRequest?.returnDate}</p>
                <p className="text-white text-m mb-2">Pickup Location: {hireRequest?.pickupLocation}</p>
                <p className="text-white text-m mb-2">Pickup Time: {hireRequest?.pickupTime}</p>
                <p className="text-white text-m mb-2">Message: {hireRequest?.message}</p>
              </div>
              {isExpanded && (
                    <div className="mt-4 space-y-2">
                      
                      
                      <div className="flex gap-4 mt-2">
  <button
    className={`px-4 py-2 rounded text-white ${
     // currentForm.driverId.trim()
         'bg-green-500 hover:bg-green-600 cursor-pointer'
        
    }`}
    //disabled={!currentForm.driverId.trim()}
    onClick={(e) => {
      e.stopPropagation();
     // if (currentForm.driverId.trim()) {
        handleUpdate('completed', hireRequest.id);
      //}
    }}
  >
    Completed
  </button>

  
</div>

                    </div>
                  )}
            </div>

            
          );
        })}
      </div>
    </div>
  );
}

export default AcceptDriver;
