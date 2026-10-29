import {useState} from 'react';
import {computeExposure, type GeoAsset, type PolygonGeometry} from './geospatialExposure';

function isPosition(p:unknown):p is [number,number] {
  return Array.isArray(p) && p.length>=2 && p.slice(0,2).every(n=>typeof n==='number'&&Number.isFinite(n)) &&
    Math.abs(p[0])<=180 && Math.abs(p[1])<=90;
}
function polygonFrom(input:any):PolygonGeometry {
  const g=input?.type==='Feature'?input.geometry:input;
  if(g?.type!=='Polygon'&&g?.type!=='MultiPolygon') throw new Error('Only Polygon/MultiPolygon GeoJSON is supported');
  const rings=g.type==='Polygon'?[g.coordinates]:g.coordinates;
  if(!Array.isArray(rings)||rings.length>1000 || !rings.every((poly:any)=>Array.isArray(poly)&&poly.length>0&&poly.length<500&&poly.every((r:any)=>Array.isArray(r)&&r.length>=4&&r.length<20000&&r.every(isPosition)))) throw new Error('Invalid or oversized polygon');
  return g as PolygonGeometry;
}
function assetsFrom(input:any):GeoAsset[] {
  if(!Array.isArray(input?.features)||input.features.length>10000) throw new Error('Provide a GeoJSON FeatureCollection with at most 10,000 assets');
  return input.features.map((f:any,i:number)=>{
    if(f?.geometry?.type!=='Point'||!isPosition(f.geometry.coordinates)) throw new Error('Every asset must be a Point feature');
    return {id:String(f.id??i),name:String(f.properties?.name??'Asset').slice(0,120),
      kind:String(f.properties?.kind??'other').slice(0,80),coordinates:f.geometry.coordinates.slice(0,2)};
  });
}
export function GeospatialExposureWorkbench() {
  const [polygon,setPolygon]=useState<PolygonGeometry|null>(null);
  const [assets,setAssets]=useState<GeoAsset[]|null>(null);
  const [error,setError]=useState('');
  const read=async(file:File|undefined,kind:'polygon'|'assets')=>{
    if(!file)return;
    try{
      if(file.size>2_000_000) throw new Error('File exceeds 2 MB pilot limit');
      const parsed=JSON.parse(await file.text());
      if(kind==='polygon') setPolygon(polygonFrom(parsed)); else setAssets(assetsFrom(parsed));
      setError('');
    }catch(err){setError(err instanceof Error?err.message:'Invalid GeoJSON');}
  };
  const summary=polygon&&assets?computeExposure(polygon,assets):null;
  return <section className="panel" aria-labelledby="geo-exposure-heading">
    <div className="panelHead"><div><h2 id="geo-exposure-heading">Geospatial exposure assessment</h2>
      <p>Import an analyst-provided hazard footprint and critical-infrastructure points. Files are processed locally in your browser.</p></div><span className="severity moderate">Analyst data</span></div>
    <div style={{display:'flex',gap:18,flexWrap:'wrap'}}>
      <label>Hazard footprint (GeoJSON Polygon/MultiPolygon)<br/><input type="file" accept=".geojson,.json,application/geo+json" onChange={e=>void read(e.target.files?.[0],'polygon')}/></label>
      <label>Infrastructure points (GeoJSON FeatureCollection)<br/><input type="file" accept=".geojson,.json,application/geo+json" onChange={e=>void read(e.target.files?.[0],'assets')}/></label>
    </div>
    {error&&<p role="alert">{error}</p>}
    {summary&&<div role="status"><h3>{summary.assetCount} unique assets intersect the footprint</h3>
      <ul>{Object.entries(summary.byKind).map(([type,count])=><li key={type}>{type}: {count}</li>)}</ul>
      <p>Geometric intersection only. No impact, failure or casualty estimate; verify coordinates, source dates and completeness before operational use.</p>
    </div>}
    {!summary&&<p>Upload both local GeoJSON datasets to calculate a preliminary asset count. No live satellite or infrastructure feed is connected.</p>}
  </section>;
}
