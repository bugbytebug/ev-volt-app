import React from 'react';
import { useApp } from '../App';
import { AppScreen } from '../types';

const StationDetail: React.FC = () => {
  const { selectedStation, setScreen } = useApp();

  if (!selectedStation) return null;

  // We treat it as 'any' so we can use custom columns from your Google Sheet
  const s = selectedStation as any;

  // NEW LOGIC: This takes your Google Sheet 'attractions' cell (e.g., "Park, Cafe, Gym")
  // and turns it into a list. If the cell is empty, it uses the fallback list.
  const attractionsList = s.attractions 
    ? s.attractions.split(',').map((item: string) => item.trim()) 
    : ["Local Café", "Shopping Mall", "Public Park"];

  const chargers = s.chargers || [
    { id: '1', type: 'Level 2', capacity: '22kW', isAvailable: s.status === 'Available' },
    { id: '2', type: 'DC Fast', capacity: '50kW', isAvailable: false }
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header Image Area */}
      <div className="relative h-64">
         <img 
           src={s.imageUrl || `https://picsum.photos/seed/${s.id}/800/600`} 
           className="w-full h-full object-cover" 
           alt="station" 
         />
         <button 
           onClick={() => setScreen(AppScreen.HOME)}
           className="absolute top-12 left-6 bg-white/20 backdrop-blur p-3 rounded-2xl text-white hover:bg-white/40 transition-all shadow-lg"
         >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
         </button>
         <div className="absolute bottom-4 left-6 bg-green-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">
           {s.status || 'Verified Spot'}
         </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-start">
           <div>
              <h1 className="text-2xl font-black text-gray-900 leading-tight">{s.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                 <span className={`w-2 h-2 rounded-full ${s.status === 'Available' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                 <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                   {s.status === 'Available' ? 'Active & Available' : 'Currently Busy'}
                 </p>
              </div>
           </div>
           <div className="text-right">
              <span className="text-gray-900 font-black text-lg block">{s.distance || '0.5km'}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Away</span>
           </div>
        </div>

        {/* Pricing & Address Card */}
        <div className="bg-gray-50 p-5 rounded-[2rem] border border-gray-100 space-y-4">
           <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-bold">Charging Rate</span>
              <span className="text-gray-900 font-black">{s.cost || 'FREE'}</span>
           </div>
           <div className="flex justify-between items-start text-sm gap-4">
              <span className="text-gray-400 font-bold shrink-0">Exact Address</span>
              <span className="text-gray-900 font-bold text-right leading-relaxed">{s.address}</span>
           </div>
        </div>

        {/* Attractions Section - UPDATED to use attractionsList */}
        <div>
           <h3 className="font-black text-gray-900 text-lg mb-4 flex items-center gap-2">
              <span className="text-xl">🏙️</span> Attractions Nearby
           </h3>
           <div className="grid grid-cols-2 gap-3">
              {attractionsList.map((attraction: string, idx: number) => (
                 <div key={idx} className="bg-blue-50/50 p-4 rounded-3xl border border-blue-100 flex flex-col items-start gap-2">
                    <span className="text-[11px] font-black text-gray-800 uppercase leading-tight">{attraction}</span>
                    <span className="text-[9px] font-bold text-blue-400 uppercase tracking-tight">Walking distance</span>
                 </div>
              ))}
           </div>
        </div>

        {/* Charging Slots Section */}
        <div className="space-y-4">
           <div className="flex justify-between items-center">
              <h3 className="font-black text-gray-900 text-lg">Charging Slots</h3>
              <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg uppercase">Cloud Sync</span>
           </div>
           <div className="space-y-3 pb-4">
              {chargers.map((c: any) => (
                 <div key={c.id} className="bg-white p-5 rounded-[2rem] border border-gray-100 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                       <div className={`${c.isAvailable ? 'bg-green-500' : 'bg-gray-400'} p-3 rounded-2xl shadow-lg`}>
                          <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                             <path d="M13 10V3L4 14H11V21L20 10H13Z" />
                          </svg>
                       </div>
                       <div>
                          <p className="font-black text-gray-900">{c.type}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{c.capacity}</p>
                       </div>
                    </div>
                    <p className={`text-[10px] font-black px-3 py-1.5 rounded-full ${c.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                       {c.isAvailable ? 'VACANT' : 'OCCUPIED'}
                    </p>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 pt-2 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-4">
         <button 
           onClick={() => setScreen(AppScreen.NAVIGATION)}
           className="flex-1 bg-gray-900 text-white py-4 rounded-3xl font-black text-sm shadow-xl"
         >
            Get Route
         </button>
         <button 
           onClick={() => setScreen(AppScreen.BOOKING)}
           className="flex-1 bg-green-500 text-white py-4 rounded-3xl font-black text-sm shadow-xl"
         >
            Reserve Now
         </button>
      </div>
    </div>
  );
};

export default StationDetail;