export type InfrastructureSector =
  | 'power'
  | 'transport'
  | 'water_sanitation'
  | 'telecom_digital'
  | 'health_emergency'
  | 'fuel_logistics'
  | 'food_supply'
  | 'industrial'
  | 'dams'
  | 'ports_airports'
  | 'other';

export interface InfrastructureAsset {
  id: string;
  name: string;
  sector: InfrastructureSector;
  latitude: number;
  longitude: number;
  criticality: 1 | 2 | 3 | 4 | 5;
  condition?: 'good' | 'fair' | 'poor' | 'unknown';
  backupPowerHours?: number;
  redundancy?: number;
  populationServed?: number;
  dependencies: string[];
  supplies: string[];
}

export interface HazardEvent {
  id: string;
  type: string;
  issuedAt: string;
  expiresAt?: string;
  source: string;
  confidence?: number;
  severity: 'low' | 'moderate' | 'high' | 'extreme';
  footprintGeoJson?: unknown;
  secondaryHazards: string[];
}

export interface AssetImpactEstimate {
  hazardEventId: string;
  assetId: string;
  exposure: number;
  fragility: number;
  failureProbability: number;
  expectedDowntimeHours?: number;
  isolationRisk?: number;
  rationale: string[];
}

export interface CascadeStep {
  id: string;
  order: number;
  triggerId: string;
  affectedId: string;
  relation: 'direct_damage' | 'dependency_failure' | 'access_loss' | 'capacity_overload' | 'secondary_hazard';
  probability: number;
  estimatedDelayMinutes?: number;
}

export interface CascadeScenario {
  id: string;
  name: string;
  hazardEventId: string;
  steps: CascadeStep[];
  affectedPopulation?: number;
  affectedCriticalFacilities?: number;
  serviceOutages: InfrastructureSector[];
  confidence: number;
}