import React, { useState } from 'react';
import { useApp } from '../App';
import { AppScreen, Station } from '../types';
import BottomNav from '../components/BottomNav';

const Home: React.FC = () => {
  const { setScreen, setSelectedStation, stations } = useApp();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const handleStationClick = (station: Station) => {
    setSelectedStation(station);
    setScreen(AppScreen.STATION_DETAIL);
  };

  const filteredStations = stations.filter(s => 
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="absolute top-0 left-0 right-0 z-10 p-4 pt-12 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Search EV spots..." 
              className="w-full bg-white/90 backdrop-blur shadow-xl border border-white/20 p-4 pl-12 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex bg-white/80 backdrop-blur p-1 rounded-2xl shadow-md w-fit mx-auto border border-white/40">
          <button 
            onClick={() => setViewMode('map')}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode === 'map' ? 'bg-green-500 text-white shadow-md' : 'text-gray-500'}`}
          >
            Map
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode === 'list' ? 'bg-green-500 text-white shadow-md' : 'text-gray-500'}`}
          >
            List
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        {viewMode === 'map' ? (
          <div className="h-full bg-slate-200 overflow-hidden">
             <div className="w-full h-full relative" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 0)', backgroundSize: '24px 24px' }}>
                {filteredStations.map((s: any, i) => {
                  // This math converts your Lat/Lng into screen percentages
                  // We use (s.lat) and (s.lng) which come directly from your Sheet columns
                  const topPos = s.lat ? `${((51.6 - parseFloat(s.lat)) * 400) % 80 + 10}%` : '50%';
                  const leftPos = s.lng ? `${((parseFloat(s.lng) + 0.2) * 400) % 80 + 10}%` : '50%';

                  return (
                    <div 
                      key={s.id || i} 
                      className="absolute cursor-pointer animate-bounce"
                      style={{ top: topPos, left: leftPos }}
                      onClick={() => handleStationClick(s)}
                    >
                      <div className="relative">
                        <div className="bg-green-600 text-white p-2 rounded-xl flex items-center shadow-2xl border-2 border-white">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                             <path d="M13 10V3L4 14H11V21L20 10H13Z" />
                          </svg>
                        </div>
                        <div className="w-2 h-2 bg-green-600 rotate-45 mx-auto -mt-1 border-r-2 border-b-2 border-white"></div>
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto pt-44 pb-32 px-4 space-y-4">
            {filteredStations.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">No stations found. Update your Google Sheet!</div>
            ) : (
              filteredStations.map((station, index) => (
                <StationCard 
                  key={station.id || index} 
                  station={station} 
                  onClick={() => handleStationClick(station)} 
                />
              ))
            )}
          </div>
        )}
      </div>

      <BottomNav active="home" />
    </div>
  );
};

const StationCard: React.FC<{ station: any; onClick: () => void }> = ({ station, onClick }) => {
  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-black text-green-500 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-widest">Live Cloud Data</span>
          </div>
          <h3 className="font-bold text-lg leading-tight line-clamp-1">{station.name || 'Unknown Station'}</h3>
          <p className="text-gray-400 text-xs mt-1 line-clamp-1">{station.address || 'No address provided'}</p>
        </div>
        <div className="text-right shrink-0">
            <p className="text-xs font-black text-gray-900">{station.distance || '---'}</p>
            <p className="text-[10px] text-gray-400 font-bold">{station.cost || 'FREE'}</p>
        </div>
      </div>
      
      <div className="flex gap-2 items-center">
        <div className={`w-2 h-2 rounded-full ${station.status === 'Available' ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-[10px] font-bold text-gray-600 uppercase">
          {station.status || 'Status Unknown'}
        </span>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 border border-green-500 text-green-500 py-3 rounded-2xl font-bold text-sm">Details</button>
        <button className="flex-1 bg-green-500 text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-green-100">Reserve</button>
      </div>
    </div>
  );
};

export default Home;