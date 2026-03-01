import React, { useState } from 'react';
import { useApp } from '../App';
import { AppScreen } from '../types';

const BookingFlow: React.FC = () => {
  const { selectedStation, setScreen, setBookings } = useApp();
  const [selectedDay, setSelectedDay] = useState(14);
  const [duration, setDuration] = useState(2);

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
    <div className="flex flex-col h-full bg-white overflow-y-auto font-sans text-gray-900">
      <div className="p-8 pt-14 flex items-center justify-between">
         <button onClick={() => setScreen(AppScreen.STATION_DETAIL)} className="text-xl font-bold">←</button>
         <h1 className="text-sm font-black uppercase tracking-widest">Reserve a Slot</h1>
         <div className="w-10"></div>
      </div>

      <div className="px-8 space-y-10 pb-12">
        {/* Calendar */}
        <div className="bg-gray-50 p-8 rounded-[3rem] border border-gray-100">
           <div className="grid grid-cols-7 gap-y-4 text-center">
             {['S','M','T','W','T','F','S'].map(d => (
                <span key={d} className="text-[10px] font-black text-gray-300">{d}</span>
             ))}
             {Array.from({length: 30}, (_, i) => i + 1).map(day => (
                <button 
                   key={day}
                   onClick={() => setSelectedDay(day)}
                   className={`h-10 w-10 flex items-center justify-center rounded-2xl text-xs font-black transition-all
                     ${day === selectedDay ? 'bg-green-500 text-white shadow-lg' : 'text-gray-900'}
                   `}
                >
                   {day}
                </button>
             ))}
           </div>
        </div>

        {/* Cost Section */}
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="font-black text-xs text-gray-400 uppercase">Est. Duration</h3>
                <span className="text-green-600 font-black text-sm">{duration} Hours</span>
            </div>
            <input 
                type="range" min="1" max="12" step="1" 
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
        </div>

        {/* Total Cost in Rupees */}
        <div className="p-8 bg-gray-50 rounded-[3rem] border border-gray-100 flex justify-between items-center">
           <div>
              <p className="text-[10px] text-gray-400 font-black uppercase">Total Amount</p>
              <h2 className="text-4xl font-black text-gray-900">₹{(duration * 15).toFixed(0)}</h2>
           </div>
           <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg shadow-green-100">⚡</div>
        </div>

        <button 
          onClick={handleBook}
          className="w-full bg-gray-900 text-white py-6 rounded-[2.5rem] font-black text-sm shadow-2xl hover:bg-black active:scale-95 transition-all"
        >
          CONFIRM BOOKING
        </button>
      </div>
    </div>
  );
};

export default BookingFlow;