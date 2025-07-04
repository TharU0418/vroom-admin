'use client';

import React, { useEffect, useRef, useState } from 'react'
//import ImageSlider from '@/components/ImageSlider';
import JSZip from 'jszip';
import { saveAs } from "file-saver";

export interface Sell {
  id: string;
  status: string
}
export interface CarCard {
  id: string;
  district: string;
  city:string;
  brand: string;
  model: string;
  price: number;
  year: number;
  images: string[];
  location?: string;
  description?: string; // ← Add this if it's used
  report:String
}
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  location: string;
}


function ViewSellCars() {
  const [sellRequests, setSellRequests] = useState<Sell[]>([]);
  const [priceRange, setPriceRange] = useState(1000);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true)
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: { report: string } }>({});
  const [users, setUsers] = useState<User[]>([]);
    const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
 // const [sellCar, setSellCar] = useState<RequestsCard[]>([]);

useEffect(() => {
  const fetchCars = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_BUY}`);
      const contentType = response.headers.get('content-type');

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setSellRequests(data);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_BUY}`, {
         method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
          id:rentRequestId,
        status: status,
        }),
      });

       setNotificationMessage(`Request Status successfully! ${status}`);
      setShowNotification(true);
      
      setTimeout(() => setShowNotification(false), 3000);

      if (!res.ok) {
      throw new Error('Failed to update rent request');
    }
  } catch (error) {
    console.error('Failed to update rent request:', error);
  }
  };


const downloadImagesAsZip = async (images: string[], carId: string) => {

//const downloadImagesAsZip = async ({}) => {
  console.log('images. ', images)
//   const zip = new JSZip();
//   for (let i = 0; i < images.length; i++) {
//     const imageUrl = images[i];
//     const response = await fetch(imageUrl);
//     const blob = await response.blob();
//     const fileName = `image-${i + 1}.jpg`;
//     zip.file(fileName, blob);
//   }
//   const content = await zip.generateAsync({ type: 'blob' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(content);
//  // link.download = `${carId}-images.zip`;
//   link.download = `images.zip`;

//   link.click();
const zip = new JSZip();
    const folder = zip.folder("car-images");

    for (let i = 0; i < images.length; i++) {
      try {
        const response = await fetch(images[i]);
        const blob = await response.blob();

        // Get file extension and create a filename
        const ext = images[i].split('.').pop().split('?')[0]; // handles URLs with query params
        folder.file(`image${i + 1}.${ext}`, blob);
      } catch (err) {
        console.error("Error downloading image:", err);
      }
    }

    zip.generateAsync({ type: "blob" }).then((zipFile) => {
      saveAs(zipFile, "car-images.zip");
    });
};


const [newImages, setNewImages] = useState<{ [key: string]: File[] }>({});

const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const Notification = () => (
    <div className="fixed bottom-4 right-4 z-50">
      
      <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out animate-fadeInUp">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span className="font-semibold">{notificationMessage}</span>
        </div>
      </div>
    </div>
  );

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, carId: string) => {
  if (e.target.files) {
    const files = Array.from(e.target.files);
    setNewImages(prev => ({
      ...prev,
      [carId]: files.slice(0, 5)  // Limit to 5 images
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
    // Convert files to base64
    const base64Images = await Promise.all(
      files.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );

    console.log('Sending base64 images for car ID:', carId);
    console.log(base64Images);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_BUY}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: carId,
        images: base64Images,
      }),
    });

    if (!response.ok) throw new Error('Image update failed');

    const updatedCar = await response.json();

    // Update local state
    setSellRequests(prev => 
      prev.map(car => 
        car.id === carId ? { ...car, images: updatedCar.images } : car
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

    
  const handleUpdate2 = async (rentRequestId: string) => {
  const sellRequest = sellRequests.find(r => r.id === rentRequestId);
  if (!sellRequest) {
    console.error('Sell request not found');
    return;
  }

  console.log('formData formData', formData[rentRequestId]?.reason)
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_BUY}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id:rentRequestId,
        report: formData[rentRequestId]?.reason,
      }),
    });

    setNotificationMessage('Vechicle Reort Upload successfully!');
      setShowNotification(true);
      
      setTimeout(() => setShowNotification(false), 3000);

    if (!res.ok) {
      throw new Error('Failed to update rent request');
    }
  } catch (error) {
    console.error('Failed to update rent request:', error);
  }
};


  

  if (loading) return <div className="text-white text-center mt-10">Loading rent-requests...</div>;
    return (
      <div className="glass-container bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg border border-white border-opacity-20 max-w-6xl w-full mx-4 p-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Rent Car Requests</h1>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {sellRequests
            //.filter(rentRequest => rentRequest?.status === 'pending')
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
                          <p className="text-white text-m mb-2">Location : {rentRequest?.district}, {rentRequest?.city}</p>
                        </div>
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
                              >
                                <input
                                  type="file"
                                  name="images"
                                  accept="image/*"
                                  multiple
                                  className="w-full p-2 rounded bg-white/20 text-white"
                                    onChange={(e) => handleFileChange(e, rentRequest.id)}
                                />
                                <button 
  onClick={(e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Optional, prevents click bubbling
    handleReuploadImages(rentRequest.id);
  }}
  className="bg-yellow-500 text-white px-4 py-2 mt-2 rounded"
  type="submit"
>
  Upload Images 12
</button>
                         
                              </form>

                                                        </div>
<div>
  <input
                                type="text"
                                placeholder="Reason"
                                className="w-full p-2 rounded bg-white/20 text-white"
                                //value={currentForm.reason}
                                onClick={(e) => e.stopPropagation()} // 🔥 Prevent collapse
                                onChange={(e) =>
                                setFormData(prev => ({
                                  ...prev,
                                  [rentRequest.id]: { ...currentForm, reason: e.target.value }
                                }))
                                }
                              />

                              <button
                                  className="bg-green-500 text-white px-4 py-2 rounded"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdate2( rentRequest.id);
                                  }}
                                >
                                  Submit Report
                                </button>
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
                              await downloadImagesAsZip(rentRequest.images || [], rentRequest._id);
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
                          {showNotification && <Notification />}

      </div>
    )
}

export default ViewSellCars