'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

interface FormData {
  userId: string;
  name: string;
  mobileNumber: string;
  message: string;
  type: string;
}


function AddConsultationsRequests() {

    const [formData, setFormData] = useState<FormData>({
    userId:'',
    name: '',
    mobileNumber: '',
    message: '',
    type: 'Full'
  });

const [loading, setLoading] = useState(false);
const router = useRouter();
const consultationTypes = ['All', 'Full', 'Leasing', 'Register', 'Insurence'];

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('formData',formData)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_CONSULTATION}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...formData }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit request');
      }

  
       // Reset form
      setFormData(prev => ({
        ...prev,
        message: '',
        ...({ name: '', mobileNumber: '' }) // Clear fields if not logged in
      }));
      
      router.push('/consultations/view-consultations-requests')
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('An unexpected error occurred.');
      }
    }finally{
          setLoading(false);

    }
  };

  return (
    <div>

         <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Name and mobile fields only for non-logged-in users */}
            {/* {!user && ( */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
  <label className="block text-gray-700 font-medium mb-2">
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
    {consultationTypes.map((type) => (
      <option key={type} value={type}>
        {type}
      </option>
    ))}
  </select>
</div>

                <div className="flex flex-col">
                  <label className="block text-gray-700 font-medium mb-2">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    //value={user.email}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder-gray-500"
                    required
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="block text-gray-700 font-medium mb-2">
                    Mobile Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="mobileNumber"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder-gray-500"
                    required
                    maxLength={10}
                  />
                </div>
              </div>
            {/* )} */}
            
            <div className="flex flex-col">
              <label className="block text-gray-700 font-medium mb-2">
                Message <span className="text-red-600">*</span>
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your vehicle needs..."
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder-gray-500"
                required
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                  disabled={loading}

className={`bg-red-800 text-white py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 ${
    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-900'
  }`}              >
                 {loading ? 'Submitting...' : ' Request Consultation'}

              </button>
            </div>
          </form>
    </div>
  )
}

export default AddConsultationsRequests