import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { AppScreen, Station } from '../types';
import BottomNav from '../components/BottomNav';

// 1. Leaflet Imports
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icon for User Location
const UserIcon = L.divIcon({
  className: 'custom-user-icon',
  html: `<div class="relative">
          <div class="absolute -inset-2 bg-blue-500/30 rounded-full animate-ping"></div>
          <div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
         </div>`,
  iconSize: [16, 16]
});

// 2. The Location Control Component (The Button Logic)
function LocationControl() {
  const map = useMap();
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useEffect(() => {
    map.on('locationfound', (e) => {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 15, { animate: true });
    });
  }, [map]);

  const handleLocate = () => {
    map.locate({ enableHighAccuracy: true });
  };

  return (
    <>
      {position && <Marker position={position} icon={UserIcon} zIndexOffset={1000} />}
      
      {/* 📍 THE "GO TO MY LOCATION" BUTTON */}
      <div className="absolute bottom-28 right-4 z-[1000]">
        <button 
          onClick={handleLocate}
          className="bg-white p-4 rounded-full shadow-2xl border border-gray-100 active:scale-95 transition-transform"
        >
          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </>
  );
}

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
    <div className="flex flex-col h-full bg-gray-50 relative overflow-hidden">
      
      {/* 3. FLOATING HEADER UI */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-4 pt-12 space-y-4 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Search EV spots..." 
              className="w-full bg-white shadow-xl p-4 pl-12 rounded-2xl text-sm focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex bg-white p-1 rounded-2xl shadow-lg w-fit mx-auto ring-1 ring-black/5 pointer-events-auto">
          <button 
            onClick={() => setViewMode('map')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-green-500 text-white shadow-md' : 'text-gray-500'}`}
          >
            Map
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-green-500 text-white shadow-md' : 'text-gray-500'}`}
          >
            List
          </button>
        </div>
      </div>

      {/* 4. MAIN VIEW */}
      <div className="flex-1 relative">
        {viewMode === 'map' ? (
          <div className="h-full w-full">
            <MapContainer 
              center={[51.505, -0.09]} 
              zoom={13} 
              zoomControl={false}
              className="h-full w-full z-0" /* Ensure Map has lowest z-index */
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              
              <LocationControl />

              {filteredStations.map((s, i) => {
                const lat = parseFloat(s.lat || "0");
                const lng = parseFloat(s.lng || "0");
                if (!lat || !lng) return null;

                return (
                  <Marker 
                    key={s.id || i} 
                    position={[lat, lng]}
                    eventHandlers={{ click: () => handleStationClick(s) }}
                  />
                );
              })}
              <ZoomControl position="bottomright" />
            </MapContainer>
          </div>
        ) : (
          <div className="h-full overflow-y-auto pt-44 pb-32 px-4 space-y-4">
            {filteredStations.map((station, index) => (
              <StationCard 
                key={station.id || index} 
                station={station} 
                onClick={() => handleStationClick(station)} 
              />
            ))}
          </div>
        )}
      </div>

      {/* 5. NAVBAR (ENSURE HIGH Z-INDEX) */}
      <div className="relative z-[2000]">
        <BottomNav active="home" />
      </div>
    </div>
  );
};

// ... StationCard component stays the same
const StationCard: React.FC<{ station: any; onClick: () => void }> = ({ station, onClick }) => {
  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100" onClick={onClick}>
      <h3 className="font-bold text-lg">{station.name}</h3>
      <p className="text-gray-400 text-xs mb-4">{station.address}</p>
      <div className="flex gap-3">
        <button className="flex-1 border border-green-500 text-green-500 py-3 rounded-2xl font-bold text-sm">Details</button>
        <button className="flex-1 bg-green-500 text-white py-3 rounded-2xl font-bold text-sm">Reserve</button>
      </div>
    </div>
  );
};

export default Home;