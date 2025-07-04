'use client';

import React, { useEffect, useRef, useState } from 'react'
//import ImageSlider from '@/components/ImageSlider';
import JSZip from 'jszip';

export interface Sell {
  id: string;
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
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  location: string;
}


function SellRequests() {
  const [sellRequests, setSellRequests] = useState<Sell[]>([]);
  const [priceRange, setPriceRange] = useState(1000);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true)
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: { star: number; reason: string } }>({});
  const [users, setUsers] = useState<User[]>([]);
  
useEffect(() => {
  const fetchCars = async () => {
    try {
      const response = await fetch('/api/buy');
      const contentType = response.headers.get('content-type');

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setSellRequests(data.data);
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
    await Promise.all([ fetchCars(), fetchUsers()]);
    setLoading(false);
  };
  fetchAllData();
}, []);


  const [statusForm, setStatusForm] = useState<{ [key: string]: { status: string;} }>({});

  const handleUpdate = async (status: 'accept' | 'reject', rentRequestId: string) => {
    
    const sellrequest = sellRequests.find(r => r.id === rentRequestId);
  
    if (!sellrequest) {
      console.error('Rent request not found');
      return;
    }

    try {
      const res = await fetch(`/api/accept-sell-requests/${rentRequestId}`, {
         method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
        status: status,
        }),
      });

      if (!res.ok) {
      throw new Error('Failed to update rent request');
    }
  } catch (error) {
    console.error('Failed to update rent request:', error);
  }
  };

const downloadImagesAsZip = async (images: string[], carId: string) => {
  const zip = new JSZip();
  for (let i = 0; i < images.length; i++) {
    const imageUrl = images[i];
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const fileName = `image-${i + 1}.jpg`;
    zip.file(fileName, blob);
  }
  const content = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(content);
  link.download = `${carId}-images.zip`;
  link.click();
};

const [newImages, setNewImages] = useState<{ [key: string]: File[] }>({});

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, carId: string) => {
  if (e.target.files) {
    const files = Array.from(e.target.files);
    setNewImages(prev => ({
      ...prev,
      [carId]: files.slice(0, 5)  // Enforce max 5 files
    }));
  }
};

