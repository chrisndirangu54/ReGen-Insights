import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, CloudRain, Droplets, Earth, Flame, Gauge, Leaf, Map, Radio, ShieldAlert, ThermometerSun, Waves, Wind } from 'lucide-react';

type Severity = 'Low'|'Moderate'|'High'|'Extreme';
type Hazard = { name:string; icon:string; family:string; signal:string; preparedness:string; severity:Severity };

const hazards: Hazard[] = [
  {name:'Flood',icon:'🌊',family:'Hydrology',signal:'Rainfall, river gauges, soil saturation, SAR flood extent',preparedness:'Evacuation routes, shelters, drainage and asset exposure',severity:'High'},
  {name:'Drought',icon:'☀️',family:'Climate',signal:'SPI/SPEI, rainfall anomaly, NDVI, soil moisture, reservoirs',preparedness:'Water planning, crop/livestock protection, staged restrictions',severity:'High'},
  {name:'Wildfire',icon:'🔥',family:'Fire',signal:'Thermal anomalies, fuel dryness, wind, humidity, smoke',preparedness:'Firebreaks, response staging, public warnings',severity:'Moderate'},
  {name:'Landslide / Mudslide',icon:'⛰️',family:'Terrain',signal:'Slope, rainfall intensity, soil moisture, geology, deformation',preparedness:'Slope closures, evacuation thresholds, drainage inspection',severity:'Moderate'},
  {name:'Tsunami',icon:'🌊',family:'Coastal',signal:'Earthquake feeds, sea-level gauges, official bulletins',preparedness:'Coastal evacuation zones and vertical refuge plans',severity:'Low'},
  {name:'Earthquake',icon:'📈',family:'Geophysical',signal:'Seismic networks, official event feeds, shaking intensity',preparedness:'Drop-cover-hold guidance, inspections, utility isolation',severity:'Moderate'},
  {name:'Tropical Cyclone',icon:'🌀',family:'Storm',signal:'Track, pressure, wind, rainfall, storm surge',preparedness:'Evacuation, shelter, port closure and utility protection',severity:'Low'},
  {name:'Tornado / Severe Wind',icon:'🌪️',family:'Storm',signal:'Radar, convective outlook, wind observations',preparedness:'Shelter-in-place alerts and infrastructure shutdowns',severity:'Low'},
  {name:'El Niño / La Niña',icon:'🌡️',family:'Climate',signal:'ENSO outlooks, SST anomalies, seasonal forecasts',preparedness:'Seasonal water, food, agriculture and health planning',severity:'High'},
  {name:'Deforestation',icon:'🌳',family:'Ecosystem',signal:'Optical/SAR change detection, roads, burn scars',preparedness:'Protected-area alerts, verification workflow and restoration',severity:'Moderate'},
  {name:'Radiation',icon:'☢️',family:'Technological',signal:'Authorized radiation sensors and official emergency feeds',preparedness:'Zoning, shelter/evacuation, exposure minimization and PPE guidance',severity:'Low'},
  {name:'Heatwave',icon:'🌡️',family:'Climate',signal:'Forecast temperature, wet-bulb/heat index, urban heat',preparedness:'Cooling centers, worker schedules, health outreach',severity:'High'},
  {name:'Air Quality / Smoke',icon:'🌫️',family:'Atmosphere',signal:'PM2.5/PM10, satellite aerosol/smoke, wind',preparedness:'Sensitive-group alerts, masks/filtration and activity limits',severity:'Moderate'},
  {name:'Avalanche',icon:'🏔️',family:'Cryosphere',signal:'Snowpack, slope, wind loading, temperature',preparedness:'Route closures and official avalanche bulletins',severity:'Low'},
  {name:'Coastal Erosion / Surge',icon:'🏝️',family:'Coastal',signal:'Shoreline change, waves, sea level, storm surge',preparedness:'Setbacks, evacuation and shoreline protection planning',severity:'Moderate'},
];

const severityScore: Record<Severity,number> = {Low:24,Moderate:48,High:72,Extreme:94};

