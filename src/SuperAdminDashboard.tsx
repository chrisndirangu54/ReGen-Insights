import { useEffect, useState } from 'react';
import {
  collection, onSnapshot, orderBy, query, limit
} from 'firebase/firestore';
import {
  getIdTokenResult, onAuthStateChanged, signInWithEmailAndPassword, signOut, User
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, db, functions } from './firebase';

const BOOTSTRAP_EMAIL = 'chrisndirangu54@gmail.com';

type Props = { onClose: () => void };

export default function SuperAdminDashboard({onClose}: Props) {
  const [user,setUser]=useState<User|null>(null);
  const [isSuper,setIsSuper]=useState(false);
  const [email,setEmail]=useState(BOOTSTRAP_EMAIL);
  const [password,setPassword]=useState('');
  const [provider,setProvider]=useState('');
  const [keyName,setKeyName]=useState('API_KEY');
  const [secret,setSecret]=useState('');
  const [capability,setCapability]=useState('hazard_copilot');
  const [modelProvider,setModelProvider]=useState('openai');
  const [model,setModel]=useState('');
  const [secrets,setSecrets]=useState<any[]>([]);
  const [models,setModels]=useState<any[]>([]);
  const [logs,setLogs]=useState<any[]>([]);
  const [roleEmail,setRoleEmail]=useState('');
  const [role,setRole]=useState('admin');
  const [settingKey,setSettingKey]=useState('');
  const [settingValue,setSettingValue]=useState('');
  const [message,setMessage]=useState('');

  useEffect(()=>onAuthStateChanged(auth,async u=>{
    setUser(u);
    if(!u){setIsSuper(false);return;}
    const token=await getIdTokenResult(u,true);
    setIsSuper(token.claims.superAdmin===true);
  }),[]);

  useEffect(()=>{
    if(!isSuper) return;
    const off1=onSnapshot(query(collection(db,'api_secret_metadata'),orderBy('provider')),s=>setSecrets(s.docs.map(d=>({id:d.id,...d.data()}))));
    const off2=onSnapshot(collection(db,'model_configs'),s=>setModels(s.docs.map(d=>({id:d.id,...d.data()}))));
    const off3=onSnapshot(query(collection(db,'admin_audit_logs'),orderBy('createdAt','desc'),limit(50)),s=>setLogs(s.docs.map(d=>({id:d.id,...d.data()}))));
    return ()=>{off1();off2();off3();};
  },[isSuper]);

  async function call(name:string,data:any){
    setMessage('');
    try{
      await httpsCallable(functions,name)(data);
      setMessage('Saved');
    }catch(e:any){setMessage(e?.message ?? String(e));}
  }

  async function login(){
    try{
      const cred=await signInWithEmailAndPassword(auth,email,password);
      if(cred.user.email?.toLowerCase()===BOOTSTRAP_EMAIL){
        try{ await httpsCallable(functions,'bootstrapSuperAdmin')({}); }catch{}
        await cred.user.getIdToken(true);
        const token=await getIdTokenResult(cred.user,true);
        setIsSuper(token.claims.superAdmin===true);
      }
    }catch(e:any){setMessage(e?.message ?? String(e));}
  }

  if(!user || !isSuper){
    return <div className="adminOverlay"><div className="adminPanel loginPanel">
      <div className="adminHead"><div><h2>Regen Insight • Super Admin</h2><p>Verified super-admin access only</p></div><button onClick={onClose}>×</button></div>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"/>
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password"/>
      <button className="primary" onClick={login}>Sign in</button>
      {message && <p className="adminMessage">{message}</p>}
    </div></div>;
  }

  return <div className="adminOverlay"><div className="adminPanel">
    <div className="adminHead"><div><h2>Regen Insight • Super Admin</h2><p>{user.email}</p></div><div><button onClick={()=>signOut(auth)}>Sign out</button><button onClick={onClose}>×</button></div></div>

    <div className="adminGrid">
      <section>
        <h3>API keys / secrets</h3>
        <p>Plaintext values are written to Google Secret Manager and are never returned to the browser.</p>
        <input value={provider} onChange={e=>setProvider(e.target.value)} placeholder="Provider, e.g. openai"/>
        <input value={keyName} onChange={e=>setKeyName(e.target.value)} placeholder="Secret name"/>
        <input value={secret} onChange={e=>setSecret(e.target.value)} placeholder="New secret value" type="password"/>
        <button className="primary" onClick={()=>call('upsertApiSecret',{provider,keyName,value:secret})}>Save / rotate secret</button>
        <div className="adminList">{secrets.map(x=><div key={x.id}><b>{x.provider} • {x.keyName}</b><span>{x.configured?'Configured':'Disabled'} • {x.fingerprint ?? '—'}</span></div>)}</div>
      </section>

      <section>
        <h3>Models</h3>
        <input value={capability} onChange={e=>setCapability(e.target.value)} placeholder="Capability"/>
        <input value={modelProvider} onChange={e=>setModelProvider(e.target.value)} placeholder="Provider"/>
        <input value={model} onChange={e=>setModel(e.target.value)} placeholder="Model"/>
        <button className="primary" onClick={()=>call('updateModelConfig',{capability,provider:modelProvider,model,temperature:0.2,maxTokens:1600,enabled:true})}>Update model</button>
        <div className="adminList">{models.map(x=><div key={x.id}><b>{x.capability ?? x.id}</b><span>{x.provider} • {x.model} • {x.enabled===false?'Off':'On'}</span></div>)}</div>
      </section>

      <section>
        <h3>Admin roles</h3>
        <input value={roleEmail} onChange={e=>setRoleEmail(e.target.value)} placeholder="User email"/>
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value="super_admin">Super admin</option>
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
          <option value="none">Remove access</option>
        </select>
        <button className="primary" onClick={()=>call('setUserAdminRole',{email:roleEmail,role})}>Apply role</button>
      </section>

      <section>
        <h3>System settings</h3>
        <input value={settingKey} onChange={e=>setSettingKey(e.target.value)} placeholder="Setting key"/>
        <input value={settingValue} onChange={e=>setSettingValue(e.target.value)} placeholder="Value"/>
        <button className="primary" onClick={()=>call('updateSystemSetting',{key:settingKey,value:settingValue})}>Save setting</button>
        <button onClick={()=>call('updateSystemSetting',{key:'maintenance_mode',value:true})}>Enable maintenance mode</button>
        <button onClick={()=>call('updateSystemSetting',{key:'maintenance_mode',value:false})}>Disable maintenance mode</button>
        <button onClick={()=>call('updateSystemSetting',{key:'alerts.require_authoritative_source',value:true})}>Require authoritative alerts</button>
      </section>
    </div>

    <section className="adminAudit">
      <h3>Audit log</h3>
      {logs.map(x=><div key={x.id}><b>{x.action}</b><span>{x.target} • {x.actorUid}</span></div>)}
    </section>
    {message && <p className="adminMessage">{message}</p>}
  </div></div>;
}
