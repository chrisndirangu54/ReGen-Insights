# ReGen Insights

Regen Insight is a React/Vite multi-hazard environmental intelligence, critical-infrastructure resilience and disaster-readiness platform. Its operational objective is not only to identify environmental hazards, but also to estimate how those hazards can damage essential infrastructure, trigger secondary failures, isolate communities and amplify humanitarian or economic losses.

## Hazard coverage

The platform now explicitly covers floods, drought, wildfire, landslides/mudslides, earthquakes, volcanic activity, tsunami, tropical cyclones/hurricanes/typhoons, tornado/severe wind, lightning, El Niño/La Niña, heatwaves, deforestation, desertification, coastal erosion/storm surge, marine heatwaves, avalanches, glacial/lake-outburst floods, dam failure, radiation incidents, industrial/chemical spills, air-quality emergencies, water-quality emergencies, locust/vector outbreaks, disease-related climate risk, and compound/cascading disasters.

## Infrastructure-first risk model

Every hazard is evaluated against critical infrastructure. Infrastructure impact is not an optional module.

- Power and energy — generation, transmission, substations, distribution, backup generation, fuel supply and hydropower.
- Transport — roads, bridges, rail, airports, ports, evacuation routes and logistics corridors.
- Water and sanitation — dams, reservoirs, treatment plants, intakes, pumps, sewerage, drainage, boreholes and irrigation.
- Telecommunications and digital infrastructure — towers, fiber, backhaul, emergency communications, data centers and control networks.
- Healthcare and emergency services — hospitals, clinics, ambulances, laboratories, emergency operations centers and cold chains.
- Other critical systems — food supply, fuel depots, pipelines, industrial plants, schools, shelters, finance, warehousing and strategic facilities.

For each hazard, the intended model combines hazard probability, physical intensity, exposed infrastructure, fragility, dependency/centrality, population/economic exposure, restoration difficulty and secondary-hazard probability into a system-level risk estimate.

## Cascading failure model

Regen Insight represents disasters as dependency graphs rather than isolated events. Example: cyclone → extreme rainfall/storm surge → flooding → landslide/bridge failure → road isolation/transmission failure → telecom outage → water pump/treatment failure → hospital/logistics stress → community and economic crisis.

Other cascade examples include earthquake → utility rupture → fire/chemical release → road blockage → hospital overload; drought → reservoir depletion → hydropower loss → rolling blackouts → water-pumping failures; wildfire → transmission trip → telecom outage → evacuation coordination failure; dam breach → flash flood → bridges/substations/water systems lost; heatwave → electricity demand spike → transformer failure → cooling and hospital stress; and volcanic eruption → ash/lahar → airport, road, water and grid disruption.

## Core modules

- Situation Room — common operating picture for hazards, infrastructure exposure, population and service status.
- Hazard Monitor — event-specific signals, severity, forecasts, observations, confidence and authoritative sources.
- Infrastructure — power, transport, water, telecom, health, dams, ports, industrial sites and other critical assets.
- Cascade Engine — infrastructure dependency graph, secondary hazards, service-interruption scenarios and cascading failure simulation.
- Preparedness — contingency plans, drills, evacuation zones, shelters, mutual aid, continuity planning and restoration priorities.
- Satellite Change — optical/SAR monitoring for flood extent, fire scars, vegetation loss, drought, shoreline change, landslides and infrastructure damage.
- Sensors — river gauges, weather stations, dam instrumentation, water-quality probes, air-quality monitors, radiation monitors, cameras and edge IoT devices.
- Alerts — source-attributed alerts with issue/expiry time, footprint, severity, confidence and acknowledgement.
- Mitigation — drainage, levees, restoration, firebreaks, slope stabilization, water storage, cooling centers, redundancy and resilience projects.
- Incident Management — tasks, teams, resources, affected assets, closures, shelters, casualties, service restoration and situation reports.
- Reports — risk profiles, preparedness scorecards, impact summaries, after-action reviews and resilience investment priorities.

## Infrastructure dependency graph

Recommended entities include HazardEvent, InfrastructureAsset, Service, Community, Facility, RoadSegment, Bridge, Substation, PowerPlant, WaterPlant, PumpStation, Hospital, TelecomSite, Dam, Port, Airport, Shelter, IndustrialSite, Sensor, Alert and ResponseResource.

Useful graph relations include AFFECTS, DEPENDS_ON, SUPPLIES, CONNECTS_TO, BACKED_UP_BY, ISOLATES, SERVES, LOCATED_IN, MONITORED_BY, TRIGGERS, BLOCKS and RESTORED_BY.

This supports questions such as: Which hospitals lose water if this substation fails? Which communities become inaccessible if this bridge is lost? Which telecom towers depend on the same power feeder? What secondary flood zones appear if a dam fails? Which evacuation routes intersect projected landslide zones? Which critical facilities lack redundant power, water or communications?

## Safety and alerting principle

The UI must not invent emergency warnings. Production alerts should retain source, observation time, geographic footprint, confidence/quality, severity, expiration, acknowledgement and audit history. AI can summarize, correlate, simulate dependencies and prioritize evidence, but authoritative warnings must remain clearly attributable.

Infrastructure failure predictions should be presented as modeled probabilities or scenarios unless validated by field telemetry, operators or authoritative reports.

## Run

npm install
npm run dev

## Recommended backend services

- hazard-ingest
- eo-change-detection
- hydrology
- geophysical-monitor
- climate-health
- sensor-gateway
- infrastructure-registry
- dependency-graph
- cascade-simulator
- exposure-risk
- alert-orchestrator
- preparedness-playbooks
- incident-management
- restoration-prioritizer
- reporting

Keep provider credentials and sensitive infrastructure integrations out of the React bundle.