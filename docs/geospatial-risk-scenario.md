# ReGen risk & geospatial scenario engine

## Current implementation
The Situation Room embeds:
1. A **manual, explainable scenario index** with likelihood, intensity, exposure, vulnerability, and infrastructure-dependency inputs, each normalized 0–1. The score is a heuristic weighted sum and **not calibrated hazard probability or an official warning**.
2. **Local GeoJSON infrastructure exposure intersection**, using Polygon/MultiPolygon hazard footprints and a Point FeatureCollection of assets. Summary counts assets falling within the footprint and groups them by `properties.kind`. Each asset uses `id` or its feature index as unique identifier.
3. Existing **Jumuisha AI read-only official-warning panel**. It is independent from these scenario outputs.

## Data format
- Hazard: GeoJSON `Polygon` or `MultiPolygon`, optionally wrapped in a GeoJSON Feature.
- Assets: GeoJSON `FeatureCollection`, whose features contain `Point` geometry plus optional `properties.name` and `properties.kind`.
- Coordinates: longitude, latitude in WGS84/CRS84 GeoJSON order. Convert projected CRS data before upload.
- GeoJSON remains in browser memory; it is not persisted or submitted by the workbench.

## Known limitations
- Geometry intersection is planar lon/lat point-in-polygon with holes supported; do not use as a substitute for a GIS engine for antimeridian, polar, boundary-touching, topology-error or large-area inputs.
- No satellite provider, rainfall, flood-depth, census, infrastructure registry or live IoT telemetry is connected. No model-derived threshold authorizes an alert.
- Risk index weights are illustrative, not fitted on historical impacts. In addition to prospective calibration, uncertainty intervals, ground-truth verification, spatial joins with authoritative basemaps and sensitivity analysis are necessary for operational decisions.
- Upload limits are 2 MB per file, 10k asset points, and basic polygon-coordinate complexity constraints. Browser parsing of untrusted data should be hardened further.
- Public warning publication continues to require authoritative source verification and a separate agency-controlled workflow.

## Run validation
```bash
npm install
npm run build
```
Manual test: import a small polygon and point collection; verify inside, outside and holes; reload and confirm no private location data is persisted. These commands are guidance, not claims that CI passed.
