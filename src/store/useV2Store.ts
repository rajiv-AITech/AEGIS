import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ServiceProvider, ResolutionEvent, CommercialZone,
  OntologyNode, EvDevice, GridEvent, ArrMetrics,
  PropertyMode,
} from '@/types';

// ── Seed data ──────────────────────────────────────────────────────────────

const SEED_SPS: ServiceProvider[] = [
  { id: 'sp1', name: 'Guardian Security (MD)', location: 'McLean, VA', tier: 'enterprise-ai',
    subscribers: 48210, aiResolutionRate: 0.931, avgThreatScore: 2.1,
    energySavingsMonthly: 847000, rvmEvents: 1204, yearsPartner: 12, status: 'optimal' },
  { id: 'sp2', name: 'SecureNow Pro (TX)', location: 'Houston, TX', tier: 'pro-ai',
    subscribers: 31450, aiResolutionRate: 0.882, avgThreatScore: 4.7,
    energySavingsMonthly: 521000, rvmEvents: 876, yearsPartner: 8, status: 'scaling' },
  { id: 'sp3', name: 'NetAlarm Canada (ON)', location: 'Toronto, ON', tier: 'pro-ai',
    subscribers: 22100, aiResolutionRate: 0.851, avgThreatScore: 2.8,
    energySavingsMonthly: 392000, rvmEvents: 643, yearsPartner: 5, status: 'optimal' },
  { id: 'sp4', name: 'Apex Monitoring (CA)', location: 'Los Angeles, CA', tier: 'standard',
    subscribers: 15320, aiResolutionRate: 0.621, avgThreatScore: 5.3,
    energySavingsMonthly: 0, rvmEvents: 289, yearsPartner: 3, status: 'upgrade-ready' },
  { id: 'sp5', name: 'SmartShield (FL)', location: 'Miami, FL', tier: 'standard',
    subscribers: 18940, aiResolutionRate: 0.594, avgThreatScore: 7.1,
    energySavingsMonthly: 0, rvmEvents: 441, yearsPartner: 6, status: 'upgrade-ready' },
  { id: 'sp6', name: 'PacificAlarm (WA)', location: 'Seattle, WA', tier: 'pro-ai',
    subscribers: 27600, aiResolutionRate: 0.867, avgThreatScore: 3.2,
    energySavingsMonthly: 448000, rvmEvents: 721, yearsPartner: 7, status: 'scaling' },
];

const SEED_ZONES: CommercialZone[] = [
  { id: 'z1', name: 'Main Lobby', hours: '07:00–22:00', clearanceLevel: 1,
    occupiedNow: true, threatScore: 1.2, threatLevel: 'normal', cameras: 4, activeAlerts: 0 },
  { id: 'z2', name: 'Server Room', hours: 'Restricted', clearanceLevel: 4,
    occupiedNow: false, threatScore: 5.8, threatLevel: 'elevated', cameras: 2, activeAlerts: 1 },
  { id: 'z3', name: 'Loading Dock', hours: '06:00–18:00', clearanceLevel: 2,
    occupiedNow: false, threatScore: 3.4, threatLevel: 'watch', cameras: 3, activeAlerts: 0 },
  { id: 'z4', name: 'Executive Floor', hours: 'Level 4 only', clearanceLevel: 4,
    occupiedNow: false, threatScore: 8.1, threatLevel: 'alert', cameras: 6, activeAlerts: 2 },
  { id: 'z5', name: 'Parking Structure', hours: '24/7', clearanceLevel: 1,
    occupiedNow: true, threatScore: 2.1, threatLevel: 'normal', cameras: 8, activeAlerts: 0 },
  { id: 'z6', name: 'Data Center Annex', hours: 'Air-gapped', clearanceLevel: 5,
    occupiedNow: false, threatScore: 6.2, threatLevel: 'elevated', cameras: 4, activeAlerts: 1 },
];

