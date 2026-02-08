
import { CampusLocation, LocationCategory } from './types';

// Updated coordinates for Avanthi's St. Theresa Institute of Engineering and Technology in Garividi
export const CAMPUS_CENTER = { lat: 18.2811, lng: 83.5412 }; 

export const INITIAL_LOCATIONS: CampusLocation[] = [
  {
    id: '1',
    name: 'Main Administrative Block',
    latitude: 18.2811,
    longitude: 83.5412,
    description: 'Central administrative offices, Principal office, and main reception.',
    category: LocationCategory.ADMIN
  },
  {
    id: '2',
    name: 'Department of CSE & IT',
    latitude: 18.2814,
    longitude: 83.5415,
    description: 'Computer Science and Information Technology department labs, faculty rooms, and classrooms.',
    category: LocationCategory.ACADEMIC
  },
  {
    id: '3',
    name: 'Central Library & Digital Hub',
    latitude: 18.2808,
    longitude: 83.5410,
    description: 'Multi-story library with 50,000+ volumes and a dedicated digital learning center.',
    category: LocationCategory.FACILITY
  },
  {
    id: '4',
    name: 'Advanced Electronics Lab',
    latitude: 18.2812,
    longitude: 83.5417,
    description: 'Specialized lab for VLSI, Embedded Systems, and Communication engineering.',
    category: LocationCategory.LAB
  },
  {
    id: '5',
    name: 'Main Campus Cafeteria',
    latitude: 18.2806,
    longitude: 83.5408,
    description: 'Spacious dining hall serving snacks, lunch, and refreshments.',
    category: LocationCategory.FACILITY
  },
  {
    id: '6',
    name: 'Exam Cell & Records',
    latitude: 18.2810,
    longitude: 83.5411,
    description: 'Confidential examination department and student academic records.',
    category: LocationCategory.ADMIN
  },
  {
    id: '7',
    name: 'Placement & Training Cell',
    latitude: 18.2809,
    longitude: 83.5409,
    description: 'Career guidance office and dedicated interview cabins for campus recruitment.',
    category: LocationCategory.ADMIN
  },
  {
    id: '8',
    name: 'Mechanical Workshop',
    latitude: 18.2818,
    longitude: 83.5420,
    description: 'Heavy machinery, lathe machines, and thermal engineering laboratory.',
    category: LocationCategory.LAB
  },
  {
    id: '9',
    name: 'Boys Hostel',
    latitude: 18.2797,
    longitude: 83.5402,
    description: 'Residential quarters for male students with in-house mess facilities.',
    category: LocationCategory.HOSTEL
  },
  {
    id: '10',
    name: 'Girls Hostel',
    latitude: 18.2799,
    longitude: 83.5397,
    description: 'Secure residential block for female students with 24/7 warden support.',
    category: LocationCategory.HOSTEL
  },
  {
    id: '11',
    name: 'Sports Ground',
    latitude: 18.2822,
    longitude: 83.5405,
    description: 'Outdoor cricket ground, basketball court, and indoor sports hall.',
    category: LocationCategory.SPORTS
  }
];

export const COLORS = {
  primary: '#1e40af', // Blue-800
  secondary: '#1e3a8a', // Blue-900
  accent: '#fbbf24', // Amber-400
};
