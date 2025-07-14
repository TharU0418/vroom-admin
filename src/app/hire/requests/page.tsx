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

function Requests() {

  const [hireRequests, setHireRequests] = useState<RequestsCard[]>([]);
  const [drivers, setDrivers] = useState<DriverCard[]>([]);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: { star?: number; reason: string; driverId: string; } }>({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const Notification = () => (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-green-500 text-white px-8 py-6 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out animate-fadeInUp">
        <div className="flex items-center">
          <span className="font-semibold text-xl">{notificationMessage}</span>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const fetchHireRequests = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_HIRE}`);
        const contentType = response.headers.get('content-type');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setHireRequests(data);
          setLoading(false);
        } else {
          throw new Error('Expected JSON response');
        }
      } catch (error) {
        console.error('Failed to fetch hire-requests:', error);
        setLoading(false);
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_DRIVERS}`);
        const contentType = response.headers.get('content-type');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setDrivers(data);
          setLoading(false);
        } else {
          throw new Error('Expected JSON response');
        }
      } catch (error) {
        console.error('Failed to fetch drivers:', error);
        setLoading(false);
      }
    };

    fetchHireRequests();
    fetchDrivers();
  }, []);

  const handleUpdate = async (status: 'accept' | 'reject', hireRequestId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_HIRE_REQUESTS}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: hireRequestId,
          status: status,
          reason: formData[hireRequestId]?.reason,
          driverId: formData[hireRequestId]?.driverId,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update hire request');
      }

      const updated = await res.json();
      setNotificationMessage(`${status.toUpperCase()} successful`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-white text-center mt-10">Loading hire-requests...</div>;

  return (
    <div className="glass-container bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg border border-white border-opacity-20 max-w-6xl w-full mx-4 p-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Hire Driver Requests</h1>

      {/* 🔽 Type Filter Dropdown */}
      <div className="flex justify-center mb-6">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-white/20 text-white px-4 py-2 rounded border border-white/30 focus:outline-none capitalize"
        >
          <option value="all">All Types</option>
          <option value="long-term">Long-term</option>
          <option value="one-time">One-time</option>
          <option value="drinkdrive">Drinkdrive</option>
          <option value="full-day">Full-day</option>
        </select>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {hireRequests
            .filter(req => selectedType === 'all' || req.type === selectedType)
            .map(hireRequest => {
              const matchedDriver = drivers.find(d => d.id === hireRequest.driverId);
              const isExpanded = expandedCardId === hireRequest.id;
              const currentForm = formData[hireRequest.id] || { driverId: '', reason: '' };

              return (
                <div
                  key={hireRequest.id}
                  className={`rounded-xl p-4 shadow-lg backdrop-blur cursor-pointer border border-white/20 ${
                    hireRequest.status === 'pending'
                      ? 'bg-red-500/30'
                      : hireRequest.status === 'available1'
                      ? 'bg-yellow-500/30'
                      : hireRequest.status === 'available'
                      ? 'bg-green-500/30'
                      : 'bg-white/10'
                  }`}
                  onClick={() =>
                    setExpandedCardId(prev => (prev === hireRequest.id ? null : hireRequest.id))
                  }
                >
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="md:w-1/2">
                      <h2 className="text-xl text-white font-semibold mb-1">{hireRequest.type}</h2>
                      <p className="text-white text-m mb-2">User ID: {hireRequest.userId}</p>
                      <p className="text-white text-m mb-2">Status: {hireRequest.status}</p>
                      <p className="text-white text-m mb-2">Pickup Date: {hireRequest.pickupDate}</p>
                      <p className="text-white text-m mb-2">Return Date: {hireRequest.returnDate}</p>
                      <p className="text-white text-m mb-2">Pickup Location: {hireRequest.pickupLocation}</p>
                      <p className="text-white text-m mb-2">Pickup Time: {hireRequest.pickupTime}</p>
                      <p className="text-white text-m mb-2">Message: {hireRequest.message}</p>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-2">
                      <label className="text-white">Driver ID</label>
                      <input
                        type="text"
                        className="w-full p-2 rounded bg-white/20 text-white"
                        value={currentForm.driverId}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            [hireRequest.id]: { ...currentForm, driverId: e.target.value }
                          }))
                        }
                      />
                      <label className="text-white">Reason</label>
                      <input
                        type="text"
                        className="w-full p-2 rounded bg-white/20 text-white"
                        value={currentForm.reason}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            [hireRequest.id]: { ...currentForm, reason: e.target.value }
                          }))
                        }
                      />
                      <div className="flex gap-4 mt-2">
  <button
    className={`px-4 py-2 rounded text-white ${
      currentForm.driverId.trim()
        ? 'bg-green-500 hover:bg-green-600 cursor-pointer'
        : 'bg-green-300 cursor-not-allowed'
    }`}
    disabled={!currentForm.driverId.trim()}
    onClick={(e) => {
      e.stopPropagation();
      if (currentForm.driverId.trim()) {
        handleUpdate('accept', hireRequest.id);
      }
    }}
  >
    Accept
  </button>

  <button
    className={`px-4 py-2 rounded text-white ${
      currentForm.reason.trim()
        ? 'bg-red-500 hover:bg-red-600 cursor-pointer'
        : 'bg-red-300 cursor-not-allowed'
    }`}
    disabled={!currentForm.reason.trim()}
    onClick={(e) => {
      e.stopPropagation();
      if (currentForm.reason.trim()) {
        handleUpdate('reject', hireRequest.id);
      }
    }}
  >
    Reject
  </button>
</div>

                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {showNotification && <Notification />}
    </div>
  );
}

export default Requests;