const SEED_ONTOLOGY: OntologyNode[] = [
  { id: 'property-intel', label: 'Property Intelligence Hub', domain: 'behavioral',
    description: 'Central coordination node that receives signals from all domains and produces unified property intelligence scores.',
    connections: ['residential', 'commercial', 'multifamily', 'enterprise', 'threat-patterns', 'energy-profiles', 'behavioral-baselines'],
    entityCount: 0 },
  { id: 'residential', label: 'Residential', domain: 'property',
    description: 'Single-family, townhouse, condo, vacation, and rental properties. Each sub-type carries distinct threat pattern distributions, energy profiles, and behavioral baselines. Vacation properties encode an expected-absence baseline — AID and PEMS respond differently than for a primary residence.',
    connections: ['property-intel', 'aid', 'energyhub', 'behavioral-baselines'], entityCount: 6840000 },
  { id: 'commercial', label: 'Commercial', domain: 'property',
    description: 'Retail, office, and light industrial. Requires shift-aware behavioral modeling, role-hierarchy access control, and multi-zone threat scoring. OpenEye camera zones, AID deterrence zones, and EnergyHub load zones are correlated through this node.',
    connections: ['property-intel', 'aid', 'openeye', 'energyhub', 'smart-access'], entityCount: 1200000 },
  { id: 'multifamily', label: 'Multi-Family', domain: 'property',
    description: 'Apartment complexes, condos, and student housing. PointCentral is ADC\'s product for this vertical. The ontology connects PointCentral access control with per-unit EnergyHub profiles and common-area AID deterrence.',
    connections: ['property-intel', 'aid', 'energyhub'], entityCount: 980000 },
  { id: 'enterprise', label: 'Enterprise', domain: 'property',
    description: 'Office campuses, government facilities, industrial sites. Shift-aware access control, multi-zone threat scoring, and Shooter Detection Systems integration are enterprise-specific branches added in v2.',
    connections: ['property-intel', 'openeye', 'rvm', 'smart-access'], entityCount: 280000 },
  { id: 'aid', label: 'AID · Deterrence', domain: 'security',
    description: 'AI Deterrence contributes threat events, deterrence outcomes, and adaptive voice interaction results. Events are cross-referenced with property type and time-of-day to train threat pattern nodes — each resolution improves future deterrence precision.',
    connections: ['property-intel', 'rvm', 'threat-patterns', 'behavioral-baselines'], entityCount: 142000 },
  { id: 'rvm', label: 'RVM · CHeKT', domain: 'security',
    description: 'Remote Video Monitoring plus CHeKT (acquired Feb 2025) enables RVM for central stations with third-party cameras. The ontology connects CHeKT\'s on-premise model with ADC\'s cloud AI — central station operators benefit from ADC\'s AI classification without hardware replacement.',
    connections: ['property-intel', 'aid', 'openeye', 'threat-patterns'], entityCount: 1204 },
  { id: 'openeye', label: 'OpenEye Video', domain: 'security',
    description: 'Enterprise-grade video analytics: license plate recognition, people counting, loitering detection, scene classification. Cross-referenced with AID deterrence model, OpenEye events become the richest input into threat pattern training.',
    connections: ['property-intel', 'rvm', 'aid', 'threat-patterns'], entityCount: 2000000 },
  { id: 'energyhub', label: 'EnergyHub PEMS', domain: 'energy',
    description: 'Contributes DER state, TOU pricing windows, grid demand signals, and occupancy-intent states. The PEMS priority stack (Safety → Security → Energy) is enforced at the ontology level — no energy optimization can compromise the Security Mesh.',
    connections: ['property-intel', 'ev-grid', 'nilm', 'energy-profiles'], entityCount: 1600000 },
  { id: 'ev-grid', label: 'EV · Grid-Edge', domain: 'energy',
    description: 'Added in v2 following the EnergyHub–GM partnership. EV charging schedules are a new DER class — their patterns interact with TOU windows, demand response signals, and battery SOC. Connects to both the Energy Optimizer agent and NILM anomaly detection.',
    connections: ['energyhub', 'nilm', 'energy-profiles'], entityCount: 48000 },
  { id: 'nilm', label: 'NILM · Load AI', domain: 'energy',
    description: 'Non-Intrusive Load Monitoring detects appliance signatures from aggregate power draw. NILM anomalies (HVAC deviation, unexpected high-draw events) feed both Energy Optimizer and — in commercial properties — the threat detection model. A running appliance at 3AM is a meaningful security signal.',
    connections: ['energyhub', 'ev-grid', 'threat-patterns'], entityCount: 3200000 },
  { id: 'threat-patterns', label: 'Threat Patterns', domain: 'behavioral',
    description: '142 distinct threat pattern types derived from 9.3M subscribers and 2B+ annual events. Patterns are property-type-aware (retail differs from residential), time-aware (after-hours vs. business hours), and device-aware (camera classification vs. sensor vs. access badge).',
    connections: ['property-intel', 'aid', 'rvm', 'behavioral-baselines'], entityCount: 142 },
  { id: 'energy-profiles', label: 'Energy Profiles', domain: 'behavioral',
    description: '89 distinct energy profiles mapped to property types, climate zones, occupancy patterns, and device inventories. Used by PEMS for baseline expectations and by NILM for anomaly detection. EV profiles were added in v2 following the GM partnership.',
    connections: ['property-intel', 'energyhub', 'behavioral-baselines'], entityCount: 89 },
  { id: 'behavioral-baselines', label: 'Behavioral Baselines', domain: 'behavioral',
    description: 'The most valuable node class in the ontology. Baselines encode what "normal" looks like for each property × time × device combination. AI resolution accuracy is directly proportional to baseline precision — which is why the 9.3M-subscriber training corpus is a structural competitive moat.',
    connections: ['property-intel', 'threat-patterns', 'energy-profiles'], entityCount: 847 },
  { id: 'smart-access', label: 'Smart Access', domain: 'security',
    description: 'Shift-aware access control with role-hierarchy modeling. Cross-zone anomaly detection identifies movement patterns inconsistent with an employee\'s role and shift schedule. Anomalous access events feed both the threat pattern training set and the SP intelligence dashboard.',
    connections: ['commercial', 'enterprise', 'threat-patterns'], entityCount: 4102 },
];

