'use client';

import Image from 'next/image';
//import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function SignIn() {

    const [formData, setFormData] = useState({
      
        email: '',
        password: '',
      });
    
    //   const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     // Handle form submission
    //     console.log(formData);
    //   };

      const router = useRouter(); // ✅ router for redirect

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
console.log(formData);
  try {
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    alert('Logged in successfully!');
    router.push('/');
    // You can redirect or store token here
  } catch (err: any) {
    alert(`Error: ${err.message}`);
  }
};


  return (
    // <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#f96c6c] to-[#f60f0f] p-4"> 
        <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-[#f96c6c] to-[#f60f0f] p-8"> 

      {/* from-blue-500 to-purple-600 */}
      <div className="glass-container bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg border border-white border-opacity-20 max-w-6xl w-full mx-4 p-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          

          {/* Left Side - Form */}
          <div className="md:w-1/2 mt-40">
                  <h1 className="text-4xl font-bold text-black mb-8 text-center">Welcome Back</h1>

            <form onSubmit={handleSubmit} className="space-y-6">

    

              {/* Car Brand Dropdown */}
              <div>
                <label className="block text-white mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-gray-200"
                  placeholder="Enter your second name"
                  required
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
            

                <div>
                  <label className="block text-white mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-gray-200"
                    placeholder="Enter your second name"
                    required
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

             

              {/* Date Inputs */}
               

              {/* Terms Checkbox */}
              {/* <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 border-white/30 rounded bg-white/20"
                  required
                  onChange={(e) => setFormData({...formData, terms: e.target.checked})}
                />
                <label className="ml-2 text-white">I accept rental terms</label>
              </div> */}
           

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-lg hover:opacity-90 transition-all"
              >
                Sign In
              </button>
            </form>
          </div>

   

          {/* Left Side - Image Card */}
          <div className="md:w-1/2">
            <div className="glass-container bg-white bg-opacity-15 rounded-xl p-2 h-full">
              <div className="relative h-full rounded-lg overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Luxury Car"
                  className="w-full h-full object-cover"
                  height={100}
                  width={100}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SignIn