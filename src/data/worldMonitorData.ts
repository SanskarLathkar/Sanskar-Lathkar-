import { 
  ConflictZone, 
  MilitaryAircraft, 
  NavalVessel, 
  EarthquakeIncident, 
  CyberThreat, 
  IntelligenceItem, 
  PizzaIndexFacility 
} from '../types/worldMonitor';

export const CONFLICT_ZONES: ConflictZone[] = [
  {
    id: 'red-sea',
    title: 'Red Sea & Bab-el-Mandeb Chokepoint',
    region: 'Middle East / Horn of Africa',
    lat: 13.5,
    lng: 42.8,
    severity: 'critical',
    defcon: 2,
    status: 'ACTIVE ESCALATION',
    parties: ['Houthi Maritime Forces', 'Operation Prosperity Guardian', 'Commercial Vessels'],
    summary: 'Ballistic missile & drone attacks on commercial maritime shipping corridors. Rerouting via Cape of Good Hope adds 12-14 days to Europe-Asia freight times.',
    lastUpdate: '14 min ago',
    marketImpact: 'Brent crude spiked +1.8%, container shipping rates +32%, European LNG storage buffer draw.',
    affectedAssets: ['BRENT', 'WTI', 'ZIM', 'MAERSK', 'GOLD']
  },
  {
    id: 'ukraine-black-sea',
    title: 'Eastern Europe / Black Sea Maritime Corridor',
    region: 'Eastern Europe',
    lat: 46.5,
    lng: 33.5,
    severity: 'critical',
    defcon: 2,
    status: 'HIGH INTENSITY ENGAGEMENT',
    parties: ['Armed Forces of Ukraine', 'Russian Armed Forces', 'Black Sea Fleet'],
    summary: 'Active long-range drone strikes on oil refineries and power infrastructure. Odessa grain export sea corridors operate under NATO drone surveillance.',
    lastUpdate: '32 min ago',
    marketImpact: 'Wheat futures +2.4%, European Dutch TTF natural gas elevated, defense equities ITA +1.6%.',
    affectedAssets: ['WHEAT', 'NATGAS', 'ITA', 'LMT', 'EURUSD']
  },
  {
    id: 'taiwan-strait',
    title: 'Taiwan Strait & First Island Chain',
    region: 'East Asia',
    lat: 24.2,
    lng: 119.8,
    severity: 'high',
    defcon: 3,
    status: 'ELEVATED PATROL DENSITY',
    parties: ['PLA Eastern Theater Command', 'ROK/ROC Armed Forces', 'US 7th Fleet'],
    summary: 'Joint combat readiness patrols and ADIZ incursions reported with 38 military aircraft and 7 naval combatants operating across the median line.',
    lastUpdate: '1 hr ago',
    marketImpact: 'Semiconductor supply risk premium (TSMC, NVDA, ASML), TWD volatility, Taiwan ETF EWT hedging volume up.',
    affectedAssets: ['TSM', 'NVDA', 'ASML', 'SOXX', 'USDTWD']
  },
  {
    id: 'strait-of-hormuz',
    title: 'Strait of Hormuz Oil Arteries',
    region: 'Persian Gulf',
    lat: 26.6,
    lng: 56.2,
    severity: 'high',
    defcon: 3,
    status: 'HEIGHTENED READINESS',
    parties: ['IRGC Navy', 'US 5th Fleet Task Force', 'International Maritime Security Construct'],
    summary: 'Over 20.5 million barrels of crude oil transit daily. Elevated GPS spoofing and electronic warfare interference impacting supertanker AIS tracking.',
    lastUpdate: '2 hrs ago',
    marketImpact: 'Supertanker VLCC freight rates surging, crude spot price crack spreads widening.',
    affectedAssets: ['BRENT', 'FRO', 'NATGAS', 'GOLD']
  },
  {
    id: 'korean-peninsula',
    title: 'Korean Demilitarized Zone (DMZ)',
    region: 'North-East Asia',
    lat: 38.0,
    lng: 126.9,
    severity: 'elevated',
    defcon: 3,
    status: 'ALERT POSTURE',
    parties: ['KPA Strategic Rocket Force', 'ROK Armed Forces', 'US Forces Korea'],
    summary: 'Hypersonic glide vehicle engine test reported in Sinpo. GPS jamming pulses detected across Yellow Sea border islands affecting civilian navigation.',
    lastUpdate: '4 hrs ago',
    marketImpact: 'Korean Won USDKRW pressure, defense contractor Hanwha Aerospace volume spike.',
    affectedAssets: ['USDKRW', 'EWY', 'GOLD']
  },
  {
    id: 'baltic-sea',
    title: 'Baltic Undersea Infrastructure Corridor',
    region: 'Northern Europe',
    lat: 58.5,
    lng: 20.2,
    severity: 'elevated',
    defcon: 4,
    status: 'SURVEILLANCE SURGE',
    parties: ['NATO Baltic Air Policing', 'Swedish Navy', 'Finnish Border Guard'],
    summary: 'Maritime patrol aircraft monitoring shadow fleet tankers and critical subsea telecommunication cables following telemetry anomalies.',
    lastUpdate: '5 hrs ago',
    marketImpact: 'Nordic electricity grid risk buffer, maritime insurance rate adjustments.',
    affectedAssets: ['EURUSD', 'BRENT', 'EQUINOR']
  }
];

