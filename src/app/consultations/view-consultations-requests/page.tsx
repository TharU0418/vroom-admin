'use client';

import React, { useEffect, useState } from 'react'

export interface ConsultationRequestsCard{
    id: string;
    userId: String;
    mobileNumber: String;
    message: String;
    type:String;
}

function ViewConsultationsRequests() {

    const [consultationRequests, setConsultationRequests] = useState<ConsultationRequestsCard[]>([]);
    
    

    useEffect(() => {
        const fetchConsultationRequests = async () => {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_CONSULTATION}`);
            const contentType = response.headers.get('content-type');
              
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
              
            if (contentType && contentType.includes('application/json')) {
              const data = await response.json();
              console.log('Fetched hire-requests:', data);
              setConsultationRequests(data); // ✅ Set the fetched data into state
             // setLoading(false); // ✅ Set loading to false after fetching
              console.log('hire-requests', consultationRequests)
            } else {
              throw new Error('Expected JSON response');
            }
          } catch (error) {
            console.error('Failed to fetch hire-requests:', error);
           // setLoading(false); // ✅ Ensure loading state ends even on error
          }
        };

        fetchConsultationRequests();
    }, []);

  return (
    <div className="glass-container bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg border border-white border-opacity-20 max-w-6xl w-full mx-4 p-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">View Consultations Requests</h1>
          <div className="flex flex-col lg:flex-row gap-8">
          </div>
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {consultationRequests.map(consultationRequest => {
               // const matchedCar = drivers.find(car => car._id === hireRequests.driverId);
                //const isExpanded = expandedCardId === hireRequests._id;
                //const currentForm = formData[hireRequests._id] || { star: 0, reason: '' };
                  return (
                    <div
                      key={consultationRequest.id}
                      className="bg-white/10 border border-white/20 rounded-xl p-4 shadow-lg backdrop-blur cursor-pointer"
                 //     onClick={() => setExpandedCardId(prev => (prev === hireRequests._id ? null : hireRequests._id))}
                    >
                      <div className="flex flex-col lg:flex-row gap-8">
                        {/* <div className="md:w-1/2">
                          {matchedCar?.images?.[0] && (
                            <img
                              src={matchedCar.images[0]}
                              alt={`${matchedCar.brand} ${matchedCar.model}`}
                              className="w-full h-58 object-cover rounded-lg mb-2"
                            />
                          )}
                        </div> */}
                        <div className="md:w-1/2">
                          <h2 className="text-xl text-white font-semibold mb-1">
                            {/* {matchedCar ? `${matchedCar.fullname}` : 'Car not found'} */}
                            {consultationRequest?.type}
                          </h2>
                          <p className="text-white text-m mb-2">User Name:{consultationRequest?.userId}</p>
                      
                          <p className="text-white text-m mb-2">Mobile Number: {consultationRequest?.mobileNumber} </p>

                          <p className="text-white text-m mb-2">Message {consultationRequest?.message}</p>
                        </div>
                      </div>
                      <div>
                        
                      </div>
                    </div>
                  );
              })}
            </div>
          </div>
      </div>
  )
}

export default ViewConsultationsRequests