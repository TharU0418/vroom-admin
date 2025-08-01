'use client';

//import { FileUpload } from '@/components/ui/file-upload';
import React, { useState } from 'react';

function AddDrivers() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    contact: '',
    experience: '',
    star: '',
    description: '',
    tour_types: [] as string[],  // <-- Added
  });

  //const [files, setFiles] = useState<File[]>([]);

  // const handleFileUpload = (files: File[]) => {
  //   setFiles(files);
  // };

  const handleTourTypeChange = (type: string) => {
    setFormData((prevData) => {
      const updatedTourTypes = prevData.tour_types.includes(type)
        ? prevData.tour_types.filter((t) => t !== type)
        : [...prevData.tour_types, type];
      return { ...prevData, tour_types: updatedTourTypes };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => data.append(key, v));
      } else {
        data.append(key, value);
      }
    });

    // files.forEach(file => {
    //   data.append('images', file);
    // });

    console.log('data', formData)

   

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_DRIVERS}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData),
});

    if (res.ok) {
      const result = await res.json();
      alert('Driver added successfully!');
    } else {
      alert('Failed to add car');
    }

    
  };

  return (
    <div className="glass-container bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg border border-white border-opacity-20 max-w-6xl w-full mx-4 p-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center"> Add a Driver to hire</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-white mb-2">Full Name</label>
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-gray-200"
            placeholder="Enter Driver Name"
            required
            value={formData.fullname}
            onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-white mb-2">Email</label>
          <input
            type="email"
            className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-gray-200"
            placeholder="Enter email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        {/* Contact */}
        <div>
          <label className="block text-white mb-2">Contact Number</label>
          <input
            type="number"
            className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-gray-200"
            placeholder="Enter contact number"
            required
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          />
        </div>

        {/* Star and Experience */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2">Star</label>
            <select
              className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-black"
              required
              value={formData.star}
              onChange={(e) => setFormData({ ...formData, star: e.target.value })}
            >
              <option value="">Select Star</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white mb-2">Experience</label>
            <select
              className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-black"
              required
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            >
              <option value="">Select Experience Years</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-white mb-2">Description</label>
          <textarea
            className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-gray-200"
            placeholder="More about the driver"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
        </div>

        {/* Tour Type Checkboxes */}
        <div>
          <label className="block text-white mb-2">Tour Type</label>
          <div className="flex gap-4 text-white">
            {['one-time', 'full-day', 'long-term', 'drinkdrive'].map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.tour_types.includes(type)}
                  onChange={() => handleTourTypeChange(type)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* File Upload */}
        {/* <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
          <FileUpload onChange={handleFileUpload} />
        </div> */}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-lg hover:opacity-90 transition-all"
        >
          Submit Listing
        </button>
      </form>
    </div>
  );
}

export default AddDrivers;
