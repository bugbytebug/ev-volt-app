export enum AppScreen {
  ONBOARDING = 'ONBOARDING',
  AUTH = 'AUTH',
  HOME = 'HOME',
  STATION_DETAIL = 'STATION_DETAIL',
  BOOKING = 'BOOKING',
  NAVIGATION = 'NAVIGATION',
  CHARGING_STATUS = 'CHARGING_STATUS',
  PROFILE = 'PROFILE',
  MY_VEHICLES = 'MY_VEHICLES',
  QR_SCAN = 'QR_SCAN'
}

export interface Charger {
  id: string;
  name: string;
  type: string;
  capacity: string;
  isAvailable: boolean;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  lat: string;   // Added to match Google Sheet / OCM string format
  lng: string;   // Added to match Google Sheet / OCM string format
  distance: string;
  roadDistance?: string; // For the real travel distance we calculate
  cost: string;
  openingHours: string;
  coordinates: { lat: number; lng: number };
  chargers: Charger[];
  attractions: string | string[]; // Flexible for CSV strings or API arrays
  imageUrl: string;
  
  // --- REAL-TIME DATA EXTENSIONS ---
  source?: 'sheet' | 'ocm'; // Tells us where the data came from
  connections?: any[];      // Holds the raw port data from Open Charge Map
  numSlots?: number;        // The physical count of charging points
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  trim: string;
  batteryLevel: number;
  chargingPort: string;
  imageUrl: string;
}

export interface Booking {
  id: string;
  stationId: string;
  stationName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalCost: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
}