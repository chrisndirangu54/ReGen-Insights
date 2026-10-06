import { useMemo, useState } from 'react';
import SuperAdminDashboard from './SuperAdminDashboard';
import {
  Activity, AlertTriangle, Biohazard, Building2, CloudLightning, CloudRain, Droplets,
  Earth, Factory, Gauge, GitBranch, HeartPulse, Map, Mountain, Radio,
  ShieldAlert, Siren, ThermometerSun, Waves, Zap
} from 'lucide-react';

type Severity = 'Low'|'Moderate'|'High'|'Extreme';
type InfrastructureRisk = { power:string; transport:string; water:string; telecom:string; health:string; other:string };
type Hazard = {
  name:string; icon:string; family:string; signal:string; preparedness:string;
  severity:Severity; infrastructure:InfrastructureRisk; cascade:string;
};

const hazards: Hazard[] = [
  {name:'Flood',icon:'🌊',family:'Hydrology',signal:'Rainfall, river gauges, soil saturation, SAR flood extent',preparedness:'Evacuation routes, shelters, drainage, pumps, sandbags and asset exposure',severity:'High',infrastructure:{power:'Substation inundation, pole failure and short circuits',transport:'Road, bridge and rail washout',water:'Treatment contamination and sewer overflow',telecom:'Tower and backhaul outages',health:'Hospital access and backup-power stress',other:'Fuel depots, warehouses and drainage failure'},cascade:'Flood → road/bridge closure → logistics disruption → hospital and food-supply pressure'},
  {name:'Drought',icon:'☀️',family:'Climate',signal:'SPI/SPEI, rainfall anomaly, NDVI, soil moisture, groundwater and reservoirs',preparedness:'Water planning, crop/livestock protection, staged restrictions and emergency supply',severity:'High',infrastructure:{power:'Hydropower reduction and cooling-water constraints',transport:'Dust damage and wildfire-related closures',water:'Reservoir depletion and borehole stress',telecom:'Remote-site power stress',health:'Heat, nutrition and sanitation burden',other:'Irrigation, livestock and food-system disruption'},cascade:'Drought → water scarcity → crop loss → food-price shock → health and migration pressure'},
  {name:'Wildfire',icon:'🔥',family:'Fire',signal:'Thermal anomalies, fuel dryness, wind, humidity and smoke',preparedness:'Firebreaks, response staging, evacuation and public warnings',severity:'Moderate',infrastructure:{power:'Transmission-line trips and pole damage',transport:'Road closure from smoke/fire',water:'Firefighting drawdown and watershed contamination',telecom:'Tower/site exposure',health:'Burn, trauma and smoke surge',other:'Industrial sites and settlements at wildland interface'},cascade:'Wildfire → transmission failure → communications loss → constrained evacuation and response'},
  {name:'Landslide / Mudslide',icon:'⛰️',family:'Terrain',signal:'Slope, rainfall intensity, soil moisture, geology and deformation',preparedness:'Slope closures, evacuation thresholds, drainage inspection and stabilization',severity:'Moderate',infrastructure:{power:'Line/pole and pipeline rupture',transport:'Road, bridge and rail burial',water:'Pipe breaks and intake blockage',telecom:'Fiber route severance',health:'Access isolation and mass-casualty risk',other:'Building-foundation and retaining-wall failure'},cascade:'Intense rain → slope failure → road/pipeline break → isolated communities and service interruption'},
  {name:'Tsunami',icon:'🌊',family:'Coastal',signal:'Earthquake feeds, sea-level gauges and authoritative tsunami bulletins',preparedness:'Coastal evacuation zones, sirens and vertical refuge plans',severity:'Low',infrastructure:{power:'Coastal substation and generation damage',transport:'Port, road and airport inundation',water:'Saltwater intrusion and wastewater failure',telecom:'Coastal cable/tower damage',health:'Hospital evacuation and mass-casualty demand',other:'Ports, fuel storage and desalination facilities'},cascade:'Tsunami → port/fuel damage → transport disruption → prolonged regional supply shortages'},
  {name:'Earthquake',icon:'📈',family:'Geophysical',signal:'Seismic networks, official event feeds and shaking intensity',preparedness:'Drop-cover-hold, inspections, shutoff protocols and search-and-rescue staging',severity:'Moderate',infrastructure:{power:'Grid trips, transformer/substation damage',transport:'Bridge, tunnel, road and rail damage',water:'Main breaks, dam and sewer damage',telecom:'Fiber, tower and data-center interruption',health:'Structural hospital damage and surge demand',other:'Gas leaks, building collapse and industrial releases'},cascade:'Earthquake → utility rupture → fire/chemical release → transport blockage → response overload'},
  {name:'Tropical Cyclone',icon:'🌀',family:'Storm',signal:'Track, pressure, wind, rainfall, waves and storm surge',preparedness:'Evacuation, shelter, port closure and utility protection',severity:'High',infrastructure:{power:'Wide-area line/pole damage',transport:'Road, bridge, airport and port closures',water:'Flooding, treatment failure and salt intrusion',telecom:'Tower/backhaul outages',health:'Hospital access and backup-power demand',other:'Fuel, ports, drainage and housing'},cascade:'Cyclone → surge/flood → landslide → grid/road failure → cascading urban service disruption'},
  {name:'Tornado / Severe Wind',icon:'🌪️',family:'Storm',signal:'Radar, convective outlooks, lightning and wind observations',preparedness:'Shelter-in-place, shutdown protocols and debris planning',severity:'Moderate',infrastructure:{power:'Distribution-line and substation damage',transport:'Debris blockage and aviation disruption',water:'Pump-station power loss',telecom:'Tower and antenna damage',health:'Trauma surge and facility damage',other:'Roof, warehouse and industrial-site damage'},cascade:'Severe wind → grid outage → water/telecom interruption → emergency-service degradation'},
  {name:'Lightning',icon:'⚡',family:'Storm',signal:'Lightning detection networks, convective radar and thunderstorm nowcasts',preparedness:'Outdoor shutdowns, surge protection, shelter alerts and ignition readiness',severity:'Moderate',infrastructure:{power:'Surge, transformer and line faults',transport:'Airport/rail operations suspension',water:'SCADA and pump electronics exposure',telecom:'Tower/equipment surge damage',health:'Direct-strike injuries and EMS demand',other:'Wildfire ignition and industrial electronics damage'},cascade:'Lightning → substation/telecom fault → control-system outage → operational disruption'},
  {name:'El Niño / La Niña',icon:'🌡️',family:'Climate',signal:'ENSO outlooks, SST anomalies and seasonal forecasts',preparedness:'Seasonal water, food, agriculture, energy and health planning',severity:'High',infrastructure:{power:'Hydropower variability and weather-driven demand shifts',transport:'Flood/drought damage exposure',water:'Reservoir imbalance and treatment stress',telecom:'Indirect outage exposure',health:'Heat, vector and food-security burden',other:'Agriculture, insurance and supply-chain stress'},cascade:'Climate anomaly → flood/drought extremes → infrastructure damage → economic and health impacts'},
  {name:'Deforestation',icon:'🌳',family:'Ecosystem',signal:'Optical/SAR change detection, roads, burn scars and canopy-loss alerts',preparedness:'Protected-area alerts, verification, enforcement and restoration',severity:'Moderate',infrastructure:{power:'Erosion/sediment impacts on hydropower and lines',transport:'Slope instability affecting roads',water:'Watershed degradation and sedimentation',telecom:'Indirect exposure through access routes',health:'Water quality and heat exposure',other:'Reservoir siltation and ecosystem-service loss'},cascade:'Forest loss → runoff/erosion increase → flood/landslide risk → road and water-system damage'},
  {name:'Radiation',icon:'☢️',family:'Technological',signal:'Authorized radiation sensors and official emergency feeds',preparedness:'Zoning, shelter/evacuation, exposure minimization, dosimetry and PPE guidance',severity:'Low',infrastructure:{power:'Facility shutdown and exclusion zones',transport:'Route and port restrictions',water:'Source contamination monitoring',telecom:'Emergency communications continuity',health:'Decontamination and specialist-care demand',other:'Industrial/nuclear site containment'},cascade:'Radiological incident → exclusion zone → transport/workforce restrictions → prolonged service disruption'},
  {name:'Industrial / Chemical Spill',icon:'🧪',family:'Technological',signal:'Facility alarms, hazmat reports, air/water sensors, plume models and official incident feeds',preparedness:'Isolation zones, shelter/evacuate decisions, containment and decontamination',severity:'High',infrastructure:{power:'Plant shutdown and hazardous-area isolation',transport:'Road/rail/port closures',water:'Intake shutdown and treatment contamination',telecom:'Responder communications continuity',health:'Toxic exposure and hospital surge',other:'Factories, fuel depots, pipelines and warehouses'},cascade:'Industrial failure → toxic release → evacuation/road closure → water shutdown → regional service disruption'},
  {name:'Dam Failure',icon:'🏞️',family:'Hydrology',signal:'Reservoir level, seepage, structural instrumentation, rainfall, spillway performance and operator bulletins',preparedness:'Inundation maps, sirens, downstream evacuation, controlled drawdown and inspection',severity:'Extreme',infrastructure:{power:'Hydropower loss and downstream substation flooding',transport:'Bridge and road washout',water:'Supply interruption and contamination',telecom:'Warning-system and tower exposure',health:'Mass-casualty and evacuation demand',other:'Downstream settlements, irrigation and industrial facilities'},cascade:'Dam breach → flash flood → bridge/grid/water failures → isolated downstream communities'},
  {name:'Glacial / Lake Outburst Flood',icon:'🧊',family:'Cryosphere',signal:'Lake level, glacier retreat, moraine stability, satellite change and seismic/remote sensors',preparedness:'Downstream evacuation, lake monitoring, controlled drainage and route planning',severity:'High',infrastructure:{power:'Hydropower and transmission exposure',transport:'Mountain road/bridge washout',water:'Intake destruction and sediment load',telecom:'Remote valley isolation',health:'Rapid-onset mass-casualty risk',other:'Tourism sites, pipelines and settlements'},cascade:'Outburst flood → valley infrastructure loss → communications isolation → delayed rescue'},
  {name:'Heatwave',icon:'🌡️',family:'Climate',signal:'Forecast temperature, wet-bulb/heat index and urban heat observations',preparedness:'Cooling centers, work-rest rules, hydration and health outreach',severity:'High',infrastructure:{power:'Peak-demand overload and transformer stress',transport:'Rail buckling and road-surface damage',water:'Demand surge and reservoir stress',telecom:'Cooling load at network sites',health:'Heat illness and hospital surge',other:'Cold-chain and data-center cooling stress'},cascade:'Heatwave → peak power demand → grid outage → cooling/water failures → health emergency'},
  {name:'Air Quality / Smoke',icon:'🌫️',family:'Atmosphere',signal:'PM2.5/PM10, satellite aerosol/smoke, fire emissions and wind',preparedness:'Sensitive-group alerts, filtration, masks and activity limits',severity:'Moderate',infrastructure:{power:'Indirect load from filtration/cooling',transport:'Visibility-related road/aviation disruption',water:'Limited direct effect',telecom:'Limited direct effect',health:'Respiratory/cardiovascular surge',other:'School/workplace closures'},cascade:'Smoke episode → visibility/health impacts → transport and workforce disruption'},
  {name:'Water Quality Emergency',icon:'🚱',family:'Hydrology',signal:'Turbidity, conductivity, pH, dissolved oxygen, microbial/toxin tests, satellite bloom indicators and plant alarms',preparedness:'Intake isolation, boil-water notices, alternative supply and treatment adjustment',severity:'High',infrastructure:{power:'Treatment operations depend on reliable power',transport:'Tanker and logistics demand',water:'Treatment and distribution impairment',telecom:'Public warning and utility telemetry dependency',health:'Waterborne/toxic exposure risk',other:'Food processing and industrial users'},cascade:'Contamination → intake shutdown → water shortage → hospital and sanitation stress'},
  {name:'Avalanche',icon:'🏔️',family:'Cryosphere',signal:'Snowpack, slope, wind loading, temperature and official avalanche bulletins',preparedness:'Route closures, rescue staging and controlled release where authorized',severity:'Low',infrastructure:{power:'Mountain line/pole damage',transport:'Road/rail burial',water:'Possible intake blockage',telecom:'Remote corridor isolation',health:'Rescue access constraints',other:'Ski/tourism and mountain facilities'},cascade:'Avalanche → route blockage → utility/access interruption → delayed emergency response'},
  {name:'Coastal Erosion / Surge',icon:'🏝️',family:'Coastal',signal:'Shoreline change, waves, sea level, tides and storm surge',preparedness:'Setbacks, evacuation, dunes/wetlands and shoreline protection',severity:'Moderate',infrastructure:{power:'Coastal substations and buried cables',transport:'Road/port/rail erosion',water:'Salt intrusion and sewer damage',telecom:'Coastal cable and tower exposure',health:'Access and evacuation pressure',other:'Hotels, ports and housing'},cascade:'Coastal erosion/surge → road/water damage → economic displacement and service loss'},
  {name:'Marine Heatwave',icon:'🌡️',family:'Ocean',signal:'Sea-surface temperature anomalies, duration, coral stress, oxygen and ecosystem indicators',preparedness:'Fisheries advisories, reef protection, aquaculture contingency and ecosystem monitoring',severity:'Moderate',infrastructure:{power:'Cooling-water and coastal-energy implications',transport:'Limited direct effect',water:'Desalination/intake ecosystem stress',telecom:'Subsea assets monitored indirectly',health:'Seafood/toxin and livelihood effects',other:'Fisheries, tourism and aquaculture'},cascade:'Marine heatwave → ecosystem/fishery loss → livelihood shock → food and local-economy pressure'},
  {name:'Desertification',icon:'🏜️',family:'Climate',signal:'Vegetation trend, bare-soil expansion, erosion, rainfall deficit and land-use pressure',preparedness:'Land restoration, grazing plans, water harvesting and erosion control',severity:'High',infrastructure:{power:'Dust exposure and reduced hydropower indirectly',transport:'Dust and sand encroachment',water:'Recharge decline and reservoir sedimentation',telecom:'Remote-site dust/heat stress',health:'Dust, heat and nutrition effects',other:'Agriculture and settlement viability'},cascade:'Land degradation → water/food stress → migration pressure → infrastructure overload elsewhere'},
  {name:'Locust / Vector Outbreak',icon:'🦗',family:'Biological',signal:'Vegetation/rainfall suitability, field surveillance, breeding-zone reports and vector habitat indicators',preparedness:'Surveillance, targeted control, crop protection and public-health measures',severity:'High',infrastructure:{power:'Indirect operational demand',transport:'Response logistics and access',water:'Vector breeding linked to standing water',telecom:'Surveillance and reporting dependency',health:'Vector-borne disease surge',other:'Food supply, livestock and agriculture'},cascade:'Outbreak → crop/health losses → logistics pressure → food/medical supply-chain strain'},
  {name:'Disease-Related Climate Risk',icon:'🦠',family:'Biological',signal:'Temperature/rainfall anomalies, vector suitability, water conditions, syndromic surveillance and health bulletins',preparedness:'Early surveillance, vector control, water/sanitation protection and health-capacity planning',severity:'High',infrastructure:{power:'Cold-chain and hospital backup-power dependence',transport:'Patient and sample logistics',water:'WASH system integrity is critical',telecom:'Surveillance and public messaging',health:'Hospital and laboratory surge',other:'Schools, workplaces and supply chains'},cascade:'Climate anomaly → disease transmission increase → hospital surge → workforce/logistics disruption'},
  {name:'Volcanic Activity',icon:'🌋',family:'Geophysical',signal:'Seismicity, deformation, gas, thermal anomalies, ash observations and official volcano bulletins',preparedness:'Exclusion zones, ash protection, evacuation, aviation and lahar planning',severity:'High',infrastructure:{power:'Ash contamination and line/substation damage',transport:'Road closure and aviation shutdown',water:'Ash/chemical contamination and lahar damage',telecom:'Tower/equipment ash exposure',health:'Respiratory, burn and trauma demand',other:'Lahars, buildings, industry and agriculture'},cascade:'Eruption → ash/lahar → airport/road/water failure → prolonged regional disruption'},
  {name:'Compound / Cascading Disaster',icon:'🔗',family:'Compound',signal:'Multi-hazard correlation, dependency graphs, infrastructure telemetry, exposure and timing overlap',preparedness:'Scenario trees, redundancy, mutual aid, continuity plans and staged cross-sector response',severity:'Extreme',infrastructure:{power:'Dependency hub: loss propagates to water, telecom, hospitals and transport',transport:'Access loss amplifies all other failures',water:'Power, chemical and logistics dependencies can cause rapid service loss',telecom:'Failure slows coordination and situational awareness',health:'Simultaneous facility damage, access loss and surge',other:'Fuel, finance, food, ports, dams and digital services'},cascade:'Cyclone → flood → landslide → grid failure → telecom outage → water outage → hospital/logistics degradation'},
];

