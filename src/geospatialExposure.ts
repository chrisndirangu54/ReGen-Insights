/** GeoJSON point-in-polygon utility for analyst exposure overlays.
 * Coordinates use GeoJSON [longitude, latitude]. Only simple Polygon and
 * MultiPolygon geometries are accepted. This does not model flood depth,
 * asset fragility or true geodesic area.
 */
export type Position = [number, number];
export type PolygonGeometry =
  | {type:'Polygon'; coordinates: Position[][]}
  | {type:'MultiPolygon'; coordinates: Position[][][]};
export type GeoAsset = {id:string; name:string; kind:string; coordinates:Position};
export type ExposureSummary = {assetCount:number; byKind:Record<string,number>; matchingAssets:GeoAsset[]};

function onSegment(point:Position, a:Position,b:Position):boolean {
  const cross=(point[1]-a[1])*(b[0]-a[0])-(point[0]-a[0])*(b[1]-a[1]);
  return Math.abs(cross)<1e-10 &&
    point[0]>=Math.min(a[0],b[0]) && point[0]<=Math.max(a[0],b[0]) &&
    point[1]>=Math.min(a[1],b[1]) && point[1]<=Math.max(a[1],b[1]);
}
function insideRing(point:Position,ring:Position[]):boolean {
  let inside=false;
  for(let i=0,j=ring.length-1;i<ring.length;j=i++){
    const a=ring[i],b=ring[j];
    if(onSegment(point,a,b)) return true;
    if(((a[1]>point[1])!==(b[1]>point[1])) &&
        point[0]<(b[0]-a[0])*(point[1]-a[1])/(b[1]-a[1])+a[0]) inside=!inside;
  }
  return inside;
}
function withinPolygon(point:Position,rings:Position[][]):boolean {
  return !!rings.length && insideRing(point,rings[0]) &&
    !rings.slice(1).some(hole=>insideRing(point,hole));
}
export function withinFootprint(point:Position,polygon:PolygonGeometry):boolean {
  if(point.some(v=>!Number.isFinite(v)) || Math.abs(point[0])>180 || Math.abs(point[1])>90) return false;
  return polygon.type==='Polygon' ? withinPolygon(point,polygon.coordinates):
    polygon.coordinates.some(rings=>withinPolygon(point,rings));
}
export function computeExposure(geometry:PolygonGeometry,assets:GeoAsset[]):ExposureSummary {
  const seen=new Set<string>();
  const matchingAssets=assets.filter(asset=>{
    if(seen.has(asset.id) || !withinFootprint(asset.coordinates,geometry)) return false;
    seen.add(asset.id);
    return true;
  });
  const byKind:Record<string,number>={};
  matchingAssets.forEach(a=>{byKind[a.kind]=(byKind[a.kind]||0)+1});
  return {assetCount:matchingAssets.length,matchingAssets,byKind};
}
