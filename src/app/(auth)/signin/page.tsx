'use client';

import Image from 'next/image';
//import { useAuth } from '../../../store/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
//import { useRouteGuard } from '@/hooks/useRouteGuard';

function SignIn() {


  const [formData, setFormData] = useState({    
    email: '',
    password: '',
  });
    
  const [showNotification, setShowNotification] = useState(false);
const [notificationMessage, setNotificationMessage] = useState('');

   // useRouteGuard({ redirectIfAuth: true, redirectTo: '/' });

 const router = useRouter();
  //const { setUser } = useAuth();
  //const [error, setError] = useState('');

 const handleSubmit = async (e: React.FormEvent) => {

  console.log('ev',formData.email)

  if (formData.email !== 'adminvroomvroom@gmail.com') {
  setNotificationMessage('Wrong Email');
  setShowNotification(true);
  setTimeout(() => setShowNotification(false), 5000);
  return;
}


    e.preventDefault();
  try {
const res = await fetch('/api/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
   // credentials: 'include',
  });


  const data = await res.json();
  if (!res.ok){
    setNotificationMessage(data.message);
  setShowNotification(true);
  setTimeout(() => setShowNotification(false), 5000);
   }
          console.log('data',data)

          
  if (!res.ok) throw new Error(data.error || 'Login failed');

     const { email } = data;

 
 localStorage.setItem('userEmail', email);

  

  router.push('/');
} catch (err) {
  const message = err instanceof Error ? err.message : 'Unknown error';
  console.log('mess', message)
  // setNotificationMessage(message);
  // setShowNotification(true);
  // setTimeout(() => setShowNotification(false), 5000);
}
  };


    const Notification = () => (
      <div className="fixed bottom-4 right-4 z-50">
        
        <div className="bg-red-500 text-white px-8 py-6 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out animate-fadeInUp">
          <div className="flex items-center">
            
            <span className="font-semibold text-xl">{notificationMessage}</span>
          </div>
        </div>
      </div>
    );

  


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 via-red-700 to-red-900 p-4"> 
      <div className="glass-container bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg border border-white border-opacity-20 max-w-6xl w-full mx-4 p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Side - Form */}
          <div className="md:w-1/2">
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
              
              <p className="text-white  text-sm font-medium">
                Don&apos;t Have an Account ?  <Link href="register">
               
                  Sign Up
              </Link>
              </p> 
              
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
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Luxury Car"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
                              {showNotification && <Notification />}

    </div>
  )
}

export default SignIn
