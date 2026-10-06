# ReGen Insights

Regen Insight is a React/Vite environmental intelligence and disaster-readiness platform. It separates the earlier forestry/planting prototype from the new operational mission: multi-hazard monitoring, early warning, preparedness, mitigation and evidence-based reporting.

## Hazards covered

Floods, drought, wildfire, landslides/mudslides, earthquakes, tsunami, tropical cyclones/hurricanes/typhoons, tornado/severe wind, El Niño/La Niña, heatwaves, deforestation, radiation incidents, smoke/air quality, avalanche, coastal erosion and storm surge.

The data model should remain extensible for volcanic activity, lightning, dam failure, industrial/chemical spills, marine heatwaves, water-quality incidents, desertification, locust/vector outbreaks, glacier/lake outburst floods and compound/cascading risk.

## Core product modules

- **Situation Room** — multi-hazard operational overview, map layers, active signals, exposure and sensor health.
- **Hazard Monitor** — hazard-specific indicators, severity, evidence, forecast windows and confidence.
- **Preparedness** — plans, checklists, drills, evacuation zones, shelters, assets, contacts and response playbooks.
- **Satellite Change** — optical/SAR change detection for flood extent, burn scars, forest loss, drought/vegetation stress and shoreline change.
- **Sensors** — weather stations, river gauges, rainfall, soil moisture, air quality, cameras and authorized radiation monitors.
- **Alerts** — source-attributed alerts with severity, geographic footprint, issue/expiry time, acknowledgement and audit history.
- **Mitigation** — drainage, water storage, firebreaks, restoration, slope stabilization, cooling centers, coastal setbacks and resilience projects.
- **Reports** — incident reports, preparedness scorecards, after-action reviews and risk trends.

## Data architecture

- **Earth observation:** Sentinel/Landsat and optional commercial imagery; optical + SAR change detection.
- **Weather/climate:** rainfall, wind, humidity, solar radiation, temperature, seasonal forecasts and ENSO outlooks.
- **Hydrology:** river/lake gauges, soil moisture, runoff, reservoir levels and flood extent.
- **Terrain/geology:** DEM, slope, drainage, geology and landslide susceptibility layers.
- **Coastal/ocean:** waves, sea level, surge, shoreline change and authoritative tsunami bulletins.
- **Atmosphere:** air-quality stations, aerosol/smoke observations and wind transport.
- **Sensors:** weather stations, river gauges, cameras, air-quality sensors and authorized radiation monitors.
- **Official alert feeds:** national meteorological/disaster agencies plus international authoritative feeds where relevant.

## Safety and alerting principle

The UI must not invent emergency warnings. Production alerts should retain source, observation time, geographic footprint, confidence/quality, severity, expiration, acknowledgement and audit history. AI may summarize, correlate and prioritize evidence, but should not silently replace authoritative emergency bulletins.

## Run

```bash
npm install
npm run dev
```

## Next integration layer

Use a server/API layer for provider credentials and normalization. Suggested services:

- `hazard-ingest`
- `eo-change-detection`
- `hydrology`
- `sensor-gateway`
- `alert-orchestrator`
- `exposure-risk`
- `preparedness-playbooks`
- `incident-management`
- `reporting`

Keep API keys out of the React bundle.
