'use client';
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
  tour_types: string[];
  experience: string;
}

function ViewDrivers() {
  const [drivers, setDrivers] = useState<DriverCard[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<DriverCard[]>([]);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [copiedDriver, setCopiedDriver] = useState<string | null>(null);

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
          setFilteredDrivers(data);
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

  const copyToClipboard = (driverId: string, email: string) => {
    navigator.clipboard.writeText(email)
      .then(() => {
        setCopiedDriver(driverId);
        setTimeout(() => setCopiedDriver(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy email: ', err);
      });
  };

  const getTourTypeColor = (type: string) => {
    const colors = {
      'full-day': 'bg-blue-500/20 text-blue-300 border-blue-400',
      'one-time': 'bg-green-500/20 text-green-300 border-green-400',
      'drinkdrive': 'bg-purple-500/20 text-purple-300 border-purple-400',
      'long-term': 'bg-orange-500/20 text-orange-300 border-orange-400'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-400';
  };

  const renderStars = (stars: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < stars ? 'text-yellow-400' : 'text-gray-400'}>
            ★
          </span>
        ))}
        <span className="text-white ml-2">({stars})</span>
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-800 flex items-center justify-center">
      <div className="text-white text-xl animate-pulse">Loading drivers...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Meet Our Drivers
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Professional drivers ready to make your journey safe and comfortable
          </p>
        </div>

        {/* Filter Section */}
        <div className="flex justify-between items-center mb-8 p-6 glass-container rounded-2xl">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {filteredDrivers.length} Drivers Available
            </h2>
            <p className="text-gray-300">Filter by tour type</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <label htmlFor="tourType" className="text-white font-semibold text-lg">Tour Type:</label>
            <select
              id="tourType"
              className="bg-black/30 text-white border border-white/30 rounded-xl p-3 px-6 backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Tour Types</option>
              <option value="one-time">One Time</option>
              <option value="full-day">Multy Day</option>
              <option value="drinkdrive">Drink Drive</option>
              <option value="long-term">Long Term</option>
             <option value="lady-one-time">One Time (Lady)</option>
              <option value="full-day">Full Day  (Lady)</option>
              <option value="lady-drinkdrive">Drink Drive  (Lady)</option>
              <option value="long-term">Long Term  (Lady)</option>
            </select>
          </div>
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDrivers.map(driver => (
            <div key={driver.id} className="group">
              <div className="glass-container bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105 h-full flex flex-col">
                {/* Driver Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-gray-200 transition-colors">
                      {driver.fullname}
                    </h3>
                    <p className="text-gray-400 text-sm">Email: {driver.email}</p>
                  </div>
                  <div className="bg-red-950/50 px-3 py-1 rounded-full border border-red-800">
                    <span className="text-white font-semibold">{driver.experience} years</span>
                  </div>
                </div>

                {/* Star Rating */}
                {/* <div className="mb-4">
                  {renderStars(driver.star)}
                </div> */}

                {/* Contact Info */}
                <div className="space-y-3 mb-4 flex-grow">
                  <div className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg">
                    <span className="text-gray-400">📧</span>
                    <div className="flex-1">
                      <p className="text-gray-300 text-sm">Driver ID</p>
                      <p className="text-white truncate">{driver.id}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(driver.id, driver.id)}
                      className={`p-2 rounded-lg transition-all ${
                        copiedDriver === driver.id 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-700/50 text-gray-300 hover:bg-red-950/50 hover:text-white'
                      }`}
                    >
                      {copiedDriver === driver.id ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg">
                    <span className="text-gray-400">📱</span>
                    <div>
                      <p className="text-gray-300 text-sm">Contact</p>
                      <p className="text-white">{driver.contact}</p>
                    </div>
                  </div>
                </div>

                {/* Tour Types */}
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-2">Tour Types:</p>
                  <div className="flex flex-wrap gap-2">
                    {driver.tour_types.map((type, index) => (
                      <span 
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs border ${getTourTypeColor(type)}`}
                      >
                        {type.replace('-', ' ').toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                {driver.description && (
                  <div className="mt-auto pt-4 border-t border-white/10">
                    <p className="text-gray-300 text-sm italic">{driver.description}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredDrivers.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No Drivers Found</h3>
            <p className="text-gray-400">Try selecting a different tour type</p>
          </div>
        )}
      </div>

      {/* Add some custom styles for the glass effect */}
      <style jsx>{`
        .glass-container {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}

export default ViewDrivers;