const SEED_EVS: EvDevice[] = [
  { id: 'ev1', name: '2024 Chevrolet Blazer EV', make: 'GM', model: 'Blazer EV',
    stateOfCharge: 78, chargeRateKw: 6.2, targetSoc: 90, targetByHour: 6,
    location: 'Garage', status: 'charging' },
  { id: 'ev2', name: 'PowerBank Home Storage', make: 'GM', model: 'PowerBank 14kWh',
    stateOfCharge: 91, chargeRateKw: 0, targetSoc: 100, targetByHour: 6,
    location: 'Utility Room', status: 'idle' },
];

const SEED_ARR: ArrMetrics = {
  totalEvents: 162300,
  autoResolved: 141801,
  escalated: 18200,
  dispatched: 2100,
  resolutionRate: 0.874,
  baselineRate: 0.61,
  byAgent: {
    'AI Deterrence': 0.912,
    'Remote Video Monitor': 0.887,
    'Perimeter Guard': 0.843,
    'Energy Optimizer': 0.961,
    'Smart Access Controller': 0.798,
  },
  windowDays: 30,
};

// ── Store ──────────────────────────────────────────────────────────────────

interface V2State {
  propertyMode: PropertyMode;
  serviceProviders: ServiceProvider[];
  commercialZones: CommercialZone[];
  ontologyNodes: OntologyNode[];
  evDevices: EvDevice[];
  gridEvents: GridEvent[];
  resolutionEvents: ResolutionEvent[];
  arrMetrics: ArrMetrics;

  setPropertyMode: (m: PropertyMode) => void;
  addResolutionEvent: (e: ResolutionEvent) => void;
  updateZoneThreat: (zoneId: string, score: number) => void;
  updateEvSoc: (evId: string, soc: number) => void;
  addGridEvent: (e: GridEvent) => void;
}

export const useV2Store = create<V2State>()(
  persist(
    (set) => ({
      propertyMode: 'residential',
      serviceProviders: SEED_SPS,
      commercialZones: SEED_ZONES,
      ontologyNodes: SEED_ONTOLOGY,
      evDevices: SEED_EVS,
      gridEvents: [],
      resolutionEvents: [],
      arrMetrics: SEED_ARR,

      setPropertyMode: (m) => set({ propertyMode: m }),
      addResolutionEvent: (e) =>
        set((s) => ({ resolutionEvents: [e, ...s.resolutionEvents].slice(0, 200) })),
      updateZoneThreat: (zoneId, score) =>
        set((s) => ({
          commercialZones: s.commercialZones.map(z =>
            z.id === zoneId ? { ...z, threatScore: score } : z
          ),
        })),
      updateEvSoc: (evId, soc) =>
        set((s) => ({
          evDevices: s.evDevices.map(e => e.id === evId ? { ...e, stateOfCharge: soc } : e),
        })),
      addGridEvent: (e) =>
        set((s) => ({ gridEvents: [e, ...s.gridEvents].slice(0, 50) })),
    }),
    { name: 'aegis-v2-store' }
  )
);
