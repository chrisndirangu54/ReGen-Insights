import { useMemo, useState } from 'react';
import { assessRisk, type RiskInput } from './riskEngine';

const initial: RiskInput = { hazard:'flood', county:'', probability:0.5, intensity:0.5, exposure:0.5, vulnerability:0.5, infrastructureDependency:0.5 };
const labels: Array<[keyof Pick<RiskInput,'probability'|'intensity'|'exposure'|'vulnerability'|'infrastructureDependency'>, string]> = [
  ['probability','Likelihood (assumption)'],['intensity','Hazard intensity (assumption)'],
  ['exposure','Population / asset exposure'],['vulnerability','Social / structural vulnerability'],
  ['infrastructureDependency','Critical service dependency']
];
export function RiskScenarioWorkbench(){
  const [input,setInput]=useState<RiskInput>(initial);
  const [assessed,setAssessed]=useState(false);
  const valid=input.county.trim().length>0 && input.hazard.trim().length>0;
  const output=useMemo(()=>valid?assessRisk(input):null,[input,valid]);
  const update=(next:RiskInput)=>{setInput(next);setAssessed(false)};
  return <section className="panel" aria-labelledby="risk-workbench-heading">
    <div className="panelHead"><div><h2 id="risk-workbench-heading">Geospatial risk scenario workbench</h2>
      <p>Analyst-controlled scenario calculations; not sensor measurements, AI forecasts or official warnings.</p></div>
      <span className="severity moderate">Scenario only</span>
    </div>
    <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
      <label>County or study area<br/><input value={input.county} placeholder="e.g. Kisumu" onChange={e=>update({...input,county:e.target.value})}/></label>
      <label>Hazard<br/><select value={input.hazard} onChange={e=>update({...input,hazard:e.target.value})}>
        {['flood','drought','wildfire','landslide','severe_weather','industrial','epidemic','earthquake'].map(h=><option key={h} value={h}>{h.replace('_',' ')}</option>)}
      </select></label>
    </div>
    <p>Set each assumed factor between 0 and 1. Values below are starting placeholders, not observational evidence.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
      {labels.map(([field,label])=><label key={field} style={{display:'grid',gap:5}}>
        <span>{label}: {input[field].toFixed(2)}</span>
        <input type="range" min="0" max="1" step="0.05" value={input[field]}
          onChange={e=>update({...input,[field]:Number(e.target.value)})}/>
      </label>)}
    </div>
    <div style={{marginTop:12}}><button type="button" disabled={!valid} onClick={()=>setAssessed(true)}>Calculate illustrative index</button></div>
    {assessed && output && <div aria-live="polite">
      <h3>Relative scenario index: {output.score}/100 ({output.category.replace('_',' ')})</h3>
      <p>Method: 25% likelihood + 25% intensity + 20% exposure + 15% vulnerability + 15% infrastructure dependency.</p>
      <p><strong>Not an official warning.</strong> This score is not a scientifically calibrated probability of damage or safety decision threshold.</p>
      <ul>{output.limitations.map(l=><li key={l}>{l}</li>)}</ul>
    </div>}
  </section>;
}
