
import React from 'react';
import { useApp } from '../App';
import { AppScreen } from '../types';

const MyVehicles: React.FC = () => {
  const { setScreen, userVehicles } = useApp();
  const vehicle = userVehicles[0];

  return (
    <div className="flex flex-col h-full bg-white p-6 pt-12 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
         <button onClick={() => setScreen(AppScreen.PROFILE)} className="p-3 border border-gray-100 rounded-2xl hover:bg-gray-50">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
         </button>
         <h1 className="text-xl font-bold">My vehicle</h1>
         <div className="w-12"></div>
      </div>

      <div className="flex-1 space-y-10">
         <div className="relative">
            <img src={vehicle.imageUrl} className="w-full h-48 object-contain" alt="vehicle" />
            <div className="absolute top-0 right-0 bg-green-500 text-white p-2 rounded-xl text-[10px] font-bold shadow-lg">DEFAULT</div>
         </div>

         <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
            <h2 className="text-2xl font-black text-gray-900">{vehicle.brand} {vehicle.model}</h2>
            
            <div className="grid grid-cols-2 gap-y-6">
               {[
                 { label: 'Name', value: `${vehicle.brand} ${vehicle.model}` },
                 { label: 'Battery', value: `${vehicle.batteryLevel}%` },
                 { label: 'Location', value: 'Parked' },
                 { label: 'Top speed', value: '192 Mph' },
                 { label: 'Transmission', value: 'Automatic' },
                 { label: 'Charging port', value: vehicle.chargingPort },
               ].map(item => (
                  <div key={item.label}>
                     <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">{item.label}</p>
                     <p className="text-sm font-black text-gray-800">{item.value}</p>
                  </div>
               ))}
            </div>
         </div>

         <div className="flex gap-4">
            <button className="flex-1 border-2 border-red-500 text-red-500 py-4 rounded-3xl font-bold hover:bg-red-50 transition-all">
               Delete vehicle
            </button>
            <button className="flex-1 bg-green-500 text-white py-4 rounded-3xl font-bold shadow-xl shadow-green-100 hover:bg-green-600 transition-all">
               Edit details
            </button>
         </div>
      </div>

      <button className="w-full mt-6 bg-green-50 text-green-500 py-4 rounded-3xl font-bold border border-green-100 hover:bg-green-100 transition-all">
         Add new vehicle
      </button>
    </div>
  );
};

export default MyVehicles;
