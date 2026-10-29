import { useCallback, useEffect, useState } from 'react';

export type PublicWarning = {
  id: string;
  title: string;
  description: string;
  hazard: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  county: string;
  location?: string | null;
  issued_at: string;
  expires_at: string;
  source_name: string;
  source_url: string;
  instructions: string[];
  verified: boolean;
  status: string;
  revision: number;
};

type FeedStatus = { live_feed_connected: boolean; durable_storage: boolean; public_push_enabled: boolean; message: string };

const BASE = (import.meta.env.VITE_JUMUISHA_API_BASE_URL || '').replace(/\/$/, '');
const severityColors: Record<PublicWarning['severity'],string> = {
  minor: '#377b70', moderate: '#b28a26', severe: '#cb6630', extreme: '#b73c4a'
};

export function isUsableWarning(item: PublicWarning, now = Date.now()): boolean {
  return item.verified === true && item.status === 'actual' &&
    Number.isFinite(Date.parse(item.issued_at)) &&
    Date.parse(item.issued_at) <= now &&
    Date.parse(item.expires_at) > now &&
    /^https:\/\//i.test(item.source_url);
}

export function JumuishaPublicWarnings() {
  const [county, setCounty] = useState('');
  const [alerts, setAlerts] = useState<PublicWarning[]>([]);
  const [status, setStatus] = useState<FeedStatus | null>(null);
  const [state, setState] = useState<'unconfigured'|'loading'|'ready'|'error'>(BASE ? 'loading' : 'unconfigured');
  const load = useCallback(async (signal?: AbortSignal) => {
    if (!BASE) return;
    setState('loading');
    try {
      const url = new URL(BASE + '/v1/early-warning/alerts');
      if (county.trim()) url.searchParams.set('county', county.trim());
      const [feedResponse, statusResponse] = await Promise.all([
        fetch(url.toString(), { signal, cache:'no-store' }),
        fetch(BASE + '/v1/early-warning/status', { signal, cache:'no-store' })
      ]);
      if (!feedResponse.ok || !statusResponse.ok) throw new Error('Source unavailable');
      const feed: unknown = await feedResponse.json();
      const system: FeedStatus = await statusResponse.json();
      if (!Array.isArray(feed)) throw new Error('Invalid warning response');
      if (signal?.aborted) return;
      setAlerts((feed as PublicWarning[]).filter(isUsableWarning));
      setStatus(system);
      setState('ready');
    } catch {
      if (signal?.aborted) return;
      setAlerts([]);
      setState('error');
    }
  }, [county]);
  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return <section className="panel" aria-labelledby="jumuisha-warning-heading">
    <div className="panelHead">
      <div><h2 id="jumuisha-warning-heading">Public early warnings · Jumuisha AI</h2>
        <p>Read-only verified warning feed. ReGen scenario estimates are not official alerts.</p></div>
      <span className="severity moderate">{state === 'ready' ? 'Feed reachable' : 'Not verified live'}</span>
    </div>
    <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'end',marginBottom:14}}>
      <label style={{display:'grid',gap:4}}>
        <span>County (optional)</span>
        <input aria-label="Filter warnings by county" placeholder="e.g. Nairobi"
          value={county} onChange={e=>setCounty(e.target.value)} style={{padding:9,borderRadius:7}} />
      </label>
      <button type="button" onClick={()=>void load()}>Refresh warnings</button>
    </div>
    {state === 'unconfigured' && <p role="status">Not connected. Configure VITE_JUMUISHA_API_BASE_URL to use the Jumuisha API.</p>}
    {state === 'loading' && <p role="status">Checking warning source…</p>}
    {state === 'error' && <p role="alert">The warning source could not be verified. Refer directly to your local emergency authority.</p>}
    {state === 'ready' && <>
      <p role="status">{status?.message || 'Source status unavailable'} {alerts.length} active verified warnings returned.</p>
      {!status?.live_feed_connected && <p><strong>Pilot only:</strong> No official live agency feed is connected. An empty feed does not mean that an area is safe.</p>}
      {alerts.length === 0 && <p>No verified active warnings are available from this source. Check official local guidance.</p>}
      {alerts.map(a=><article key={a.id} style={{borderLeft:'4px solid '+severityColors[a.severity],padding:'12px 16px',margin:'12px 0',background:'rgba(127,127,127,.07)',borderRadius:7}}>
        <h3>{a.title}</h3>
        <p><strong>{a.severity.toUpperCase()}</strong> · {a.hazard} · {a.county} · revision {a.revision}</p>
        <p>{a.description}</p>
        <ul>{a.instructions.map((instruction,i)=><li key={i}>{instruction}</li>)}</ul>
        <p>Published by {a.source_name}. Expires {new Date(a.expires_at).toLocaleString()}.</p>
        <a href={a.source_url} target="_blank" rel="noopener noreferrer">View issuing source</a>
      </article>)}
    </>}
  </section>;
}
