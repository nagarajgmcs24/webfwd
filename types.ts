
export enum UserRole {
  CITIZEN = 'CITIZEN',
  COUNCILLOR = 'COUNCILLOR'
}

export enum IssueStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED'
}

export enum IssueCategory {
  ROADS = 'Roads & Potholes',
  LIGHTING = 'Street Lighting',
  WASTE = 'Waste & Sanitation',
  WATER = 'Water Supply',
  PARKS = 'Parks & Recreation',
  OTHER = 'Other'
}

export interface WardInfo {
  id: string;
  name: string;
  councillor: string;
}

export const BENGALURU_WARDS: WardInfo[] = [
  { id: '1', name: 'Kempegowda Ward', councillor: 'Mr. Ravi Kumar' },
  { id: '2', name: 'Chowdeshwari Ward', councillor: 'Mrs. Lakshmi Devi' },
  { id: '3', name: 'Attur Ward', councillor: 'Mr. Suresh B' },
  { id: '4', name: 'Yelahanka Satellite Town', councillor: 'Mr. Satish M' },
  { id: '5', name: 'Byatarayanapura', councillor: 'Mrs. Geetha Shashikumar' },
  { id: '6', name: 'Thanisandra', councillor: 'Mr. Mamatha K' },
  { id: '7', name: 'Jakur', councillor: 'Mr. K.A. Muneendra Kumar' },
  { id: '8', name: 'Kodigehalli', councillor: 'Mr. N. Jayaraj' },
  { id: '9', name: 'Vidyaranyapura', councillor: 'Mr. Pillappa' },
  { id: '10', name: 'Dodda Bommasandra', councillor: 'Mr. Jayamma' }
];

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  wardId: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  reportedBy: string; // User ID
  reportedByName: string;
  wardId: string;
  wardName: string;
  councillorName: string;
  createdAt: number;
  updatedAt: number;
  imageUrl?: string;
  aiAnalysis?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