export const MILITARY_AIRCRAFT: MilitaryAircraft[] = [
  {
    id: 'forte12',
    callsign: 'FORTE12',
    model: 'Northrop Grumman RQ-4B Global Hawk',
    operator: 'US Air Force (Sigonella AFB)',
    lat: 43.8,
    lng: 31.4,
    altitudeFt: 53200,
    speedKts: 340,
    heading: 85,
    mission: 'Reconnaissance',
    squawk: '7620'
  },
  {
    id: 'jake11',
    callsign: 'JAKE11',
    model: 'Boeing RC-135V Rivet Joint (SIGINT)',
    operator: 'US Air Force (Mildenhall)',
    lat: 54.2,
    lng: 21.8,
    altitudeFt: 31500,
    speedKts: 460,
    heading: 195,
    mission: 'AWACS Surveillance',
    squawk: '3412'
  },
  {
    id: 'nato01',
    callsign: 'NATO01',
    model: 'Boeing E-3A Sentry (AWACS)',
    operator: 'NATO Early Warning Force (Geilenkirchen)',
    lat: 52.1,
    lng: 23.4,
    altitudeFt: 29000,
    speedKts: 410,
    heading: 340,
    mission: 'AWACS Surveillance',
    squawk: '4210'
  },
  {
    id: 'perch02',
    callsign: 'PERCH02',
    model: 'Boeing P-8A Poseidon (ASW)',
    operator: 'US Navy (Keflavik / Lossiemouth)',
    lat: 63.5,
    lng: -2.4,
    altitudeFt: 22000,
    speedKts: 380,
    heading: 60,
    mission: 'Maritime Patrol',
    squawk: '1552'
  },
  {
    id: 'lagr223',
    callsign: 'LAGR223',
    model: 'Boeing KC-135R Stratotanker',
    operator: 'US Air Force Reserve',
    lat: 34.2,
    lng: 28.5,
    altitudeFt: 26000,
    speedKts: 440,
    heading: 120,
    mission: 'Air Refueling',
    squawk: '5221'
  },
  {
    id: 'shadow9',
    callsign: 'SHADOW09',
    model: 'General Atomics MQ-9A Reaper',
    operator: 'US Air Force (Al Udeid Air Base)',
    lat: 25.1,
    lng: 54.2,
    altitudeFt: 24500,
    speedKts: 185,
    heading: 270,
    mission: 'Strategic Transit',
    squawk: '6740'
  }
];

