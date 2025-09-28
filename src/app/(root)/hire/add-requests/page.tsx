'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

interface FormData {
  userId: string;
  pickupTime: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  message: string;
  type: string;  // Set 'full-day' type in the interface
  status:string;
}

function AddRequests() {
    const [formData, setFormData] = useState<FormData>({
  userId: '',
  pickupDate: '',
  returnDate: '',
  pickupTime: '',
  pickupLocation: '',
  message: '',
  type: 'full-day',  // Set default type value to 'full-day',
  status:'pending'
});

const router = useRouter();

const [loading, setLoading] = useState(false);
    
  const consultationTypes = ['full-day', 'one-time', 'drinkdrive', 'long-term'];

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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_HIRE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit request');
      }
      alert(`Request added successful`);


   } catch (error: unknown) {
  if (error instanceof Error) {
    alert(`Error: ${error.message}`);
  } else {
    alert('An unknown error occurred');
  }
}finally{
  setLoading(false);
}
  };

  return (
       <form onSubmit={handleSubmit} className="mt-8 space-y-4">
  <div className="flex flex-col">
  <label className="block text-white font-medium mb-2">
    Consultation Type <span className="text-red-600">*</span>
  </label>
 <select
  name="type"
  value={formData.type}
  onChange={(e) =>
    setFormData((prev) => ({ ...prev, type: e.target.value }))
  }
  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent"
  required
>
  {tourTypes.map(({ value, label }) => (
    <option key={value} value={value}>
      {label}
    </option>
  ))}
</select>
</div>

                <div className="flex flex-col">
                  <label className="block text-white font-medium mb-2">
                    Email/Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="userId"
                   // type="text"
                    onChange={handleChange}
                    value={formData.userId}
                    placeholder="Enter Customer email/full name"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder-gray-500"
                    required
                  />
                </div>

               

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-white">Pickup Date</label>
              <input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder-gray-500"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-white">Return Date</label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder-gray-500"
               // required
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-white">Pickup Time</label>
            <input
              type="time"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder-gray-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-white">Pickup Location</label>
            <textarea
              name="pickupLocation"
              rows={2}
              value={formData.pickupLocation}
              onChange={handleChange}
              placeholder="e.g. colombo"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder-gray-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-white">Message</label>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="I want ..."
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder-gray-500"
              required
            />
          </div>

          {/* Only show the button if the user is logged in */}
            <div className="flex justify-center items-center">
              <button
  type="submit"
  disabled={loading}
  className={`bg-red-800 text-white py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 ${
    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-900'
  }`}
>
  {loading ? 'Submitting...' : 'Request the driver'}
</button>

            </div>
        
       
        </form>
  )
}

export default AddRequests