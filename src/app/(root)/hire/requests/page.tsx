'use client';

import React, { useEffect, useState } from 'react';

export interface RequestsCard {
  id: string;
  driverId: string;
  userId: string;
  days: number;
  pickupTime: string;
  message: string; 
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  type: string;
  status: string;
  reason: string;
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
    <div className="fixed top-4 right-4 z-50 animate-slideInRight">
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl border border-green-300/30">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <span className="font-semibold text-lg">{notificationMessage}</span>
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
          const filteredCars = data.filter((caersData1: { status: string }) => 
            caersData1.status === 'pending'
          );
          setHireRequests(filteredCars);
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
        } else {
          throw new Error('Expected JSON response');
        }
      } catch (error) {
        console.error('Failed to fetch drivers:', error);
      }
    };

    fetchHireRequests();
    fetchDrivers();
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-500/20 text-yellow-300 border-yellow-400',
      'accepted': 'bg-green-500/20 text-green-300 border-green-400',
      'rejected': 'bg-red-500/20 text-red-300 border-red-400',
      'available1': 'bg-blue-500/20 text-blue-300 border-blue-400',
      'available': 'bg-green-500/20 text-green-300 border-green-400'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-400';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'long-term': 'bg-purple-500/20 text-purple-300',
      'one-time': 'bg-blue-500/20 text-blue-300',
      'drinkdrive': 'bg-red-500/20 text-red-300',
      'full-day': 'bg-green-500/20 text-green-300',
      'lady-one-time': 'bg-pink-500/20 text-pink-300',
      'lady-drinkdrive': 'bg-pink-600/20 text-pink-400'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-300';
  };

  const handleUpdate = async (status: 'accept' | 'reject', driverStatus: 'pending' | 'reject', hireRequestId: string) => {
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
          driverStatus: driverStatus,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update hire request');
      }

      const updated = await res.json();
      setNotificationMessage(`Request ${status.toUpperCase()}ED successfully!`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      
      // Remove the request from the list
      setHireRequests(prev => prev.filter(req => req.id !== hireRequestId));
    } catch (err) {
      console.error(err);
      setNotificationMessage('Error updating request');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-800 flex items-center justify-center">
      <div className="text-white text-xl animate-pulse">Loading hire requests...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Hire Requests
          </h1>
          <p className="text-gray-300 text-lg">Manage driver hire requests efficiently</p>
        </div>

        {/* Stats and Filter Section */}
        <div className="glass-container bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="text-center lg:text-left mb-4 lg:mb-0">
              <h2 className="text-2xl font-semibold text-white mb-2">
                {hireRequests.filter(req => selectedType === 'all' || req.type === selectedType).length} Pending Requests
              </h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-yellow-300">Awaiting your action</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <label htmlFor="tourType" className="text-white font-semibold text-lg">Filter by Type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-black/30 text-white border border-white/30 rounded-xl p-3 px-6 backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all capitalize"
              >
                <option value="all">All Types</option>
                <option value="long-term">Long-term</option>
                <option value="one-time">One-time</option>
                <option value="drinkdrive">Drinkdrive</option>
                <option value="full-day">Full-day</option>
                <option value="lady-one-time">One Time (Lady)</option>
                <option value="full-day">Full Day (Lady)</option>
                <option value="lady-drinkdrive">Drink Drive (Lady)</option>
                <option value="long-term">Long Term (Lady)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Grid */}
        <div className="space-y-6">
          {hireRequests
            .filter(req => selectedType === 'all' || req.type === selectedType)
            .map(hireRequest => {
              const matchedDriver = drivers.find(d => d.id === hireRequest.driverId);
              const isExpanded = expandedCardId === hireRequest.id;
              const currentForm = formData[hireRequest.id] || { driverId: '', reason: '' };

              return (
                <div
                  key={hireRequest.id}
                  className={`glass-container bg-white/5 backdrop-blur-lg rounded-2xl p-6 border transition-all duration-300 cursor-pointer hover:border-white/30 ${
                    isExpanded ? 'border-red-400/50' : 'border-white/10'
                  }`}
                  onClick={() => setExpandedCardId(prev => (prev === hireRequest.id ? null : hireRequest.id))}
                >
                  {/* Request Header */}
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
                    <div className="flex items-center space-x-4 mb-3 lg:mb-0">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getTypeColor(hireRequest.type)}`}>
                        {hireRequest.type.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(hireRequest.status)}`}>
                        {hireRequest.status}
                      </span>
                    </div>
                    <div className="text-gray-300 text-sm">
                      Hire ID: <span className="text-white font-mono">{hireRequest.id}</span>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">👤</span>
                        <div>
                          <p className="text-gray-400 text-sm">User ID</p>
                          <p className="text-white font-medium">{hireRequest.userId}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📅</span>
                        <div>
                          <p className="text-gray-400 text-sm">Pickup Date</p>
                          <p className="text-white font-medium">{hireRequest.pickupDate}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">⏰</span>
                        <div>
                          <p className="text-gray-400 text-sm">Pickup Time</p>
                          <p className="text-white font-medium">{hireRequest.pickupTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📍</span>
                        <div>
                          <p className="text-gray-400 text-sm">Location</p>
                          <p className="text-white font-medium">{hireRequest.pickupLocation}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🔄</span>
                        <div>
                          <p className="text-gray-400 text-sm">Return Date</p>
                          <p className="text-white font-medium">{hireRequest.returnDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📝</span>
                        <div>
                          <p className="text-gray-400 text-sm">Days</p>
                          <p className="text-white font-medium">{hireRequest.days} days</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  {hireRequest.message && (
                    <div className="mb-4 p-4 bg-black/20 rounded-lg border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">Message:</p>
                      <p className="text-white italic">{hireRequest.message}</p>
                    </div>
                  )}

                  {/* Expandable Action Section */}
                  {isExpanded && (
                    <div 
                      className="mt-6 p-6 bg-black/20 rounded-xl border border-white/10 space-y-4 animate-slideDown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 className="text-white font-semibold text-lg mb-4">Manage Request</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-white text-sm font-medium mb-2 block">Driver ID</label>
                          <input
                            type="text"
                            className="w-full p-3 rounded-lg bg-black/30 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                            placeholder="Enter Driver ID"
                            value={currentForm.driverId}
                            onChange={(e) =>
                              setFormData(prev => ({
                                ...prev,
                                [hireRequest.id]: { ...currentForm, driverId: e.target.value }
                              }))
                            }
                          />
                        </div>
                        
                        <div>
                          <label className="text-white text-sm font-medium mb-2 block">Reason (for rejection)</label>
                          <input
                            type="text"
                            className="w-full p-3 rounded-lg bg-black/30 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                            placeholder="Enter reason if rejecting"
                            value={currentForm.reason}
                            onChange={(e) =>
                              setFormData(prev => ({
                                ...prev,
                                [hireRequest.id]: { ...currentForm, reason: e.target.value }
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-6">
                        <button
                          className={`px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 flex-1 min-w-[120px] ${
                            currentForm.driverId.trim()
                              ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 cursor-pointer shadow-lg'
                              : 'bg-green-400/50 cursor-not-allowed'
                          }`}
                          disabled={!currentForm.driverId.trim()}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (currentForm.driverId.trim()) {
                              handleUpdate('accept', 'pending', hireRequest.id);
                            }
                          }}
                        >
                          ✅ Accept
                        </button>

                        <button
                          className={`px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 flex-1 min-w-[120px] ${
                            currentForm.reason.trim()
                              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 cursor-pointer shadow-lg'
                              : 'bg-red-400/50 cursor-not-allowed'
                          }`}
                          disabled={!currentForm.reason.trim()}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (currentForm.reason.trim()) {
                              handleUpdate('reject', 'reject', hireRequest.id);
                            }
                          }}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Expand/Collapse Indicator */}
                  <div className="flex justify-center mt-4">
                    <div className="text-white/60 text-sm animate-bounce">
                      {isExpanded ? 'Click to collapse' : 'Click to expand'}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {hireRequests.filter(req => selectedType === 'all' || req.type === selectedType).length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No Pending Requests</h3>
            <p className="text-gray-400">All requests have been processed</p>
          </div>
        )}
      </div>

      {showNotification && <Notification />}

      {/* Custom Styles */}
      <style jsx>{`
        .glass-container {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Requests;