export const NAVAL_VESSELS: NavalVessel[] = [
  {
    id: 'cvn-72',
    name: 'USS Abraham Lincoln (CVN-72) Strike Group',
    vesselType: 'Carrier Strike Group',
    flag: 'US',
    lat: 16.2,
    lng: 58.5,
    chokePoint: 'North Arabian Sea / Gulf of Oman',
    status: 'COMBAT AIR PATROL ACTIVE',
    heading: 145
  },
  {
    id: 'ddg-68',
    name: 'USS The Sullivans (DDG-68) Aegis Destroyer',
    vesselType: 'Guided Missile Destroyer',
    flag: 'US',
    lat: 13.1,
    lng: 43.1,
    chokePoint: 'Bab el-Mandeb Chokepoint',
    status: 'AIR DEFENSE INTERCEPT POSTURE',
    heading: 320
  },
  {
    id: 'r-09',
    name: 'HMS Prince of Wales (R09) NATO Task Force',
    vesselType: 'Carrier Strike Group',
    flag: 'UK',
    lat: 68.2,
    lng: 14.8,
    chokePoint: 'GIUK Gap / Arctic Flank',
    status: 'STEADFAST DEFENDER EXERCISE',
    heading: 45
  },
  {
    id: 'tanker-convoy',
    name: 'Strait of Hormuz Supertanker Convoy 4',
    vesselType: 'Strategic Tanker Convoy',
    flag: 'International',
    lat: 26.3,
    lng: 56.4,
    chokePoint: 'Strait of Hormuz',
    status: 'TRANSITING CHOKEPOINT (3.2M bpd)',
    heading: 180
  }
];

export const EARTHQUAKES: EarthquakeIncident[] = [
  {
    id: 'eq-1',
    magnitude: 6.3,
    depthKm: 28,
    location: 'Off Coast of Honshu, Japan',
    lat: 38.2,
    lng: 142.5,
    timeAgo: '42 min ago',
    tsunamiAlert: false
  },
  {
    id: 'eq-2',
    magnitude: 5.7,
    depthKm: 12,
    location: 'Banda Sea, Indonesia',
    lat: -5.4,
    lng: 130.1,
    timeAgo: '2 hrs ago',
    tsunamiAlert: false
  },
  {
    id: 'eq-3',
    magnitude: 5.2,
    depthKm: 10,
    location: 'Southern Greece (Peloponnese)',
    lat: 37.1,
    lng: 22.1,
    timeAgo: '4 hrs ago',
    tsunamiAlert: false
  },
  {
    id: 'eq-4',
    magnitude: 5.9,
    depthKm: 45,
    location: 'Atacama Region, Northern Chile',
    lat: -24.8,
    lng: -69.2,
    timeAgo: '6 hrs ago',
    tsunamiAlert: false
  }
];

export const CYBER_THREATS: CyberThreat[] = [
  {
    id: 'threat-1',
    name: 'APT29 (Midnight Blizzard) Global Cloud Infrastructure Campaign',
    category: 'State-Sponsored APT',
    origin: 'Eastern Europe',
    target: 'Defense Contractors & Energy Majors',
    severity: 'critical',
    status: 'ACTIVE TELEMETRY MITIGATION',
    detectedAt: '18 min ago'
  },
  {
    id: 'threat-2',
    name: 'Mirai-Variant 2.4 Tbps Volumetric DDoS Attack',
    category: 'DDoS Volumetric',
    origin: 'Distributed IoT Botnet (Global)',
    target: 'SWIFT Banking API Endpoints',
    severity: 'high',
    status: 'MITIGATED BY ANYCAST CLOUD',
    detectedAt: '1 hr ago'
  },
  {
    id: 'threat-3',
    name: 'Volt Typhoon Critical Infrastructure Pre-Positioning',
    category: 'C2 Botnet Infrastructure',
    origin: 'East Asia',
    target: 'US Pacific Grid & Maritime Port SCADA',
    severity: 'critical',
    status: 'CISA ADVISORY ISSUED',
    detectedAt: '3 hrs ago'
  }
];

