/** Transparent analyst-only relative exposure score. NOT a forecast or official alert. */
export type RiskInput = {
  hazard: string; county: string;
  probability: number; intensity: number; exposure: number;
  vulnerability: number; infrastructureDependency: number;
  evidenceUrl?: string; observedAt?: string;
};
export type RiskAssessment = RiskInput & {
  score: number; category: 'low'|'moderate'|'high'|'very_high';
  limitations: string[]; status: 'scenario_only';
};
export function assessRisk(input: RiskInput): RiskAssessment {
  const fields = [input.probability,input.intensity,input.exposure,input.vulnerability,input.infrastructureDependency];
  if (fields.some(x => !Number.isFinite(x) || x < 0 || x > 1)) throw new Error('Inputs must be finite fractions between 0 and 1');
  if (!input.hazard.trim() || !input.county.trim()) throw new Error('Hazard and county are required');
  const score = Math.round(100 * (0.25*input.probability + 0.25*input.intensity + 0.20*input.exposure + 0.15*input.vulnerability + 0.15*input.infrastructureDependency));
  return {...input,score,category:score>=80?'very_high':score>=60?'high':score>=35?'moderate':'low',
    status:'scenario_only',limitations:[
      'Illustrative weighted index; weights are not calibrated to Kenyan historical losses.',
      'Cannot determine a real-world emergency or issue evacuation instructions.',
      'Requires independently validated geospatial exposure, observations and authorized analyst review.'
    ]};
}
