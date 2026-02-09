
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { AppScreen } from '../types';

const NavigationScreen: React.FC = () => {
  const { setScreen, selectedStation } = useApp();
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setArrived(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-100 relative">
      {/* Mock Navigation Map */}
      <div className="flex-1 relative" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 0)', backgroundSize: '32px 32px' }}>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
               <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center animate-ping"></div>
               <div className="absolute inset-0 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
               </div>
            </div>
         </div>

         {/* Station Marker */}
         <div className="absolute top-1/4 left-1/3">
            <div className="bg-black text-white p-2 rounded-xl shadow-xl flex items-center gap-2">
               <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14H11V21L20 10H13Z" /></svg>
               <span className="text-xs font-bold">{selectedStation?.name}</span>
            </div>
            <div className="w-2 h-2 bg-black rotate-45 mx-auto -mt-1"></div>
         </div>
      </div>

      {/* Navigation Info */}
      <div className="bg-white p-6 pb-10 rounded-t-[3rem] shadow-2xl relative z-20">
         <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-6"></div>
         <div className="flex justify-between items-center mb-8">
            <div>
               <h2 className="text-2xl font-black text-gray-900">2.5 Km <span className="text-gray-400 font-medium text-lg">your destination</span></h2>
               <p className="text-sm text-gray-400 font-medium">Estimated arrival: 8 mins</p>
            </div>
            <button className="bg-green-50 p-4 rounded-2xl text-green-500 hover:bg-green-100 transition-all">
               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
               </svg>
            </button>
         </div>

         <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
               <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-100"></div>
               <span className="text-sm font-bold text-gray-700">{selectedStation?.address}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
               <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-100"></div>
               <span className="text-sm font-bold text-gray-700">Your current location</span>
            </div>
         </div>

         <button 
           onClick={() => setScreen(AppScreen.HOME)}
           className="w-full mt-8 border-2 border-green-500 text-green-500 py-4 rounded-3xl font-black hover:bg-green-50 transition-all"
         >
            Cancel navigation
         </button>
      </div>

      {/* Arrival Dialog */}
      {arrived && (
         <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-8">
            <div className="bg-white rounded-[3rem] p-8 text-center space-y-6 animate-scale-up shadow-2xl w-full">
               <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-100">
                  <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
               </div>
               <h2 className="text-3xl font-black text-gray-900">You have arrived</h2>
               <p className="text-gray-400 text-sm">You have reached your destination. Thank you for using our services.</p>
               <button 
                 onClick={() => setScreen(AppScreen.QR_SCAN)}
                 className="w-full bg-green-500 text-white py-4 rounded-3xl font-bold shadow-lg shadow-green-200 hover:bg-green-600 transition-all"
               >
                  Start Charging
               </button>
               <button 
                 onClick={() => setArrived(false)}
                 className="text-gray-400 font-bold text-sm"
               >
                  Dismiss
               </button>
            </div>
         </div>
      )}
    </div>
  );
};

export default NavigationScreen;
