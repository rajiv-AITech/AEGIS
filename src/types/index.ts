// ── Shared platform types ──────────────────────────────────────────────────

export type PropertyMode = 'residential' | 'commercial';
export type ThreatLevel  = 'normal' | 'watch' | 'elevated' | 'alert';
export type AgentStatus  = 'active' | 'paused' | 'error';
export type PEMSMode     = 'comfort' | 'off-peak' | 'away' | 'deep-sleep' | 'grid-down';
export type TouWindow    = 'off-peak' | 'mid-peak' | 'on-peak';
export type SPTier       = 'standard' | 'pro-ai' | 'enterprise-ai';

// ── V1 core types ──────────────────────────────────────────────────────────

export interface Device {
  id: string;
  name: string;
  zone: string;
  type: 'lock' | 'sensor' | 'camera' | 'thermostat' | 'light' | 'panel';
  online: boolean;
  state: Record<string, unknown>;
}

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  triggerCount: number;
  resolutionRate: number;   // 0–1
  lastFired?: Date;
  description: string;
  systemPrompt: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  nlSource?: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  type: PropertyMode;
  threatScore: number;      // 0–10
  devices: number;
  cameras: number;
}

// ── V2 new types ───────────────────────────────────────────────────────────

export interface ServiceProvider {
  id: string;
  name: string;
  location: string;
  tier: SPTier;
  subscribers: number;
  aiResolutionRate: number;   // 0–1
  avgThreatScore: number;
  energySavingsMonthly: number; // USD
  rvmEvents: number;
  yearsPartner: number;
  status: 'optimal' | 'scaling' | 'upgrade-ready';
}

export interface ResolutionEvent {
  id: string;
  timestamp: Date;
  type: string;
  zone: string;
  disposition: 'auto-resolved' | 'escalated' | 'dispatched';
  confidence: number;       // 0–1
  agentId: string;
  durationMs: number;
}

export interface ArrMetrics {
  totalEvents: number;
  autoResolved: number;
  escalated: number;
  dispatched: number;
  resolutionRate: number;   // 0–1
  baselineRate: number;     // human-only baseline
  byAgent: Record<string, number>;
  windowDays: number;
}

export interface CommercialZone {
  id: string;
  name: string;
  hours: string;
  clearanceLevel: number;   // 1–5
  occupiedNow: boolean;
  threatScore: number;      // 0–10
  threatLevel: ThreatLevel;
  cameras: number;
  activeAlerts: number;
}

export interface AccessEvent {
  id: string;
  timestamp: Date;
  person: string;
  role: string;
  zone: string;
  result: 'granted-normal' | 'granted-flagged' | 'denied';
  note?: string;
}

export interface OntologyNode {
  id: string;
  label: string;
  domain: 'property' | 'security' | 'energy' | 'behavioral';
  description: string;
  connections: string[];
  entityCount?: number;
}

export interface EvDevice {
  id: string;
  name: string;
  make: string;
  model: string;
  stateOfCharge: number;    // 0–100
  chargeRateKw: number;
  targetSoc: number;
  targetByHour: number;
  location: string;
  status: 'charging' | 'idle' | 'paused-dr' | 'full';
}

export interface GridEvent {
  id: string;
  timestamp: Date;
  type: 'demand-response' | 'off-peak' | 'nilm-alert' | 'peak-warning';
  message: string;
  savingsUsd?: number;
}

export interface PemsState {
  mode: PEMSMode;
  touWindow: TouWindow;
  ratePerKwh: number;
  totalLoadKw: number;
  securityMeshKw: number;
  batteryPct: number;
  evCount: number;
}