export default function App(){
  const [filter,setFilter]=useState('All');
  const [selected,setSelected]=useState<Hazard>(hazards[0]);
  const families=useMemo(()=>['All',...Array.from(new Set(hazards.map(h=>h.family)))],[]);
  const visible=filter==='All'?hazards:hazards.filter(h=>h.family===filter);

  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div className="brandMark"><Earth size={25}/></div><div><b>Regen Insight</b><span>Climate & disaster intelligence</span></div></div>
      <nav>
        {['Situation Room','Hazard Monitor','Preparedness','Satellite Change','Sensors','Alerts','Reports'].map((x,i)=><button className={i===0?'active':''} key={x}>{['◉','⚠','🛡','🛰','📡','🔔','📄'][i]} {x}</button>)}
      </nav>
      <div className="sourceNote"><ShieldAlert size={18}/><div><b>Evidence-first</b><span>Operational alerts should rely on official feeds, calibrated sensors and verified remote-sensing products.</span></div></div>
    </aside>

    <main>
      <header><div><h1>Environmental Situation Room</h1><p>Multi-hazard monitoring, early warning, preparedness and mitigation.</p></div><div className="live"><Radio size={16}/> LIVE ADAPTERS</div></header>

      <section className="metrics">
        <Metric icon={<AlertTriangle/>} label="Active risk signals" value="7" hint="Demo aggregation"/>
        <Metric icon={<Droplets/>} label="Hydrology" value="Watch" hint="Flood + drought"/>
        <Metric icon={<Leaf/>} label="Ecosystem change" value="3 areas" hint="Verification queue"/>
        <Metric icon={<Activity/>} label="Sensor health" value="94%" hint="Connect telemetry"/>
      </section>

      <section className="gridTwo">
        <div className="panel mapPanel">
          <div className="panelHead"><div><h2><Map size={18}/> Risk map</h2><p>Satellite, weather, terrain, hydrology and sensor overlays</p></div><button>Layer manager</button></div>
          <div className="mapMock">
            <div className="radar r1"></div><div className="radar r2"></div>
            <div className="pin p1">Flood</div><div className="pin p2">Drought</div><div className="pin p3">Fire</div>
            <div className="mapCaption">Replace demo canvas with Leaflet + verified geospatial layers</div>
          </div>
        </div>

        <div className="panel">
          <div className="panelHead"><div><h2>Selected hazard</h2><p>{selected.family}</p></div><span className={`severity ${selected.severity.toLowerCase()}`}>{selected.severity}</span></div>
          <div className="hazardHero"><span>{selected.icon}</span><div><h3>{selected.name}</h3><div className="riskBar"><i style={{width:`${severityScore[selected.severity]}%`}}/></div></div></div>
          <Info label="Signals" text={selected.signal}/>
          <Info label="Preparedness & mitigation" text={selected.preparedness}/>
          <div className="actions"><button>Open playbook</button><button className="secondary">Create exercise</button></div>
        </div>
      </section>

      <section className="panel">
        <div className="panelHead"><div><h2>Hazard intelligence catalog</h2><p>Choose a hazard to review monitoring inputs and response planning.</p></div></div>
        <div className="filters">{families.map(f=><button onClick={()=>setFilter(f)} className={filter===f?'chosen':''} key={f}>{f}</button>)}</div>
        <div className="hazards">{visible.map(h=><button key={h.name} className={selected.name===h.name?'hazardCard selected':'hazardCard'} onClick={()=>setSelected(h)}><span className="hazIcon">{h.icon}</span><div><b>{h.name}</b><span>{h.signal}</span></div><em className={h.severity.toLowerCase()}>{h.severity}</em></button>)}</div>
      </section>

      <section className="gridThree">
        <Mini icon={<CloudRain/>} title="Hydromet intelligence" text="Rainfall, river/lake levels, soil moisture, weather radar, seasonal outlooks and runoff models."/>
        <Mini icon={<ThermometerSun/>} title="Climate readiness" text="Heat, drought, ENSO, water stress, vegetation anomalies, food-security and health planning."/>
        <Mini icon={<Waves/>} title="Coastal & ocean" text="Storm surge, tsunami bulletins, waves, coastal erosion, sea level and evacuation-zone exposure."/>
        <Mini icon={<Flame/>} title="Fire & ecosystem" text="Active fire, burn severity, smoke, forest loss, illegal clearing and restoration verification."/>
        <Mini icon={<Wind/>} title="Severe weather" text="Wind, thunderstorms, cyclone track, tornado risk, lightning and infrastructure exposure."/>
        <Mini icon={<Gauge/>} title="Sensor + edge network" text="River gauges, rain gauges, weather stations, radiation monitors, cameras and resilient IoT gateways."/>
      </section>
    </main>
  </div>
}

function Metric({icon,label,value,hint}:{icon:any,label:string,value:string,hint:string}){return <div className="metric"><div>{icon}</div><section><span>{label}</span><b>{value}</b><small>{hint}</small></section></div>}
function Info({label,text}:{label:string,text:string}){return <div className="info"><b>{label}</b><p>{text}</p></div>}
function Mini({icon,title,text}:{icon:any,title:string,text:string}){return <div className="mini"><div>{icon}</div><h3>{title}</h3><p>{text}</p></div>}
