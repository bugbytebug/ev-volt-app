import Papa from 'papaparse';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { AppScreen, Station, Vehicle, Booking } from './types';
import { MOCK_STATIONS, MOCK_VEHICLES } from './constants';
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

interface AppContextType {
  currentScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  selectedStation: Station | null;
  setSelectedStation: (s: Station | null) => void;
  stations: Station[];
  setStations: (s: Station[]) => void;
  users: any[]; // New storage for your Google Sheet Users
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
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [userVehicles, setUserVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeSession, setActiveSession] = useState<any>(null);
  
  const [stations, setStations] = useState<Station[]>(MOCK_STATIONS);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // LINK 1: Stations Tab
    const stationsUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQP8ltJjZf-_drm11Ngn7pPDoYxY-tT1OitG-Ovriu6sWM3c_u6XWfPTFnZ2eyWrheCAU6YwL9xww7G/pub?gid=0&single=true&output=csv";
    
    // LINK 2: Users Tab
    const usersUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQP8ltJjZf-_drm11Ngn7pPDoYxY-tT1OitG-Ovriu6sWM3c_u6XWfPTFnZ2eyWrheCAU6YwL9xww7G/pub?gid=2095107158&single=true&output=csv";

    // Load Stations Data
    Papa.parse(stationsUrl, {
      download: true,
      header: true,
      complete: (results) => {
        console.log("Stations Loaded");
        setStations(results.data as Station[]);
      }
    });

    // Load Users Data
    Papa.parse(usersUrl, {
      download: true,
      header: true,
      complete: (results) => {
        console.log("Users Loaded:", results.data);
        setUsers(results.data);
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
    <AppContext.Provider value={{
      currentScreen, setScreen,
      selectedStation, setSelectedStation,
      stations, setStations,
      users,
      userVehicles, setUserVehicles,
      bookings, setBookings,
      activeSession, setActiveSession
    }}>
      <div className="max-w-md mx-auto h-screen bg-white relative overflow-hidden shadow-2xl flex flex-col">
        {renderScreen()}
      </div>
    </AppContext.Provider>
  );
};

export default App;