const severityScore: Record<Severity,number> = {Low:24,Moderate:48,High:72,Extreme:94};

export default function App(){
  const [filter,setFilter]=useState('All');
  const [selected,setSelected]=useState<Hazard>(hazards[0]);
  const [showAdmin,setShowAdmin]=useState(false);
  const families=useMemo(()=>['All',...Array.from(new Set(hazards.map(h=>h.family)))],[]);
  const visible=filter==='All'?hazards:hazards.filter(h=>h.family===filter);

  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div className="brandMark"><Earth size={25}/></div><div><b>Regen Insight</b><span>Multi-hazard resilience intelligence</span></div></div>
      <nav>
        {['Situation Room','Hazard Monitor','Infrastructure','Cascades','Preparedness','Satellite Change','Sensors','Alerts','Reports'].map((x,i)=><button className={i===0?'active':''} key={x}>{['◉','⚠','🏗','🔗','🛡','🛰','📡','🔔','📄'][i]} {x}</button>)}
        <button onClick={()=>setShowAdmin(true)}>⚙ Super Admin</button>
      </nav>
      <div className="sourceNote"><ShieldAlert size={18}/><div><b>Evidence-first</b><span>Operational alerts should rely on authoritative feeds, calibrated sensors and verified remote-sensing products.</span></div></div>
    </aside>

    <main>
      <header><div><h1>Environmental Situation Room</h1><p>Hazard monitoring, critical-infrastructure failure analysis, early warning, preparedness and mitigation.</p></div><div className="live"><Radio size={16}/> LIVE ADAPTERS</div></header>

      <section className="metrics">
        <Metric icon={<AlertTriangle/>} label="Hazard classes" value={String(hazards.length)} hint="Natural + technological + biological"/>
        <Metric icon={<Building2/>} label="Infrastructure lens" value="Always on" hint="Every hazard"/>
        <Metric icon={<GitBranch/>} label="Cascade engine" value="Enabled" hint="Dependency-aware"/>
        <Metric icon={<Activity/>} label="Sensor health" value="94%" hint="Demo state"/>
      </section>

      <section className="gridTwo">
        <div className="panel mapPanel">
          <div className="panelHead"><div><h2><Map size={18}/> Risk & infrastructure map</h2><p>Hazards, exposure, power, water, transport, telecom, health and critical facilities</p></div><button>Layer manager</button></div>
          <div className="mapMock">
            <div className="radar r1"></div><div className="radar r2"></div>
            <div className="pin p1">Flood + Bridge</div><div className="pin p2">Drought + Water</div><div className="pin p3">Fire + Grid</div>
            <div className="mapCaption">Replace demo canvas with Leaflet + verified hazard and infrastructure layers</div>
          </div>
        </div>

        <div className="panel">
          <div className="panelHead"><div><h2>Selected hazard</h2><p>{selected.family}</p></div><span className={`severity ${selected.severity.toLowerCase()}`}>{selected.severity}</span></div>
          <div className="hazardHero"><span>{selected.icon}</span><div><h3>{selected.name}</h3><div className="riskBar"><i style={{width:`${severityScore[selected.severity]}%`}}/></div></div></div>
          <Info label="Signals" text={selected.signal}/>
          <Info label="Preparedness & mitigation" text={selected.preparedness}/>
          <Info label="Cascade pathway" text={selected.cascade}/>
          <div className="infraGrid">
            <Infra icon={<Zap/>} label="Power" text={selected.infrastructure.power}/>
            <Infra icon={<Siren/>} label="Transport" text={selected.infrastructure.transport}/>
            <Infra icon={<Droplets/>} label="Water" text={selected.infrastructure.water}/>
            <Infra icon={<Radio/>} label="Telecom" text={selected.infrastructure.telecom}/>
            <Infra icon={<HeartPulse/>} label="Health" text={selected.infrastructure.health}/>
            <Infra icon={<Factory/>} label="Other critical systems" text={selected.infrastructure.other}/>
          </div>
          <div className="actions"><button>Open playbook</button><button className="secondary">Run cascade scenario</button></div>
        </div>
      </section>

      <section className="panel cascadePanel">
        <div className="panelHead"><div><h2><GitBranch size={18}/> Infrastructure dependency & cascade engine</h2><p>Model how a hazard can propagate through tightly coupled critical systems.</p></div><span className="severity extreme">Cross-sector</span></div>
        <div className="cascadeFlow">
          {['Hazard','Physical impact','Power / transport','Water / telecom','Hospitals / logistics','Community & economy'].map((x,i)=><div key={x} className="cascadeNode"><b>{i+1}</b><span>{x}</span></div>)}
        </div>
        <p className="cascadeText">Every hazard record includes infrastructure exposure, failure probability inputs, dependency chains, redundancy, restoration priority and secondary hazards. The intended risk score is not only “How severe is the event?” but also “Which essential services fail next, how quickly, and who becomes isolated?”</p>
      </section>

      <section className="panel">
        <div className="panelHead"><div><h2>Hazard intelligence catalog</h2><p>Choose a hazard to review monitoring inputs, critical-infrastructure exposure and cascading failure pathways.</p></div></div>
        <div className="filters">{families.map(f=><button onClick={()=>setFilter(f)} className={filter===f?'chosen':''} key={f}>{f}</button>)}</div>
        <div className="hazards">{visible.map(h=><button key={h.name} className={selected.name===h.name?'hazardCard selected':'hazardCard'} onClick={()=>setSelected(h)}><span className="hazIcon">{h.icon}</span><div><b>{h.name}</b><span>{h.signal}</span></div><em className={h.severity.toLowerCase()}>{h.severity}</em></button>)}</div>
      </section>

      <section className="gridThree">
        <Mini icon={<CloudRain/>} title="Hydromet intelligence" text="Rainfall, river/lake levels, soil moisture, radar, seasonal outlooks, runoff and dam monitoring."/>
        <Mini icon={<ThermometerSun/>} title="Climate readiness" text="Heat, drought, ENSO, desertification, vegetation anomalies, food-security and climate-health risks."/>
        <Mini icon={<Waves/>} title="Coastal & ocean" text="Storm surge, tsunami, marine heatwaves, shoreline change, waves, sea level and evacuation exposure."/>
        <Mini icon={<Mountain/>} title="Geophysical intelligence" text="Earthquake, volcano, landslide, avalanche, deformation, lahars and outburst-flood hazards."/>
        <Mini icon={<Factory/>} title="Technological hazards" text="Dam failure, industrial/chemical release, radiation, fuel/pipeline incidents and critical-facility failure."/>
        <Mini icon={<Biohazard/>} title="Biological & ecosystem" text="Locust/vector outbreaks, climate-sensitive disease, smoke, water quality, deforestation and ecosystem stress."/>
        <Mini icon={<CloudLightning/>} title="Severe weather" text="Lightning, wind, thunderstorms, tornadoes, cyclone track and infrastructure exposure."/>
        <Mini icon={<Gauge/>} title="Sensor + edge network" text="River gauges, weather stations, water-quality sensors, air quality, radiation, cameras and resilient IoT gateways."/>
        <Mini icon={<Building2/>} title="Critical infrastructure" text="Power, roads, bridges, water, telecom, hospitals, dams, ports, fuel, data centers and supply chains."/>
      </section>
    </main>
    {showAdmin && <SuperAdminDashboard onClose={()=>setShowAdmin(false)}/>} 
  </div>
}

function Metric({icon,label,value,hint}:{icon:any,label:string,value:string,hint:string}){return <div className="metric"><div>{icon}</div><section><span>{label}</span><b>{value}</b><small>{hint}</small></section></div>}
function Info({label,text}:{label:string,text:string}){return <div className="info"><b>{label}</b><p>{text}</p></div>}
function Mini({icon,title,text}:{icon:any,title:string,text:string}){return <div className="mini"><div>{icon}</div><h3>{title}</h3><p>{text}</p></div>}
function Infra({icon,label,text}:{icon:any,label:string,text:string}){return <div className="infra"><div>{icon}</div><section><b>{label}</b><p>{text}</p></section></div>}
