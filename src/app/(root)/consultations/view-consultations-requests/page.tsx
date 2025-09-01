'use client';

import React, { useEffect, useState } from 'react';

export interface ConsultationRequestsCard {
    id: string;
    userId: string;
    mobileNumber: string;
    message: string;
    type: string;
    status: string;
}

const consultationTypes = ['All', 'Full', 'Leasing', 'Register', 'Insurence'];

function ViewConsultationsRequests() {
    const [consultationRequests, setConsultationRequests] = useState<ConsultationRequestsCard[]>([]);
    const [selectedType, setSelectedType] = useState<string>('All');

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
                    const filteredCars = data.filter((caersData1: { status: string }) => 
            caersData1.status === 'pending'
        );
                    setConsultationRequests(filteredCars);
                } else {
                    throw new Error('Expected JSON response');
                }
            } catch (error) {
                console.error('Failed to fetch consultation-requests:', error);
            }
        };

        fetchConsultationRequests();
    }, []);

    const handleStatusUpdate = async (id: string, status: 'on-going') => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_CONSULTATION}`, {
                method: 'PATCH', // or 'POST' depending on your API
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                   id:id,
                   status: status, }),
                   
            });
            if (!response.ok) {
                throw new Error('Failed to update status');
            }
      alert(`${status.toUpperCase()} successful`);

            // Update local state
            setConsultationRequests(prev =>
                prev.map(req => (req.id === id ? { ...req, status } : req))
            );
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const filteredRequests =
        selectedType === 'All'
            ? consultationRequests
            : consultationRequests.filter(request => request.type === selectedType);

    return (
        <div className="glass-container bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg border border-white border-opacity-20 max-w-6xl w-full mx-4 p-8">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">View Consultations Requests</h1>

            {/* Dropdown Filter */}
            <div className="mb-6 text-white">
                <label htmlFor="typeFilter" className="mr-4 font-semibold">Filter by Type:</label>
                <select
                    id="typeFilter"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="text-white px-4 py-2 rounded bg-gray-700"
                >
                    {consultationTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {filteredRequests.map((consultationRequest) => (
                        <div
                            key={consultationRequest.id}
                            className="bg-white/10 border border-white/20 rounded-xl p-4 shadow-lg backdrop-blur"
                        >
                            <div className="flex flex-col lg:flex-row gap-8">
                                <div className="md:w-1/2">
                                    <h2 className="text-xl text-white font-semibold mb-1">{consultationRequest.type}</h2>
                                    <p className="text-white mb-2">User Name: {consultationRequest.userId}</p>
                                    <p className="text-white mb-2">Mobile Number: {consultationRequest.mobileNumber}</p>
                                    <p className="text-white mb-2">Message: {consultationRequest.message}</p>
                                    <p className="text-white mb-2">Status: {consultationRequest.status || 'pending'}</p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <button
                                        onClick={() => handleStatusUpdate(consultationRequest.id, 'on-going')}
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    >
                                        Accept
                                    </button>
                                    {/* <button
                                        onClick={() => handleStatusUpdate(consultationRequest.id, 'rejected')}
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                    >
                                        Reject
                                    </button> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ViewConsultationsRequests;
