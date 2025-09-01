'use client';
import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define the type for a location object
interface Location {
  _id: string;
  latitude: string | number;
  longitude: string | number;
  timestamp: string;
  rideId: string;
}

export interface RequestsCard {
  id: string;
  latitude: number;
  longitude: number;
  days: String;
  rideId: String;
  timestamp: String; 
  userId: String;
}

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LiveLocation: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [rideIds, setRideIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRideId, setSelectedRideId] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchHireRequests = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_LOCATIONS}`);
        const contentType = response.headers.get('content-type');

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Fetched hire-requests data:', data);

          const filteredRideIds = data
            .map((item: { rideId: string }) => item.rideId)
            .filter((rideId: string | null) => rideId !== null && rideId !== undefined);

          // Remove duplicates
          setRideIds(Array.from(new Set(filteredRideIds)));
        } else {
          throw new Error('Expected JSON response');
        }
      } catch (error) {
        console.error('Failed to fetch hire-requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHireRequests();
  }, []);

  useEffect(() => {
    if (!selectedRideId) return;

    const fetchLocations = () => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL_LOCATIONS}`)
        .then((res) => res.json())
        .then((data: Location[]) => {
          const cleaned = data.filter(
            (loc) =>
              !isNaN(Number(loc.latitude)) && 
              !isNaN(Number(loc.longitude)) &&
              loc.rideId === selectedRideId
          );
          setLocations(cleaned);
          setLastUpdated(new Date());
        })
        .catch((err) => console.error('Fetch error:', err));
    };

    fetchLocations(); // initial fetch
    const interval = setInterval(fetchLocations, 30 * 1000); // every 30 seconds

    return () => clearInterval(interval); // cleanup
  }, [selectedRideId]);

  const center: [number, number] = locations.length
    ? [Number(locations[0].latitude), Number(locations[0].longitude)]
    : [6.3618348, 80.0181949]; // Default center

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRideId(event.target.value);
  };

  // Custom icon for markers
  const createCustomIcon = (color: string) => {
    return new L.DivIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          position: relative;
        ">
          <div style="
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
          "></div>
        </div>
      `,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm py-4 px-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Live Location Tracker</h1>
        <p className="text-gray-600">Monitor real-time movement of vehicles</p>
      </div>

      {/* Controls Section */}
      <div className="p-6 bg-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <label htmlFor="rideIdSelect" className="block text-sm font-medium text-gray-700 mb-1">
              Select Ride ID
            </label>
            <select 
              id="rideIdSelect" 
              value={selectedRideId} 
              onChange={handleSelectChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              <option value="">-- Select a Ride ID --</option>
              {rideIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            {loading && (
              <div className="flex items-center text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
                Loading...
              </div>
            )}
            
            {lastUpdated && (
              <div className="text-sm text-gray-600">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      {selectedRideId && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-100">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Ride ID</h3>
            <p className="text-lg font-semibold">{selectedRideId}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Location Points</h3>
            <p className="text-lg font-semibold">{locations.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="text-lg font-semibold text-green-600">Active</p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer 
          center={center} 
          zoom={15} 
          className="h-full w-full z-0"
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {locations.map((loc, index) => (
            <Marker
              key={loc._id}
              position={[Number(loc.latitude), Number(loc.longitude)]}
              icon={createCustomIcon(index === locations.length - 1 ? '#e53e3e' : '#3182ce')}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">Location Details</h3>
                  <p>Lat: {Number(loc.latitude).toFixed(5)}</p>
                  <p>Lon: {Number(loc.longitude).toFixed(5)}</p>
                  <p>Time: {new Date(loc.timestamp).toLocaleString()}</p>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {locations.length > 1 && (
            <Polyline
              positions={locations.map((loc) => [
                Number(loc.latitude),
                Number(loc.longitude),
              ])}
              color="#3182ce"
              weight={4}
              opacity={0.7}
            />
          )}
        </MapContainer>
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md z-[1000]">
          <h3 className="text-sm font-medium mb-2">Map Legend</h3>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-xs">Previous locations</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="text-xs">Current location</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-blue-500 mr-2"></div>
            <span className="text-xs">Travel path</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveLocation;