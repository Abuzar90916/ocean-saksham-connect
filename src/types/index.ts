export interface Report {
  id: string;
  title: string;
  type: 'flood' | 'storm' | 'tsunami' | 'surge' | 'other';
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  media?: string[];
  reporterId: string;
  reporterName: string;
  reporterContact: string;
  timestamp: Date;
  status: 'pending' | 'verified' | 'rejected' | 'resolved';
  verifiedBy?: string;
  verificationNotes?: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'urgent' | 'info';
  area: string;
  timestamp: Date;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'citizen' | 'official';
  department?: string;
}

export interface Statistics {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  activeAlerts: number;
  recentReports: Report[];
}

export type Language = 'en' | 'hi';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: Report['urgency'];
  title: string;
  description: string;
}