// Handle image reupload
const handleReuploadImages = async (carId: string) => {
  const files = newImages[carId];
  if (!files || files.length === 0) {
    alert('Please select at least one image');
    return;
  }
  setUploading(prev => ({ ...prev, [carId]: true }));
  try {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    const response = await fetch(`/api/sell/update-images/${carId}`, {
      method: 'PUT',
      body: formData
    });

    if (!response.ok) throw new Error('Image update failed');

    const updatedCar = await response.json();
    // Update local state
    setSellRequests(prev => 
      prev.map(car => 
        car._id === carId ? { ...car, images: updatedCar.images } : car
      )
    );
    
    // Reset file input
    if (fileInputRefs.current[carId]) {
      fileInputRefs.current[carId]!.value = '';
    }
    setNewImages(prev => {
      const newState = { ...prev };
      delete newState[carId];
      return newState;
    });

  } catch (error) {
    console.error('Error reuploading images:', error);
    alert('Failed to update images');
  } finally {
    setUploading(prev => ({ ...prev, [carId]: false }));
  }
};
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  if (loading) return <div className="text-white text-center mt-10">Loading rent-requests...</div>;
    return (
      <div className="glass-container bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg border border-white border-opacity-20 max-w-6xl w-full mx-4 p-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Rent Car Requests</h1>
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* <h1 className="text-4xl text-white font-bold mb-8 text-center">Available Cars</h1> */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {sellRequests
            .filter(rentRequest => rentRequest?.status === 'accept')
            .map(rentRequest => {
              //const matchedCar = cars.find(car => car._id === rentRequest.carId);
              const isExpanded = expandedCardId === rentRequest.id;
              const currentForm = formData[rentRequest.id] || { star: 0, reason: '' };
                return (
                    <div
                      key={rentRequest.id}
                      className="bg-white/10 border border-white/20 rounded-xl p-4 shadow-lg backdrop-blur cursor-pointer"
                      onClick={() => setExpandedCardId(prev => (prev === rentRequest.id ? null : rentRequest.id))}
                    >
                      <div className="flex flex-col lg:flex-row gap-8">
                        <div className="md:w-1/2">
                          {rentRequest?.images?.[0] && (
                            <img
                              src={rentRequest.images[0]}
                              alt={`${rentRequest.brand} ${rentRequest.model}`}
                              className="w-full h-58 object-cover rounded-lg mb-2 cursor-pointer"
                                // onClick={(e) => {
                                //   e.stopPropagation(); // Prevents triggering card expansion
                                //   setSelectedImage(rentRequest.images[0]);
                                // }}
                            />
                          )}              
                        </div>
                        <div className="md:w-1/2">
                          <h2 className="text-xl text-white font-semibold mb-1 text-center">
                            {rentRequest?.brand} {rentRequest?.model}
                          </h2>
                          <div className="grid grid-cols-2 gap-4">
                            <p className="text-white text-m mb-2">Condition : {rentRequest?.condition}</p>
                            <p className="text-white text-m mb-2">Brand : {rentRequest?.brand}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <p className="text-white text-m mb-2">Year : {rentRequest?.year} </p>
                            <p className="text-white text-m mb-2">Model : {rentRequest?.model} </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <p className="text-white text-m mb-2">Mileage : {rentRequest?.mileage}</p>
                            <p className="text-white text-m mb-2">Fuel type : {rentRequest?.fueltype}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <p className="text-white text-m mb-2">Engine Capacity: {rentRequest?.engine_capacity} </p>
                            <p className="text-white text-m mb-2">Transmission: {rentRequest?.transmission} </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <p className="text-white text-m mb-2">Body Type: {rentRequest?.body_type}</p>
                            <p className="text-white text-m mb-2">Description: {rentRequest?.status}</p>
                          </div>
                            <p className="text-white text-m mb-2">Description: {rentRequest?.description}</p>
                            <p className="text-white text-m mb-2">Mobile Number: {rentRequest?.mobileNum}</p>                            
                          </div>
                        </div>
                      <div>
                      
                      {isExpanded && (
                        <div className="mt-4 space-y-2">
                          <div>
                            <div className="mt-4 space-y-2">
                              <div onClick={(e) => e.stopPropagation()}>
                                <form
                                  onSubmit={async (e) => {
                                    e.preventDefault();
                                    const form = e.target as HTMLFormElement;
                                    const formData = new FormData(form); // Already contains files under "images"
                                      const fileInput = form.querySelector('input[type="file"]')!;
                                    const files = fileInput.files;

                                    if (!files || files.length === 0 || files.length > 5) {
                                      alert('Please select between 1 and 5 images.');
                                      return;
                                    }              
                                    // 1. Extract file names
                                    const imageNames = Array.from(files).map(file => file.name);
                                    // 2. Append names as JSON string
                                    formData.append('imageNames', JSON.stringify(imageNames));
                                    // Debug: Check ACTUAL contents (entries are visible)
                                    for (const [key, value] of formData.entries()) {
                                      console.log(key, value); // Shows "images" (File) and "imageNames" (string)
                                    }
                                    try {
                                      const response = await fetch(`/api/update-sell-images/${rentRequest.id}`, {
                                        method: 'PUT',
                                        body: formData, // ✅ Contains files + imageNames
                                      });
                                      // ... handle response ...
                                    } catch (err) {
                                      // ... handle error ...
                                    }
                                  }}
                                >
                                  <input
                                    type="file"
                                    name="images"
                                    accept="image/*"
                                    multiple
                                    className="w-full p-2 rounded bg-white/20 text-white"
                                  />
                                  <button type="submit" className="bg-yellow-500 text-white px-4 py-2 mt-2 rounded">
                                    Upload Images
                                  </button>
                                </form>
                              </div>
                              
                          </div>
                        </div>
                        <div className="flex gap-4 mt-2">
                          <button
                            className="bg-green-500 text-white px-4 py-2 rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdate('accept', rentRequest.id);
                            }}
                          >
                            Accept
                          </button>
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdate('reject', rentRequest.id);
                            }}
                          >
                            Reject
                          </button>
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={async (e) => {
                              e.stopPropagation();
                              await downloadImagesAsZip(rentRequest.images || [], rentRequest.id);
                            }}
                          >
                            Download Images
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

export default SellRequests