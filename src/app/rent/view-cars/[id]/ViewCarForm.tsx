'use client';

import { useEffect, useState } from 'react';



interface FormData {
  carId: string;
  pickupDate: string;
  returnDate: string;
}

export default function ViewCarForm({ carId }: { carId: string }) {
  //const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({carId ,
    pickupDate: '',
    returnDate: ''
    });
  const [error, setError] = useState<string | null>(null);

  console.log('formData', formData)

  // Fetch user on mount
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await fetch('/api/auth/me');
//         if (!res.ok) throw new Error('Unauthorized');

//         const data = await res.json();
//         setUser(data);
//         setFormData((prev) => ({
//           ...prev,
//           userId: data.email, // set userId in formData
//         }));
//       } catch (err) {
//         setError('You must be logged in to book this driver.');
//       }
//     };

//     fetchUser();
//   }, []);

  if (error) return <p className="bg-white text-red-500 p-4 mt-8 border-r-2">{error}</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    try {
      const res = await fetch('/api/update-car-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit request');
      }

      alert('Request registered successfully!');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">

            <div className="flex flex-col">

        <label className="text-white">Unavailable Date</label>
        <input
          type="date"
          name="pickupDate"
          value={formData.pickupDate}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-black"
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="text-white">Back in rent Date</label>
        <input
          type="date"
          name="returnDate"
          value={formData.returnDate}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-black"
          required
        />
      </div>
</div>
      {/* <div className="flex flex-col">
        <label className="text-white">Other Message</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g...."
          className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-black"
          required
        />
      </div> */}

      <button
        type="submit"
        className="bg-red-400 mt-10 p-5"
      >
        Request a driver
      </button>
    </form>
  );
}
