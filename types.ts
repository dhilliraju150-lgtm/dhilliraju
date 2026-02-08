
export enum LocationCategory {
  ACADEMIC = 'Academic Block',
  LAB = 'Laboratory',
  ADMIN = 'Administrative',
  FACILITY = 'General Facility',
  HOSTEL = 'Hostel',
  SPORTS = 'Sports & Parking'
}

export interface CampusLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  category: LocationCategory;
  floor?: string;
  modelUrl?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'visitor' | 'student';
}

export interface NavigationLog {
  id: string;
  userId: string;
  destination: string;
  timestamp: number;
}
