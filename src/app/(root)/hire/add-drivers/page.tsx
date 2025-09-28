'use client';

//import { FileUpload } from '@/components/ui/file-upload';
import React, { useState } from 'react';
import { locations } from '../../../../../public/data/location';

function AddDrivers() {
  const [formData, setFormData] = useState({
     district: '',
    city: '',
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

  const handleTourTypeChange = (type) => {
  setFormData((prev) => {
    const tour_types = prev.tour_types.includes(type)
      ? prev.tour_types.filter((t) => t !== type)
      : [...prev.tour_types, type];
    return { ...prev, tour_types };
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
   const districts = Object.keys(locations);
   const cities = formData.district && formData.district in locations
     ? locations[formData.district as keyof typeof locations]
     : [];

     const tourTypes = [
  { value: 'one-time', label: 'One Time' },
  { value: 'full-day', label: 'Multi Day' },
  { value: 'long-term', label: 'Long Term' },
  { value: 'drinkdrive', label: 'Drunk & Drive' },
  { value: 'lady-one-time', label: 'One Time (Lady)' },
  { value: 'lady-full-day', label: 'Multi Day (Lady)' },
  { value: 'lady-long-term', label: 'Long Term (Lady)' },
  { value: 'lady-drinkdrive', label: 'Drunk & Drive (Lady)' },
];

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
  <div className="flex flex-wrap gap-4 text-white">
    {tourTypes.map(({ value, label }) => (
      <label key={value} className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formData.tour_types.includes(value)}
          onChange={() => handleTourTypeChange(value)}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        <span>{label}</span>
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
