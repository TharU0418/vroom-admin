'use client';

import { FileUpload } from '@/components/ui/file-upload';
import React, { useState } from 'react';
import { locations } from '../../../../../public/data/location';

function AddCars() {
  const [formData, setFormData] = useState({
    district: '',
    city: '',
    type: '',
    brand: '',
    year: '',
    model: '',
    mileage: '',
    fueltype: '',
    engine_capacity: '',
    transmission: '',
    body_type: '',
    price: '',
    description: '',
  });

  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (files.length !== 5) {
    alert('Please upload exactly 5 images.');
    return;
  }

  try {
    const imageBase64Array = await Promise.all(
      files.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file); // Will return base64 with `data:image/...` prefix
        });
      })
    );

    const payload = {
      ...formData,
      images: imageBase64Array,
      availability: true,
      bookedDates: [],
      userName: "test_user" // replace with real user if available
    };


    console.log('payload', payload)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_RENT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const result = await res.json();
      alert('Car added successfully!');
    } else {
      const error = await res.text();
      console.error('Error:', error);
      alert('Failed to add car.');
    }
  } catch (err) {
    console.error('Upload error:', err);
    alert('Something went wrong. See console.');
  }
};


  const currentYear = new Date().getFullYear();
  const startYear = 1990;
  const years = Array.from(new Array(currentYear - startYear + 1), (_, i) => currentYear - i);

  const districts = Object.keys(locations);
const cities = formData.district && formData.district in locations
  ? locations[formData.district as keyof typeof locations]
  : [];

  return (
    <div className="glass-container bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg border border-white border-opacity-20 max-w-6xl w-full mx-4 p-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Add a Car to Rent</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2">Select District</label>
            <select
              value={formData.district}
              onChange={(e) =>
                setFormData({ ...formData, district: e.target.value, city: '' })
              }
              className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-black"
              required
            >
              <option value="">-- Choose a District --</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>

            <label className="block text-white mb-2 mt-4">Select City</label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-black"
              required
              disabled={!formData.district}
            >
              <option value="">-- Choose a City --</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Car Type Dropdown */}
        <div>
          <label className="block text-white mb-2">Car Type</label>
          <select
            className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-black"
            required
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          >
            <option value="">Select Type</option>
            <option value="Luxury">Luxury Sedan</option>
            <option value="SUV">Premium SUV</option>
            <option value="Sports">Sports Car</option>
            <option value="Electric">Electric Vehicle</option>
          </select>
        </div>

        {/* Car Brand Dropdown */}
        <div>
          <label className="block text-white mb-2">Car Brand</label>
          <select
            className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-black"
            required
            value={formData.brand}
            onChange={(e) => setFormData({...formData, brand: e.target.value})}
          >
            <option value="">Select Car Brand</option>
            <option value="Toyota">Toyota</option>
            <option value="Honda">Honda</option>
            <option value="BMW">BMW</option>
            <option value="Ford">Ford</option>
            <option value="Audi">Audi</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
          </select>
        </div>
        {/* Year and Model */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2">Manufacture Year</label>
            <select
              className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-black"
              required
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white mb-2">Model</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-black placeholder-black"
              placeholder="Enter model"
              required
              value={formData.model}
              onChange={(e) => setFormData({...formData, model: e.target.value})}
            />
          </div>
        </div>
        {/* Mileage and Fuel Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2">Mileage (km)</label>
            <input
              type="number"
              className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-black placeholder-black"
              placeholder="Enter mileage"
              required
              value={formData.mileage}
              onChange={(e) => setFormData({...formData, mileage: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-white mb-2">Fuel Type</label>
            <select
              className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-black"
              required
              value={formData.fueltype}
              onChange={(e) => setFormData({...formData, fueltype: e.target.value})}
            >
              <option value="">Select Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>
        {/* Engine and Transmission */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2">Engine Capacity</label>
            <input
              type="number"
              className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-black placeholder-black"
              placeholder="Enter engine capacity"
              required
              value={formData.engine_capacity}
              onChange={(e) => setFormData({...formData, engine_capacity: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-white mb-2">Transmission</label>
            <select
              className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-black"
              required
              value={formData.transmission}
              onChange={(e) => setFormData({...formData, transmission: e.target.value})}
            >
              <option value="">Select Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
        </div>
        {/* Body Type and Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2">Body Type</label>
            <select
              className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-black"
              required
              value={formData.body_type}
              onChange={(e) => setFormData({...formData, body_type: e.target.value})}
            >
              <option value="">Select Body Type</option>
              <option value="Sedan">Sedan</option>
              <option value="Suv">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Coupe">Coupe</option>
            </select>
          </div>
          <div>
            <label className="block text-white mb-2">Price</label>
            <input
              type="number"
              className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-black placeholder-black"
              placeholder="Enter price"
              required
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
          </div>
        </div>
        {/* Description */}
        <div>
          <label className="block text-white mb-2">Description</label>
          <textarea
            className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-black placeholder-black"
            placeholder="More about your car"
            required
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
          />
        </div>

        {/* File Upload */}
        <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
          <FileUpload onChange={handleFileUpload} />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-6 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg hover:opacity-90 transition-all"
        >
          Submit Listing
        </button>
      </form>
    </div>
  )
}

export default AddCars