import Papa from 'papaparse';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { AppScreen, Station, Vehicle, Booking } from './types';
import { MOCK_VEHICLES } from './constants';
import Onboarding from './screens/Onboarding';
import Auth from './screens/Auth';
import Home from './screens/Home';
import StationDetail from './screens/StationDetail';
import BookingFlow from './screens/BookingFlow';
import ActiveCharging from './screens/ActiveCharging';
import Profile from './screens/Profile';
import MyVehicles from './screens/MyVehicles';
import NavigationScreen from './screens/NavigationScreen';
import QRScanner from './screens/QRScanner';
import { AuthProvider } from './services/AuthContext';

interface AppContextType {
  currentScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  selectedStation: any | null;
  setSelectedStation: (s: any | null) => void;
  stations: any[];
  setStations: (s: any[]) => void;
  users: any[];
  userVehicles: Vehicle[];
  setUserVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  activeSession: any;
  setActiveSession: (s: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const App: React.FC = () => {
  const [currentScreen, setScreen] = useState<AppScreen>(AppScreen.ONBOARDING);
  const [selectedStation, setSelectedStation] = useState<any | null>(null);
  const [userVehicles, setUserVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [stations, setStations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const STATIONS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQP8ltJjZf-_drm11Ngn7pPDoYxY-tT1OitG-Ovriu6sWM3c_u6XWfPTFnZ2eyWrheCAU6YwL9xww7G/pub?gid=0&single=true&output=csv";
    const USERS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQP8ltJjZf-_drm11Ngn7pPDoYxY-tT1OitG-Ovriu6sWM3c_u6XWfPTFnZ2eyWrheCAU6YwL9xww7G/pub?gid=2095107158&single=true&output=csv";
    const OCM_KEY = "82a1e1da-0000-47e4-b391-3364aac2f867";

    // 1. Fetch Stations (Custom + OpenChargeMap)
    Papa.parse(STATIONS_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const mySheetStations = (results.data as any[])
          .filter(s => s.lat && s.lng)
          .map(s => ({ 
            ...s, 
            isPublic: false, 
            source: 'sheet',
            numSlots: s.numSlots || '1'
          }));

        try {
          const ocmRes = await fetch(`https://api.openchargemap.io/v3/poi/?key=${OCM_KEY}&latitude=10.8302&longitude=76.0234&distance=50&countrycode=IN&compact=false&verbose=false`);
          const ocmData = await ocmRes.json();

          const realStations = ocmData.map((poi: any) => ({
            id: `ocm-${poi.ID}`,
            name: poi.AddressInfo.Title,
            address: poi.AddressInfo.AddressLine1,
            lat: String(poi.AddressInfo.Latitude),
            lng: String(poi.AddressInfo.Longitude),
            connections: poi.Connections || [], 
            numSlots: poi.Connections?.length || 0,
            source: 'ocm',
            isPublic: true
          }));

          setStations([...mySheetStations, ...realStations]);
        } catch (err) {
          setStations(mySheetStations);
        }
      }
    });

    // 2. Fetch Users with Key Normalization
    Papa.parse(USERS_URL, { 
      download: true, 
      header: true, 
      skipEmptyLines: true,
      complete: (res) => {
        // Normalizes "Name" or "NAME" to "name" so Auth.tsx doesn't break
        const normalizedUsers = (res.data as any[]).map(user => {
            const newUser: any = {};
            Object.keys(user).forEach(key => {
                newUser[key.toLowerCase()] = user[key];
            });
            return newUser;
        });
        setUsers(normalizedUsers);
      } 
    });
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.ONBOARDING: return <Onboarding />;
      case AppScreen.AUTH: return <Auth />;
      case AppScreen.HOME: return <Home />;
      case AppScreen.STATION_DETAIL: return <StationDetail />;
      case AppScreen.BOOKING: return <BookingFlow />;
      case AppScreen.CHARGING_STATUS: return <ActiveCharging />;
      case AppScreen.PROFILE: return <Profile />;
      case AppScreen.MY_VEHICLES: return <MyVehicles />;
      case AppScreen.NAVIGATION: return <NavigationScreen />;
      case AppScreen.QR_SCAN: return <QRScanner />;
      default: return <Home />;
    }
  };

  return (
    <AuthProvider>
      <AppContext.Provider value={{
        currentScreen, setScreen,
        selectedStation, setSelectedStation,
        stations, setStations,
        users, userVehicles, setUserVehicles,
        bookings, setBookings,
        activeSession, setActiveSession
      }}>
        <div className="max-w-md mx-auto h-screen bg-white relative overflow-hidden shadow-2xl">
          {renderScreen()}
        </div>
      </AppContext.Provider>
    </AuthProvider>
  );
};

export default App;