export const PIZZA_INDEX_FACILITIES: PizzaIndexFacility[] = [
  {
    id: 'pentagon',
    name: 'The Pentagon Military Headquarters',
    location: 'Arlington, VA (Dominos & Papa Johns Radius)',
    surgePercent: 245,
    deliveryLevel: 'SURGE (CRITICAL TEMPO)',
    activePizzaOrders: 86,
    normalBaseline: 25,
    defconCorrelation: 2,
    lastChecked: '4 mins ago'
  },
  {
    id: 'white-house',
    name: 'White House Situation Room & EEOB',
    location: 'NW Washington, D.C.',
    surgePercent: 180,
    deliveryLevel: 'ELEVATED',
    activePizzaOrders: 42,
    normalBaseline: 15,
    defconCorrelation: 3,
    lastChecked: '7 mins ago'
  },
  {
    id: 'langley',
    name: 'CIA George Bush Center for Intelligence',
    location: 'Langley, McLean, VA',
    surgePercent: 165,
    deliveryLevel: 'ELEVATED',
    activePizzaOrders: 38,
    normalBaseline: 14,
    defconCorrelation: 3,
    lastChecked: '12 mins ago'
  },
  {
    id: 'fort-meade',
    name: 'NSA & US Cyber Command Complex',
    location: 'Fort Meade, MD',
    surgePercent: 210,
    deliveryLevel: 'SURGE (CRITICAL TEMPO)',
    activePizzaOrders: 64,
    normalBaseline: 20,
    defconCorrelation: 2,
    lastChecked: '15 mins ago'
  }
];

