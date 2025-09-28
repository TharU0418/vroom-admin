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

function AcceptDriver() {
  const [hireRequests, setHireRequests] = useState<RequestsCard[]>([]);
  const [drivers, setDrivers] = useState<DriverCard[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
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
      } catch (error) {
        console.error('Failed to fetch drivers:', error);
      }
    };

    fetchHireRequests();
    fetchDrivers();
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'accept': 'bg-green-500/20 text-green-300 border-green-400',
      'reject': 'bg-red-500/20 text-red-300 border-red-400',
      'cancel': 'bg-yellow-500/20 text-yellow-300 border-yellow-400',
      'completed': 'bg-blue-500/20 text-blue-300 border-blue-400',
      'pending': 'bg-orange-500/20 text-orange-300 border-orange-400'
    };
    return colors[status.toLowerCase() as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-400';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      'accept': '✅',
      'reject': '❌',
      'cancel': '⚠️',
      'completed': '🏁',
      'pending': '⏳'
    };
    return icons[status.toLowerCase() as keyof typeof icons] || '📋';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'long-term': 'bg-purple-500/20 text-purple-300',
      'one-time': 'bg-blue-500/20 text-blue-300',
      'drinkdrive': 'bg-red-500/20 text-red-300',
      'full-day': 'bg-green-500/20 text-green-300',
      'lady-one-time': 'bg-pink-500/20 text-pink-300',
      'lady-full-day': 'bg-pink-600/20 text-pink-400',
      'lady-drinkdrive': 'bg-pink-700/20 text-pink-500',
      'lady-long-term': 'bg-purple-600/20 text-purple-400'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-300';
  };

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

      await res.json();
      setNotificationMessage('✅ Request marked as COMPLETED!');
      setShowNotification(true);
      
      // Update the local state to reflect the change
      setHireRequests(prev => prev.map(req => 
        req.id === hireRequestId ? { ...req, status: 'completed' } : req
      ));
      
      setTimeout(() => setShowNotification(false), 3000);
    } catch (err) {
      console.error(err);
      setNotificationMessage('❌ Error updating request');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-800 flex items-center justify-center">
      <div className="text-white text-xl animate-pulse">Loading hire requests...</div>
    </div>
  );

  const filteredRequests = hireRequests
    .filter(req => ['accept', 'reject', 'cancel', 'completed'].includes(req.status.toLowerCase()))
    .filter(req => selectedStatus === 'all' || req.status === selectedStatus)
    .filter(req => selectedType === 'all' || req.type === selectedType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Manage Requests
          </h1>
          <p className="text-gray-300 text-lg">Track and manage driver hire requests</p>
        </div>

        {/* Stats and Filters Section */}
        <div className="glass-container bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="text-center lg:text-left mb-4 lg:mb-0">
              <h2 className="text-2xl font-semibold text-white mb-2">
                {filteredRequests.length} Active Requests
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="text-green-300 text-sm">✅ Accepted: {filteredRequests.filter(r => r.status === 'accept').length}</span>
                <span className="text-red-300 text-sm">❌ Rejected: {filteredRequests.filter(r => r.status === 'reject').length}</span>
                <span className="text-yellow-300 text-sm">⚠️ Cancelled: {filteredRequests.filter(r => r.status === 'cancel').length}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <label htmlFor="statusFilter" className="text-white font-semibold">Status:</label>
                <select
                  className="p-3 rounded-lg bg-black/30 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="accept">Accepted</option>
                  <option value="reject">Rejected</option>
                  <option value="cancel">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Type Filter */}
              <div className="flex items-center space-x-2">
                <label htmlFor="typeFilter" className="text-white font-semibold">Type:</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="p-3 rounded-lg bg-black/30 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all capitalize"
                >
                  <option value="all">All Types</option>
                  <option value="long-term">Long-term</option>
                  <option value="one-time">One-time</option>
                  <option value="drinkdrive">Drinkdrive</option>
                  <option value="full-day">Full-day</option>
                  <option value="lady-one-time">One Time (Lady)</option>
                  <option value="lady-full-day">Full Day (Lady)</option>
                  <option value="lady-drinkdrive">Drink Drive (Lady)</option>
                  <option value="lady-long-term">Long Term (Lady)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRequests.map(hireRequest => {
            const matchedDriver = drivers.find(d => d.id === hireRequest.driverId);
            const isExpanded = expandedCardId === hireRequest.id;
            const isCompleted = hireRequest.status === 'completed';

            return (
              <div
                key={hireRequest.id}
                className={`glass-container bg-white/5 backdrop-blur-lg rounded-2xl p-6 border transition-all duration-300 cursor-pointer hover:transform hover:scale-105 ${
                  isExpanded ? 'border-red-400/50' : 'border-white/10'
                } ${isCompleted ? 'opacity-75' : ''}`}
                onClick={() => !isCompleted && setExpandedCardId(prev => (prev === hireRequest.id ? null : hireRequest.id))}
              >
                {/* Request Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getStatusIcon(hireRequest.status)}</span>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(hireRequest.status)}`}>
                        {hireRequest.status.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ml-2 ${getTypeColor(hireRequest.type)}`}>
                        {hireRequest.type}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-400 text-sm">
                    {hireRequest.days} day{hireRequest.days !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Driver Info */}
                {matchedDriver && (
                  <div className="mb-4 p-3 bg-black/20 rounded-lg">
                    <p className="text-gray-400 text-sm">Assigned Driver</p>
                    <p className="text-white font-semibold">{matchedDriver.fullname}</p>
                    <p className="text-gray-300 text-sm">⭐ {matchedDriver.star}/5</p>
                  </div>
                )}

                {/* Request Details */}
                <div className="space-y-3">
                   <div className="flex justify-between">
                    <span className="text-gray-400">Hire ID:</span>
                    <span className="text-white font-mono text-sm">{hireRequest.id}</span>
                  </div>
                  

                  <div className="flex justify-between">
                    <span className="text-gray-400">User ID:</span>
                    <span className="text-white font-mono text-sm">{hireRequest.userId}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pickup:</span>
                    <span className="text-white text-sm">{hireRequest.pickupDate}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time:</span>
                    <span className="text-white text-sm">{hireRequest.pickupTime}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white text-sm text-right">{hireRequest.pickupLocation}</span>
                  </div>

                  {hireRequest.message && (
                    <div className="mt-3 p-2 bg-black/20 rounded">
                      <p className="text-gray-400 text-xs">Message:</p>
                      <p className="text-white text-sm italic truncate">{hireRequest.message}</p>
                    </div>
                  )}
                </div>

                {/* Action Section */}
                {!isCompleted && isExpanded && (
                  <div 
                    className="mt-4 pt-4 border-t border-white/10 animate-slideDown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex gap-2">
                      <button
                        className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdate('completed', hireRequest.id);
                        }}
                      >
                        🏁 Mark Completed
                      </button>
                    </div>
                  </div>
                )}

                {/* Expand Indicator */}
                {!isCompleted && (
                  <div className="flex justify-center mt-3">
                    <div className="text-white/60 text-xs animate-pulse">
                      {isExpanded ? 'Click to collapse' : 'Click to expand'}
                    </div>
                  </div>
                )}

                {/* Completed Overlay */}
                {isCompleted && (
                  <div className="absolute inset-0 bg-green-500/10 rounded-2xl flex items-center justify-center">
                    <span className="text-green-300 font-semibold text-lg">✅ COMPLETED</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No Requests Found</h3>
            <p className="text-gray-400">Try adjusting your filters</p>
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
          from { opacity: 0; transform: translateY(-10px); }
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

export default AcceptDriver;