export type ThreatSeverity = 'critical' | 'high' | 'elevated' | 'moderate' | 'low';

export interface ConflictZone {
  id: string;
  title: string;
  region: string;
  lat: number;
  lng: number;
  severity: ThreatSeverity;
  defcon: 1 | 2 | 3 | 4 | 5;
  status: string;
  parties: string[];
  summary: string;
  lastUpdate: string;
  marketImpact: string;
  affectedAssets: string[];
}

export interface MilitaryAircraft {
  id: string;
  callsign: string;
  model: string;
  operator: string;
  lat: number;
  lng: number;
  altitudeFt: number;
  speedKts: number;
  heading: number;
  mission: 'Reconnaissance' | 'Air Refueling' | 'AWACS Surveillance' | 'Maritime Patrol' | 'Strategic Transit';
  squawk: string;
}

export interface NavalVessel {
  id: string;
  name: string;
  vesselType: 'Carrier Strike Group' | 'Guided Missile Destroyer' | 'Submarine' | 'Strategic Tanker Convoy';
  flag: string;
  lat: number;
  lng: number;
  chokePoint: string;
  status: string;
  heading: number;
}

export interface EarthquakeIncident {
  id: string;
  magnitude: number;
  depthKm: number;
  location: string;
  lat: number;
  lng: number;
  timeAgo: string;
  tsunamiAlert: boolean;
}

export interface CyberThreat {
  id: string;
  name: string;
  category: 'State-Sponsored APT' | 'DDoS Volumetric' | 'C2 Botnet Infrastructure' | 'Zero-Day Exploit';
  origin: string;
  target: string;
  severity: ThreatSeverity;
  status: string;
  detectedAt: string;
}

export interface IntelligenceItem {
  id: string;
  title: string;
  source: string;
  category: 'geopolitics' | 'military' | 'cyber' | 'energy' | 'disaster' | 'polymarket';
  severity: ThreatSeverity;
  timestamp: string;
  summary: string;
  url?: string;
  verified: boolean;
  marketAssetImpact?: string;
}

export interface PizzaIndexFacility {
  id: string;
  name: string;
  location: string;
  surgePercent: number;
  deliveryLevel: 'SURGE (CRITICAL TEMPO)' | 'ELEVATED' | 'BASELINE' | 'LOW';
  activePizzaOrders: number;
  normalBaseline: number;
  defconCorrelation: number;
  lastChecked: string;
}