export const INTELLIGENCE_FEED: IntelligenceItem[] = [
  {
    id: 'feed-1',
    title: 'PENTAGON PIZZA INDEX SURGE: Arlington late-night delivery orders jump +245% above baseline',
    source: 'World Monitor OSINT & DEFCON Watch',
    category: 'military',
    severity: 'critical',
    timestamp: 'Just now',
    summary: 'Correlated delivery activity spike observed across Arlington, VA and McLean pizza hubs serving the National Military Command Center (NMCC) at 02:40 EST.',
    verified: true,
    marketAssetImpact: 'Gold +$14.20/oz, US Treasuries 10Y yields slip 3 bps on safe-haven bid.'
  },
  {
    id: 'feed-2',
    title: 'Red Sea: UKMTO reports maritime incident 60 NM southwest of Aden; commercial vessel safely escorted',
    source: 'UK Maritime Trade Operations (UKMTO)',
    category: 'military',
    severity: 'critical',
    timestamp: '8m ago',
    summary: 'Explosion reported 50 meters off port quarter of Liberian-flagged bulk carrier. Coalition warship intercepted two inbound one-way attack drones.',
    verified: true,
    marketAssetImpact: 'Brent Crude $86.85 (+1.4%), Maersk container quotes up.'
  },
  {
    id: 'feed-3',
    title: 'Polymarket Geopolitical Odds: 78% probability of new Middle East security communique this week',
    source: 'Polymarket Live Geopolitics',
    category: 'polymarket',
    severity: 'elevated',
    timestamp: '19m ago',
    summary: 'Over $14.2M in betting liquidity on escalation timeframe contracts following diplomatic emergency briefing in Geneva.',
    verified: true,
    marketAssetImpact: 'US Dollar Index (DXY) 104.28 (+0.25%).'
  },
  {
    id: 'feed-4',
    title: 'USAF RQ-4B Global Hawk FORTE12 conducts persistent 18-hour surveillance over Black Sea international waters',
    source: 'FlightRadar24 / ADS-B Military Radar',
    category: 'military',
    severity: 'elevated',
    timestamp: '34m ago',
    summary: 'High-altitude strategic unmanned recon platform operating at 53,000 ft along Romanian and international Black Sea airspace with active transponder.',
    verified: true,
    marketAssetImpact: 'European gas futures and defense contract watch.'
  },
  {
    id: 'feed-5',
    title: 'USGS Seismology: M6.3 Earthquake strikes off Honshu, Japan; No Tsunami Warning issued',
    source: 'USGS Earthquake Hazards Program',
    category: 'disaster',
    severity: 'elevated',
    timestamp: '48m ago',
    summary: 'Focal depth measured at 28 km. JMA Shindo seismic intensity 4 registered across Miyagi Prefecture. Industrial semiconductor plants report normal automated shutdown checks.',
    verified: true,
    marketAssetImpact: 'Nikkei 225 futures steady (+0.2%).'
  },
  {
    id: 'feed-6',
    title: 'Cloudflare Radar: Subsea Fiber Telemetry alert on Red Sea AAE-1 & SEA-ME-WE-5 cable conduits',
    source: 'Cloudflare Radar / Global Telecom Health',
    category: 'cyber',
    severity: 'critical',
    timestamp: '1h ago',
    summary: 'Latency increase of +45ms observed between Indian subcontinent and Frankfurt financial hubs as traffic reroutes via trans-Pacific lines.',
    verified: true,
    marketAssetImpact: 'High-frequency trading routing adjustments, latency buffer expanded.'
  },
  {
    id: 'feed-7',
    title: 'OPEC+ Extraordinary Ministerial Monitoring Committee maintains voluntary production cuts of 2.2M bpd',
    source: 'Reuters Global Energy Desk',
    category: 'energy',
    severity: 'elevated',
    timestamp: '1h 20m ago',
    summary: 'Committee underscores adherence to quotas amid heightened geopolitical risk premium across critical maritime choke points.',
    verified: true,
    marketAssetImpact: 'WTI Crude pushes above $82.50/bbl resistance.'
  },
  {
    id: 'feed-8',
    title: 'Global Chip Supply Chain: Taiwan Strait maritime transit volume normalizes after 48-hour naval drill',
    source: 'Bloomberg Technology & Supply Chain',
    category: 'geopolitics',
    severity: 'elevated',
    timestamp: '2h ago',
    summary: 'Container departures from Kaohsiung and Keelung resume regular schedule; shipping insurance surcharges remain in place.',
    verified: true,
    marketAssetImpact: 'Semiconductor Index (SOXX) +1.1%, NVDA, TSM positive.'
  }
];

export const WORLD_MONITOR_DASHBOARDS = [
  {
    id: 'main',
    name: 'World Monitor (Full Intelligence)',
    url: 'https://www.worldmonitor.app/',
    description: 'Real-time global intelligence aggregator with 435+ news feeds, AI analysis, military ADS-B, and conflict mapping.',
    badge: 'Flagship Platform'
  },
  {
    id: 'finance',
    name: 'Finance Monitor',
    url: 'https://finance.worldmonitor.app/',
    description: 'Macro financial surveillance tracking central bank rates, global bond yield spreads, currency flows, and equity shocks.',
    badge: 'Capital & FX'
  },
  {
    id: 'commodity',
    name: 'Commodity Monitor',
    url: 'https://commodity.worldmonitor.app/',
    description: 'Live physical commodity intelligence for Brent, WTI, natural gas, gold, copper, lithium, and agricultural supplies.',
    badge: 'Energy & Metals'
  },
  {
    id: 'energy',
    name: 'Energy Monitor',
    url: 'https://energy.worldmonitor.app/',
    description: 'Electric grid health, LNG transit routes, oil refinery outages, pipeline telemetry, and strategic petroleum reserves.',
    badge: 'Grid & Pipelines'
  },
  {
    id: 'tech',
    name: 'Tech Monitor',
    url: 'https://tech.worldmonitor.app/',
    description: 'Semiconductor fabs, cloud region health, undersea cables, cyber incident telemetry, and AI compute clusters.',
    badge: 'Chips & Cloud'
  }
];
