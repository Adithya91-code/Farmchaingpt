export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  farmer_id?: string; // 3-digit unique ID for farmers
  distributor_id?: string; // 3-digit unique ID for distributors
  name?: string; // User's full name
  location?: string; // User's location
}

export type UserRole = 'farmer' | 'distributor' | 'retailer' | 'consumer' | 'admin';

export interface Crop {
  id: string;
  name: string;
  crop_type: string;
  harvest_date: string;
  expiry_date: string;
  soil_type: string;
  pesticides_used: string;
  image_url?: string;
  user_id: string;
  created_at: string;
  // Supply chain tracking
  farmer_info?: {
    farmer_id: string;
    name: string;
    location: string;
  };
  distributor_info?: {
    name: string;
    location: string;
    received_date: string;
    sent_to_retailer: string;
    retailer_location: string;
  };
  retailer_info?: {
    name: string;
    location: string;
    received_date: string;
    received_from_distributor: string;
    distributor_location: string;
  };
}

export interface SupplyChainEntry {
  id: string;
  crop_id: string;
  user_id: string;
  user_role: UserRole;
  entry_date: string;
  details: any;
}