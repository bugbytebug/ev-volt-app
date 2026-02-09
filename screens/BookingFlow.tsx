
import React, { useState } from 'react';
import { useApp } from '../App';
import { AppScreen } from '../types';

const BookingFlow: React.FC = () => {
  const { selectedStation, setScreen, setBookings } = useApp();
  const [selectedDay, setSelectedDay] = useState(14);
  const [duration, setDuration] = useState(2);
  const [selectedCharger, setSelectedCharger] = useState('c1');

  if (!selectedStation) return null;

  const handleBook = () => {
    setBookings(prev => [...prev, {
      id: Math.random().toString(),
      stationId: selectedStation.id,
      stationName: selectedStation.name,
      date: `June ${selectedDay}, 2024`,
      startTime: '09:00 AM',
      endTime: '11:00 AM',
      duration: duration,
      totalCost: duration * 15,
      status: 'Pending'
    }]);
    setScreen(AppScreen.NAVIGATION);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      <div className="p-6 pt-12 flex items-center justify-between">
         <button onClick={() => setScreen(AppScreen.STATION_DETAIL)} className="p-3 border border-gray-100 rounded-2xl hover:bg-gray-50">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
         </button>
         <h1 className="text-xl font-bold">Book a slot</h1>
         <div className="w-12"></div>
      </div>

      <div className="px-6 space-y-8 pb-10">
        {/* Calendar Mock */}
        <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100">
           <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold">June 2024</h2>
              <div className="flex gap-4">
                 <button className="text-gray-400">❮</button>
                 <button className="text-gray-400">❯</button>
              </div>
           </div>
           <div className="grid grid-cols-7 gap-y-4 text-center">
              {['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d => (
                 <span key={d} className="text-[10px] font-bold text-gray-400">{d}</span>
              ))}
              {Array.from({length: 30}, (_, i) => i + 1).map(day => (
                 <button 
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`h-10 w-10 flex items-center justify-center rounded-2xl text-sm font-bold transition-all
                      ${day === selectedDay ? 'bg-green-500 text-white shadow-lg shadow-green-100 scale-110' : 'text-gray-700 hover:bg-gray-200'}
                      ${[6, 14, 21].includes(day) && day !== selectedDay ? 'bg-green-100/50 text-green-700' : ''}
                    `}
                 >
                    {day}
                 </button>
              ))}
           </div>
        </div>

        {/* Time and Duration */}
        <div className="space-y-6">
           <h3 className="font-bold text-gray-900">Select time</h3>
           <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                 <label className="text-[10px] font-bold text-gray-400 uppercase">Starting time</label>
                 <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm font-bold text-gray-900">09:00 AM</div>
              </div>
              <div className="flex-1 space-y-2">
                 <label className="text-[10px] font-bold text-gray-400 uppercase">Ending time</label>
                 <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm font-bold text-gray-900">11:00 AM</div>
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <h3 className="font-bold text-gray-900">How much time you need?</h3>
                 <span className="text-green-500 font-bold text-sm bg-green-50 px-3 py-1 rounded-full">{duration} Hours</span>
              </div>
              <input 
                 type="range" 
                 min="1" max="12" step="1" 
                 value={duration}
                 onChange={(e) => setDuration(parseInt(e.target.value))}
                 className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
           </div>
        </div>

        {/* Total Cost */}
        <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100 flex justify-between items-center">
           <div>
              <p className="text-xs text-green-700 font-bold">Total estimated cost</p>
              <h2 className="text-2xl font-black text-green-700">${(duration * 15).toFixed(2)}</h2>
           </div>
           <div className="bg-green-500 text-white p-3 rounded-2xl shadow-lg">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
           </div>
        </div>

        <button 
          onClick={handleBook}
          className="w-full bg-green-500 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-green-100 hover:bg-green-600 active:scale-95 transition-all mt-4"
        >
          Confirm booking
        </button>
      </div>
    </div>
  );
};

export default BookingFlow;
