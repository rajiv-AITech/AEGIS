import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

const T={bg:"#07090f",card:"#0d1117",card2:"#101720",card3:"#0a1020",border:"0.5px solid #1a2535",borderB:"0.5px solid #0f1a28",txt:"#c9d8e8",txt2:"#5e7a96",txt3:"#304050",purple:"#8b7de8",purpleBg:"#15103a",purpleBr:"#2a1f5a",green:"#34d399",greenBg:"#052216",blue:"#60a5fa",blueBg:"#061528",amber:"#fbbf24",amberBg:"#201200",red:"#f87171",redBg:"#200606",teal:"#2dd4bf",tealBg:"#042018"};
const CS={background:T.card,border:T.border,borderRadius:12,padding:"16px"};

// ── DATA ──────────────────────────────────────────────────────────────────────
const NAV=["Dashboard","Cameras","Devices","Agents","Automations","Properties","EnergyHub","Digital Twin","Analytics","Settings"];

const LIGHT_ZONES_INIT=[
  {id:"entry",   name:"Entry / Foyer",  x:-1.5,z:4.0,  fixY:3.32,floorY:0.12,radius:1.4,watts:60, maxW:120,on:true, temp:0xffd080,zone:"Entry",    tip:"LED downlights — good efficiency",    optSave:20},
  {id:"living",  name:"Living Room",    x:-3.5,z:-2.8, fixY:3.32,floorY:0.12,radius:2.2,watts:180,maxW:300,on:true, temp:0xffcc66,zone:"Interior", tip:"Dim to 60% — saves 72W during on-peak",optSave:72},
  {id:"kitchen", name:"Kitchen",        x:2.5, z:-2.8, fixY:3.32,floorY:0.12,radius:1.8,watts:0,  maxW:400,on:false,temp:0xffffff,zone:"Interior", tip:"Off — motion arm when occupied",       optSave:0},
  {id:"hallway", name:"Hallway",        x:0,   z:1.5,  fixY:3.32,floorY:0.12,radius:1.2,watts:40, maxW:80, on:true, temp:0xffdd90,zone:"Interior", tip:"Motion-scheduled — already optimal",    optSave:0},
  {id:"bedroom", name:"Bedroom",        x:-4.0,z:-2.0, fixY:6.18,floorY:3.82,radius:1.8,watts:90, maxW:150,on:true, temp:0xffb060,zone:"Mezzanine",tip:"Schedule off after 11 PM saves 90W",   optSave:45},
  {id:"office",  name:"Home Office",    x:-0.5,z:-0.5, fixY:6.18,floorY:3.82,radius:1.6,watts:140,maxW:200,on:true, temp:0xe8f4ff,zone:"Mezzanine",tip:"5 monitors on — smart strip saves 60W",optSave:60},
  {id:"garage",  name:"Garage",         x:9.0, z:0.0,  fixY:2.85,floorY:0.12,radius:1.6,watts:0,  maxW:200,on:false,temp:0xffffff,zone:"Garage",   tip:"Off — motion sensor active",            optSave:0},
];

const INIT_DEVICES=[
  {id:1,name:"Front Door Camera",type:"camera",zone:"Entry",status:"online",alert:false,icon:"📷"},
  {id:2,name:"Back Yard Camera",type:"camera",zone:"Perimeter",status:"online",alert:true,icon:"📷"},
  {id:3,name:"Front Door Lock",type:"lock",zone:"Entry",status:"locked",alert:false,icon:"🔒"},
  {id:4,name:"Garage Door",type:"door",zone:"Garage",status:"closed",alert:false,icon:"🚪"},
  {id:5,name:"Motion–Living Rm",type:"sensor",zone:"Interior",status:"online",alert:false,icon:"👁"},
  {id:6,name:"Thermostat",type:"climate",zone:"Interior",status:"72°F",alert:false,icon:"🌡"},
  {id:7,name:"Smoke–Kitchen",type:"sensor",zone:"Interior",status:"online",alert:false,icon:"🔥"},
  {id:8,name:"Driveway Sensor",type:"sensor",zone:"Perimeter",status:"online",alert:false,icon:"📡"},
  {id:9,name:"Side Gate Lock",type:"lock",zone:"Perimeter",status:"locked",alert:false,icon:"🔒"},
  {id:10,name:"Video Doorbell",type:"camera",zone:"Entry",status:"online",alert:false,icon:"🔔"},
];
const INIT_AGENTS=[
  {id:"ai-deter",name:"AI Deterrence Agent",desc:"Adaptive verbal warnings to detected intruders.",status:"active",triggers:47,last:"2m ago"},
  {id:"perimeter",name:"Perimeter Guard",desc:"Monitors all outdoor sensors and cameras 24/7.",status:"active",triggers:182,last:"2m ago"},
  {id:"access",name:"Smart Access Controller",desc:"Manages locks, visitor codes, anomalous entries.",status:"active",triggers:91,last:"3h ago"},
  {id:"energy",name:"Energy Optimizer (PEMS)",desc:"Grid-interactive load management and TOU optimization.",status:"active",triggers:33,last:"1h ago"},
  {id:"rvms",name:"Remote Video Monitor",desc:"24/7 AI video review — flags high-confidence events.",status:"active",triggers:214,last:"14m ago"},
  {id:"wellness",name:"Wellness Sentinel",desc:"Tracks occupancy patterns, alerts on unusual inactivity.",status:"paused",triggers:8,last:"2d ago"},
];
const INIT_AUTOS=[
  {name:"Goodnight Routine",trigger:"11 PM daily",actions:"Lock all · Arm perimeter · Deep Sleep PEMS",active:true},
  {name:"Arrival Mode",trigger:"Familiar face at door",actions:"Unlock · Disarm · HVAC Comfort",active:true},
  {name:"Peak Shedding",trigger:"Grid on-peak signal",actions:"Defer EV · HVAC setback · Cut vampire loads",active:true},
  {name:"Departure Protocol",trigger:"Geofence exit + locked",actions:"Deep Sleep · 48h weather HVAC · Shed comfort",active:true},
  {name:"Grid-Down Shield",trigger:"Utility outage detected",actions:"Security Mesh only · Shed all comfort · UPS priority",active:true},
  {name:"Emergency Lockdown",trigger:"Threat score ≥ 80",actions:"Lock all · Siren · Alert contacts · Stream",active:true},
];
const PROPS_INIT=[
  {id:1,name:"Great Falls Residence",addr:"Great Falls, VA",icon:"🏠",threat:12,devices:10,alerts:1,armed:true,current:true},
  {id:2,name:"Shenandoah Cabin",addr:"Front Royal, VA",icon:"🏡",threat:0,devices:6,alerts:0,armed:false,current:false},
  {id:3,name:"Tysons Corner Office",addr:"Tysons, VA",icon:"🏢",threat:38,devices:24,alerts:2,armed:true,current:false},
];
const CAMERAS_DATA=[
  {id:1,name:"Front Door",zone:"Entry",outdoor:true,alert:false,dets:[{t:"person",x:.32,y:.18,w:.18,h:.58,lbl:"Person 94%"}]},
  {id:2,name:"Back Yard",zone:"Perimeter",outdoor:true,alert:true,dets:[{t:"person",x:.08,y:.12,w:.24,h:.62,lbl:"Person 87%"},{t:"motion",x:.55,y:.45,w:.28,h:.25,lbl:"Motion"}]},
  {id:3,name:"Driveway",zone:"Perimeter",outdoor:true,alert:false,dets:[{t:"vehicle",x:.18,y:.28,w:.52,h:.38,lbl:"Vehicle 91%"}]},
  {id:4,name:"Side Gate",zone:"Perimeter",outdoor:true,alert:false,dets:[]},
  {id:5,name:"Living Room",zone:"Interior",outdoor:false,alert:false,dets:[{t:"person",x:.38,y:.08,w:.22,h:.68,lbl:"Emma — Familiar"}]},
  {id:6,name:"Garage",zone:"Garage",outdoor:false,alert:false,dets:[]},
];
const EVENTS=[
  {time:"2m ago",msg:"AI Deterrence issued warning — back yard intruder",type:"warn"},
  {time:"14m ago",msg:"Familiar face recognized: Alex arrived home",type:"ok"},
  {time:"31m ago",msg:"PEMS: EV charging deferred — mid-peak detected",type:"info"},
  {time:"1h ago",msg:"Energy Optimizer shifted 2.1 kWh to off-peak",type:"ok"},
  {time:"2h ago",msg:"Front door unlocked via mobile — Emma",type:"info"},
  {time:"3h ago",msg:"NILM Alert: Refrigerator compressor irregular",type:"warn"},
];
const CLIPS=[
  {id:1,cam:"Back Yard",time:"2m ago",label:"Person detected",type:"warn",dur:"0:08"},
  {id:2,cam:"Driveway",time:"31m ago",label:"Vehicle: Honda Civic",type:"info",dur:"0:12"},
  {id:3,cam:"Front Door",time:"14m ago",label:"Familiar face: Alex",type:"ok",dur:"0:05"},
  {id:4,cam:"Side Gate",time:"5h ago",label:"Gate opened",type:"info",dur:"0:22"},
];
const HMAP=[[2,5,3,7,4,6,1,5],[4,3,8,2,6,5,7,3],[1,6,4,9,3,7,2,8],[5,2,7,3,8,4,6,1],[3,8,2,6,1,9,4,5],[6,1,5,4,7,2,8,3],[2,7,3,5,4,6,1,9]];

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
function Bdg({type,children}){
  const bg={ok:T.greenBg,warn:T.amberBg,info:T.blueBg,alert:T.redBg,purple:T.purpleBg,teal:T.tealBg};
  const col={ok:T.green,warn:T.amber,info:T.blue,alert:T.red,purple:T.purple,teal:T.teal};
  return <span style={{background:bg[type]||bg.info,color:col[type]||col.info,fontSize:11,fontWeight:500,padding:"2px 8px",borderRadius:6,whiteSpace:"nowrap",border:"0.5px solid "+(col[type]||col.info)+"33"}}>{children}</span>;
}
function Tgl({on,toggle}){
  return <div onClick={toggle} style={{width:36,height:20,borderRadius:10,background:on?"#4c3db8":"#1e2d3d",position:"relative",cursor:"pointer",flexShrink:0,transition:"background .2s"}}><div style={{position:"absolute",top:2,left:on?18:2,width:16,height:16,borderRadius:"50%",background:on?"#e0daff":"#4a5a6a",transition:"left .2s"}}/></div>;
}
function ThreatRing({score}){
  const r=44,cx=54,cy=54,circ=2*Math.PI*r,col=score<30?T.green:score<60?T.amber:T.red;
  return(<svg width={108} height={108} viewBox="0 0 108 108"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a2535" strokeWidth={8}/><circle cx={cx} cy={cy} r={r} fill="none" stroke={col} strokeWidth={8} strokeDasharray={circ} strokeDashoffset={circ*(1-score/100)} strokeLinecap="round" transform={"rotate(-90 "+cx+" "+cy+")"}/>  <text x={cx} y={cy-6} textAnchor="middle" fontSize={22} fontWeight={500} fill={col}>{score}</text><text x={cx} y={cy+12} textAnchor="middle" fontSize={11} fill={T.txt2}>Threat</text></svg>);
}
function CamFeed({cam,selected,onClick}){
  const ref=useRef(null);
  useEffect(()=>{
    const canvas=ref.current;if(!canvas)return;const ctx=canvas.getContext("2d");const W=canvas.width,H=canvas.height;let raf,frame=0,lastT=0;
    const draw=(ts)=>{raf=requestAnimationFrame(draw);if(ts-lastT<100)return;lastT=ts;frame++;const f=frame;ctx.fillStyle=cam.outdoor?"#0c1a28":"#141210";ctx.fillRect(0,0,W,H);if(cam.outdoor){ctx.fillStyle="#080f1a";ctx.fillRect(0,0,W,H*.45);ctx.fillStyle="#0a140a";ctx.fillRect(0,H*.55,W,H*.45);ctx.fillStyle="#0e1e0e";ctx.fillRect(W*.04,H*.15,W*.1,H*.3);ctx.fillRect(W*.82,H*.18,W*.12,H*.28);}else{ctx.fillStyle="#1c1814";ctx.fillRect(0,0,W,H*.6);ctx.fillStyle="#0e0d0a";ctx.fillRect(0,H*.6,W,H*.4);ctx.fillStyle="#1a2030";ctx.fillRect(W*.6,H*.1,W*.25,H*.3);}
    cam.dets.forEach((det,i)=>{const pulse=.5+Math.sin(f*.08+i)*.4;const dc={person:"rgba(240,80,80,",vehicle:"rgba(80,160,255,",motion:"rgba(255,200,50,"};const c=(dc[det.t]||dc.motion)+pulse+")";const dx=det.x+Math.sin(f*.015+i)*.008;ctx.strokeStyle=c;ctx.lineWidth=1.5;ctx.strokeRect(dx*W,det.y*H,det.w*W,det.h*H);const cs=7;ctx.lineWidth=2.5;ctx.strokeStyle=c;ctx.beginPath();ctx.moveTo(dx*W,det.y*H+cs);ctx.lineTo(dx*W,det.y*H);ctx.lineTo(dx*W+cs,det.y*H);ctx.stroke();ctx.beginPath();ctx.moveTo((dx+det.w)*W-cs,det.y*H);ctx.lineTo((dx+det.w)*W,det.y*H);ctx.lineTo((dx+det.w)*W,det.y*H+cs);ctx.stroke();ctx.font="8px monospace";const lw=ctx.measureText(det.lbl).width+6;ctx.fillStyle="rgba(0,0,0,.65)";ctx.fillRect(dx*W,det.y*H-13,lw,12);ctx.fillStyle=c;ctx.fillText(det.lbl,dx*W+3,det.y*H-4);});
    if(cam.alert){const ap=.35+Math.sin(f*.12)*.3;ctx.fillStyle="rgba(220,50,50,"+(ap*.2)+")";ctx.fillRect(0,0,W,H);ctx.strokeStyle="rgba(220,50,50,"+ap+")";ctx.lineWidth=2.5;ctx.strokeRect(1.5,1.5,W-3,H-3);}
    ctx.fillStyle="rgba(255,255,255,.45)";ctx.font="7px monospace";ctx.fillText(new Date().toLocaleTimeString("en-US",{hour12:false}),4,H-5);const rp=.5+Math.sin(f*.12)*.5;ctx.fillStyle="rgba(255,55,55,"+rp+")";ctx.beginPath();ctx.arc(W-10,9,3.5,0,Math.PI*2);ctx.fill();ctx.fillStyle="rgba(255,255,255,.4)";ctx.font="7px monospace";ctx.fillText("REC",W-23,13);};
    raf=requestAnimationFrame(draw);return()=>cancelAnimationFrame(raf);
  },[cam]);
  return(<div onClick={onClick} style={{position:"relative",cursor:"pointer",borderRadius:8,overflow:"hidden",border:selected?"2px solid #8b7de8":cam.alert?"2px solid #f87171":"1px solid #1a2535"}}><canvas ref={ref} width={240} height={150} style={{display:"block",width:"100%"}}/><div style={{position:"absolute",bottom:0,left:0,right:0,background:"rgba(0,0,0,.65)",padding:"3px 6px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:9,color:"#aabbcc",fontWeight:500,letterSpacing:.5}}>{cam.name.toUpperCase()}</span>{cam.alert?<span style={{fontSize:8,color:"#f87171",fontWeight:700}}>● ALERT</span>:cam.dets.length>0?<span style={{fontSize:8,color:"#60a5fa"}}>● AI ACTIVE</span>:null}</div></div>);
}
function AIChat({devices,agents,systemPrompt,placeholder,initMsg}){
  const [chat,setChat]=useState([{role:"ai",text:initMsg||"Hi! I'm Jarvis AI. Ask me anything about your property."}]);
  const [inp,setInp]=useState("");const [loading,setLoading]=useState(false);const ref=useRef(null);
  useEffect(()=>{if(ref.current)ref.current.scrollTop=ref.current.scrollHeight;},[chat]);
  const sys=systemPrompt||("You are Jarvis AI. Devices: "+(devices||[]).map(d=>d.name+": "+d.status).join(", ")+". Agents: "+(agents||[]).map(a=>a.name+" ("+a.status+")").join(", ")+". Threat: 12/100. Reply in 1-3 sentences.");
  const send=async()=>{if(!inp.trim()||loading)return;const msg=inp.trim();setInp("");setLoading(true);setChat(c=>[...c,{role:"user",text:msg}]);try{const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:sys,messages:[...chat.map(m=>({role:m.role==="ai"?"assistant":"user",content:m.text})),{role:"user",content:msg}]})});const d=await res.json();setChat(c=>[...c,{role:"ai",text:d.content?.[0]?.text||"Connection issue."}]);}catch{setChat(c=>[...c,{role:"ai",text:"Connection issue."}]);}setLoading(false);};
  return(<div><div ref={ref} style={{maxHeight:200,overflowY:"auto",marginBottom:10,display:"flex",flexDirection:"column",gap:8}}>{chat.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}><div style={{maxWidth:"82%",background:m.role==="user"?"#3d2fa0":T.card2,color:T.txt,borderRadius:10,padding:"8px 12px",fontSize:13,lineHeight:1.5,border:m.role==="user"?"none":T.border}}>{m.text}</div></div>)}{loading&&<div style={{display:"flex"}}><div style={{background:T.card2,borderRadius:10,padding:"8px 12px",fontSize:13,color:T.txt2,border:T.border}}>Thinking…</div></div>}</div><div style={{display:"flex",gap:8}}><input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={placeholder||"Ask about your home…"} style={{flex:1,padding:"8px 12px",borderRadius:8,border:T.border,background:T.card3,fontSize:13,color:T.txt,outline:"none"}}/><button onClick={send} disabled={loading} style={{padding:"8px 16px",borderRadius:8,background:"#4c3db8",color:"#e0daff",border:"none",fontSize:13,cursor:"pointer",opacity:loading?0.5:1,fontWeight:500}}>Send</button></div></div>);
}
function NLBuilder({onAdd}){
  const [desc,setDesc]=useState("");const [loading,setLoading]=useState(false);const [preview,setPreview]=useState(null);const [err,setErr]=useState("");
  const build=async()=>{if(!desc.trim()||loading)return;setLoading(true);setErr("");setPreview(null);try{const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,system:"Parse a smart home automation into JSON ONLY: name (4 words max), trigger (string), actions (string array max 4). Raw JSON only.",messages:[{role:"user",content:desc}]})});const d=await res.json();const raw=(d.content?.[0]?.text||"{}").replace(/```json|```/g,"").trim();setPreview(JSON.parse(raw));}catch{setErr("Could not parse.");}setLoading(false);};
  return(<div style={{background:T.card3,borderRadius:12,padding:"16px",marginBottom:16,border:"0.5px solid "+T.purpleBr}}><p style={{margin:"0 0 4px",fontSize:13,fontWeight:500,color:T.purple}}>Build automation with AI</p><textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={2} placeholder="Describe what you want your home to do…" style={{width:"100%",padding:"8px 12px",borderRadius:8,border:"0.5px solid "+T.purpleBr,fontSize:13,resize:"vertical",boxSizing:"border-box",background:T.card,color:T.txt,outline:"none"}}/><button onClick={build} disabled={loading||!desc.trim()} style={{marginTop:8,padding:"8px 18px",borderRadius:8,background:"#4c3db8",color:"#e0daff",border:"none",fontSize:13,cursor:"pointer",opacity:loading||!desc.trim()?0.4:1,fontWeight:500}}>{loading?"Building…":"Build automation ↗"}</button>{err&&<p style={{margin:"8px 0 0",fontSize:12,color:T.red}}>{err}</p>}{preview&&(<div style={{marginTop:12,background:T.card2,borderRadius:10,padding:14,border:"0.5px solid "+T.purpleBr}}><p style={{margin:"0 0 3px",fontSize:14,fontWeight:500,color:T.txt}}>{preview.name}</p><p style={{margin:"0 0 3px",fontSize:12,color:T.txt2}}>Trigger: {preview.trigger}</p><p style={{margin:"0 0 12px",fontSize:12,color:T.txt2}}>{Array.isArray(preview.actions)?preview.actions.join(" · "):preview.actions}</p><button onClick={()=>{onAdd({name:preview.name,trigger:preview.trigger,actions:Array.isArray(preview.actions)?preview.actions.join(" · "):preview.actions,active:true});setPreview(null);setDesc("");}} style={{padding:"6px 16px",borderRadius:8,background:"#4c3db8",color:"#e0daff",border:"none",fontSize:12,cursor:"pointer",marginRight:8}}>Add</button><button onClick={()=>setPreview(null)} style={{padding:"6px 14px",borderRadius:8,border:T.border,background:"transparent",fontSize:12,cursor:"pointer",color:T.txt2}}>Discard</button></div>)}</div>);
}

// ── DIGITAL TWIN WITH ENERGY LAYER ───────────────────────────────────────────
function DigitalTwin({devices,agents}){
  const mountRef=useRef(null);
  const [clock,setClock]=useState(new Date());
  const [viewMode,setViewMode]=useState("energy");
  const [lightZones,setLightZones]=useState(LIGHT_ZONES_INIT);
  const [selZone,setSelZone]=useState(null);
  const lightZoneRef=useRef(lightZones);
  const viewModeRef=useRef(viewMode);
  const selZoneRef=useRef(selZone);
  const sceneRefs=useRef({lightObjs:[],camObjs:[],doorObjs:[],motionObjs:[]});

  useEffect(()=>{lightZoneRef.current=lightZones;},[lightZones]);
  useEffect(()=>{viewModeRef.current=viewMode;},[viewMode]);
  useEffect(()=>{selZoneRef.current=selZone;},[selZone]);
  useEffect(()=>{const iv=setInterval(()=>setClock(new Date()),1000);return()=>clearInterval(iv);},[]);

  const toggleLight=i=>setLightZones(lz=>lz.map((z,j)=>j!==i?z:{...z,on:!z.on,watts:!z.on?Math.round(z.maxW*0.55):0}));
  const optimizeZone=i=>setLightZones(lz=>lz.map((z,j)=>j!==i||!z.on?z:{...z,watts:Math.max(Math.round(z.watts*0.58),20)}));
  const optimizeAll=()=>setLightZones(lz=>lz.map(z=>z.on&&z.optSave>0?{...z,watts:Math.max(Math.round(z.watts*0.58),20)}:z));
  const restoreAll=()=>setLightZones(LIGHT_ZONES_INIT);

  const totalW=lightZones.reduce((s,z)=>s+(z.on?z.watts:0),0);
  const savingsW=lightZones.reduce((s,z)=>s+(z.on&&z.optSave>0?z.optSave:0),0);
  const litCount=lightZones.filter(z=>z.on).length;

  // ── THREE.JS SCENE ──────────────────────────────────────────────────────────
  useEffect(()=>{
    if(!mountRef.current)return;
    const el=mountRef.current;const W=el.clientWidth||660,H=500;
    const renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(W,H);renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);
    const scene=new THREE.Scene();scene.background=new THREE.Color(0x030d18);scene.fog=new THREE.Fog(0x030d18,40,68);
    const asp=W/H,fs=18;
    const cam=new THREE.OrthographicCamera(-fs*asp/2,fs*asp/2,fs/2,-fs/2,0.1,200);
    cam.position.set(18,16,18);cam.lookAt(1,1.5,0);
    scene.add(new THREE.AmbientLight(0x080d18,2.5));
    const sun=new THREE.DirectionalLight(0x3355aa,1.2);sun.position.set(12,22,12);sun.castShadow=true;scene.add(sun);
    const ambBlue=new THREE.PointLight(0x0033aa,0.8,25);ambBlue.position.set(0,8,0);scene.add(ambBlue);
    const grid=new THREE.GridHelper(36,36,0x0a2a4a,0x051018);grid.position.y=-0.02;scene.add(grid);

    const addBox=(x,y,z,w,h,d,color,op=1,emissive=0)=>{const geo=new THREE.BoxGeometry(w,h,d);const mat=new THREE.MeshPhongMaterial({color,emissive,transparent:op<1,opacity:op,depthWrite:op>0.5,side:THREE.DoubleSide});const mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color:0x1a5588,transparent:true,opacity:0.7})));return mesh;};
    const gW=(x,y,z,w,h,rotY=0)=>{const geo=new THREE.BoxGeometry(w,h,0.12);const mat=new THREE.MeshPhongMaterial({color:0x0a3566,emissive:0x010e22,transparent:true,opacity:0.22,side:THREE.DoubleSide,depthWrite:false});const mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,y,z);mesh.rotation.y=rotY;scene.add(mesh);mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color:0x00aaff,transparent:true,opacity:0.9})));};

    // Building structure
    const WH=3.6,GY=WH/2;
    addBox(1,-0.12,0,20,0.24,16,0x060f18);addBox(0,0.05,0,13,0.1,11,0x0c1e2e,1,0x010510);addBox(9,0.05,0,6,0.1,6,0x0a1a28,1,0x010410);
    gW(-6.5,GY,0,0.12,WH,Math.PI/2);gW(6.5,GY,0,0.12,WH,Math.PI/2);gW(0,GY,5.5,13,WH,0);gW(0,GY,-5.5,13,WH,0);
    const iMat=new THREE.MeshPhongMaterial({color:0x0d2a40,transparent:true,opacity:0.4,side:THREE.DoubleSide});
    [[0,GY,0,13,WH,0],[-2,GY,2.75,6,WH,Math.PI/2],[2.5,GY,2.75,4,WH,Math.PI/2]].forEach(([x,y,z,w,h,r])=>{const geo=new THREE.BoxGeometry(w,h,0.1);const m=new THREE.Mesh(geo,iMat);m.position.set(x,y,z);m.rotation.y=r;scene.add(m);});
    addBox(-2,3.7,0,9,0.18,11,0x0d2235,0.92);gW(-6.5,5.1,0,0.12,2.8,Math.PI/2);gW(2.5,5.1,0,0.12,2.8,Math.PI/2);gW(-2,5.1,5.5,9,2.8,0);gW(-2,5.1,-5.5,9,2.8,0);
    for(let s=0;s<5;s++)addBox(-0.5,0.2+s*0.65,4.0-s*0.52,1.8,0.12,0.9,0x1a3a5c,0.85);
    addBox(0,WH+0.08,0,13.2,0.12,11.2,0x0a2a4a,0.06);
    gW(6.5,1.55,0,0.12,3.1,Math.PI/2);gW(12.1,1.55,0,0.12,3.1,Math.PI/2);gW(9,1.55,3.1,6.2,3.1,0);gW(9,1.55,-3.1,6.2,3.1,0);
    const postMat=new THREE.MeshBasicMaterial({color:0x004488});const postGeo=new THREE.CylinderGeometry(0.07,0.07,0.45,8);
    [[-9,8],[-6,8],[-3,8],[0,8],[3,8],[6,8],[9,8],[12,8],[-9,-8],[-6,-8],[-3,-8],[0,-8],[3,-8],[6,-8],[9,-8],[12,-8],[-9,5],[-9,0],[-9,-5],[12,5],[12,0],[12,-5]].forEach(([px,pz])=>{const m=new THREE.Mesh(postGeo,postMat);m.position.set(px,0.22,pz);scene.add(m);});
    const pts=[new THREE.Vector3(-9,0.35,8),new THREE.Vector3(12,0.35,8),new THREE.Vector3(12,0.35,-8),new THREE.Vector3(-9,0.35,-8),new THREE.Vector3(-9,0.35,8)];
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x004488,transparent:true,opacity:0.4})));

    // ── LIGHT ZONE OBJECTS ──────────────────────────────────────────────────
    const lightObjs=[];
    LIGHT_ZONES_INIT.forEach((z,i)=>{
      // Ceiling fixture disc
      const fixGeo=new THREE.CylinderGeometry(0.3,0.34,0.07,20);
      const fixMat=new THREE.MeshPhongMaterial({color:0x1a1a22,emissive:z.on?z.temp:0x080808,emissiveIntensity:z.on?1.0:0});
      const fix=new THREE.Mesh(fixGeo,fixMat);fix.position.set(z.x,z.fixY,z.z);scene.add(fix);
      // Pendant stem
      const stemGeo=new THREE.CylinderGeometry(0.025,0.025,0.28,6);
      const stemMat=new THREE.MeshBasicMaterial({color:0x2a2a33});
      const stem=new THREE.Mesh(stemGeo,stemMat);stem.position.set(z.x,z.fixY+0.175,z.z);scene.add(stem);
      // Downlight cone
      const coneGeo=new THREE.ConeGeometry(0.22,0.18,16,1,true);
      const coneMat=new THREE.MeshBasicMaterial({color:z.temp,transparent:true,opacity:z.on?0.55:0,side:THREE.BackSide});
      const cone=new THREE.Mesh(coneGeo,coneMat);cone.position.set(z.x,z.fixY-0.14,z.z);scene.add(cone);
      // Room point light
      const pl=new THREE.PointLight(z.temp,z.on?2.2:0,z.radius*2.8);pl.position.set(z.x,z.fixY-0.5,z.z);scene.add(pl);
      // Floor halo — large fill
      const eff=z.on?z.watts/z.maxW:0;
      const fc=eff>0.65?0xff5533:eff>0.35?0xffaa22:0x33dd88;
      const haloGeo=new THREE.CircleGeometry(z.radius,40);
      const haloMat=new THREE.MeshBasicMaterial({color:fc,transparent:true,opacity:z.on?0.1:0.01,side:THREE.DoubleSide});
      const halo=new THREE.Mesh(haloGeo,haloMat);halo.position.set(z.x,z.floorY+0.01,z.z);halo.rotation.x=-Math.PI/2;scene.add(halo);
      // Floor halo border
      const borderGeo=new THREE.RingGeometry(z.radius-0.09,z.radius,40);
      const borderMat=new THREE.MeshBasicMaterial({color:fc,transparent:true,opacity:z.on?0.5:0.02,side:THREE.DoubleSide});
      const border=new THREE.Mesh(borderGeo,borderMat);border.position.set(z.x,z.floorY+0.02,z.z);border.rotation.x=-Math.PI/2;scene.add(border);
      // Inner bright spot
      const spotGeo=new THREE.CircleGeometry(z.radius*0.28,24);
      const spotMat=new THREE.MeshBasicMaterial({color:z.temp,transparent:true,opacity:z.on?0.25:0,side:THREE.DoubleSide});
      const spot=new THREE.Mesh(spotGeo,spotMat);spot.position.set(z.x,z.floorY+0.03,z.z);spot.rotation.x=-Math.PI/2;scene.add(spot);
      // Optimization pulsing ring (amber) — shows when savings available
      const optGeo=new THREE.RingGeometry(z.radius+0.12,z.radius+0.32,36);
      const optMat=new THREE.MeshBasicMaterial({color:0xffaa00,transparent:true,opacity:0,side:THREE.DoubleSide});
      const optMesh=new THREE.Mesh(optGeo,optMat);optMesh.position.set(z.x,z.floorY+0.04,z.z);optMesh.rotation.x=-Math.PI/2;scene.add(optMesh);
      // Selection highlight ring
      const selGeo=new THREE.RingGeometry(z.radius+0.36,z.radius+0.56,36);
      const selMat=new THREE.MeshBasicMaterial({color:0x8b7de8,transparent:true,opacity:0,side:THREE.DoubleSide});
      const selMesh=new THREE.Mesh(selGeo,selMat);selMesh.position.set(z.x,z.floorY+0.05,z.z);selMesh.rotation.x=-Math.PI/2;scene.add(selMesh);

      lightObjs.push({pl,fixMat,coneMat,haloMat,borderMat,spotMat,optMat,selMat,fix,cone});
    });
    sceneRefs.current.lightObjs=lightObjs;

    // ── SECURITY SENSOR OBJECTS ─────────────────────────────────────────────
    const CAM_DEFS=[{pos:[-1.5,3.4,5.5],dir:[0,-0.35,-1],alert:false},{pos:[2,3.4,-5.5],dir:[0.2,-0.3,1],alert:true},{pos:[13,2.8,0.5],dir:[-1,-0.25,0],alert:false},{pos:[-7,2.2,0],dir:[1,-0.25,0],alert:false},{pos:[-4,3.2,-1.5],dir:[0.3,-0.35,1],alert:false},{pos:[11,2.6,0],dir:[-0.8,-0.2,0],alert:false}];
    const camObjs=[];
    CAM_DEFS.forEach(c=>{
      const bMat=new THREE.MeshPhongMaterial({color:0x001133,emissive:0x002244});const body=new THREE.Mesh(new THREE.BoxGeometry(0.28,0.2,0.38),bMat);body.position.set(...c.pos);scene.add(body);
      const lMat=new THREE.MeshBasicMaterial({color:c.alert?0xff2200:0x00aaff});const led=new THREE.Mesh(new THREE.SphereGeometry(0.075,10,10),lMat);led.position.set(c.pos[0],c.pos[1]+0.11,c.pos[2]+0.2);scene.add(led);
      const CONEL=3.2;const cMat=new THREE.MeshBasicMaterial({color:c.alert?0xff3300:0x0066ff,transparent:true,opacity:0.12,side:THREE.DoubleSide});const cone=new THREE.Mesh(new THREE.ConeGeometry(1.5,CONEL,20,1,true),cMat);
      const dirV=new THREE.Vector3(...c.dir).normalize();cone.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,-1,0),dirV));cone.position.set(c.pos[0]+dirV.x*CONEL/2,c.pos[1]+dirV.y*CONEL/2,c.pos[2]+dirV.z*CONEL/2);scene.add(cone);
      const rMat=new THREE.MeshBasicMaterial({color:c.alert?0xff4400:0x00ccff,side:THREE.DoubleSide,transparent:true,opacity:0.9});const ring=new THREE.Mesh(new THREE.RingGeometry(0.18,0.28,16),rMat);ring.position.set(...c.pos);ring.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),dirV));scene.add(ring);
      camObjs.push({lMat,cMat,rMat,alert:c.alert});
    });
    sceneRefs.current.camObjs=camObjs;

    const doorObjs=[];
    [{pos:[-1.5,0.28,5.5]},{pos:[2,0.28,-5.5]},{pos:[-7,0.28,0]},{pos:[9,0.28,3.1]}].forEach(d=>{
      const sMat=new THREE.MeshBasicMaterial({color:0xffaa00,transparent:true,opacity:0.9});
      const sphere=new THREE.Mesh(new THREE.SphereGeometry(0.24,14,14),sMat);
      sphere.position.set(...d.pos);scene.add(sphere);
      const r1Mat=new THREE.MeshBasicMaterial({color:0xffcc44,transparent:true,opacity:0.55,side:THREE.DoubleSide});
      const r1=new THREE.Mesh(new THREE.RingGeometry(0.34,0.48,20),r1Mat);r1.position.set(...d.pos);r1.rotation.x=-Math.PI/2;scene.add(r1);
      const r2Mat=new THREE.MeshBasicMaterial({color:0xffcc44,transparent:true,opacity:0.25,side:THREE.DoubleSide});
      const r2=new THREE.Mesh(new THREE.RingGeometry(0.54,0.62,20),r2Mat);r2.position.set(...d.pos);r2.rotation.x=-Math.PI/2;scene.add(r2);
      doorObjs.push({sMat,r1Mat,r2Mat});
    });
    sceneRefs.current.doorObjs=doorObjs;

    const motionObjs=[];
    [{x:-4,z:-1.5,r:2.4,c:0x00ffcc,a:true},{x:1.5,z:2,r:1.6,c:0xffff00,a:false},{x:13,z:0.5,r:2.2,c:0xff7700,a:true}].forEach(z=>{
      const zMat=new THREE.MeshBasicMaterial({color:z.c,transparent:true,opacity:0.11,side:THREE.DoubleSide});const zm=new THREE.Mesh(new THREE.CircleGeometry(z.r,40),zMat);zm.position.set(z.x,0.08,z.z);zm.rotation.x=-Math.PI/2;scene.add(zm);
      const bMat=new THREE.MeshBasicMaterial({color:z.c,transparent:true,opacity:0.5,side:THREE.DoubleSide});const bm=new THREE.Mesh(new THREE.RingGeometry(z.r-0.1,z.r,40),bMat);bm.position.set(z.x,0.09,z.z);bm.rotation.x=-Math.PI/2;scene.add(bm);
      motionObjs.push({zMat,bMat,active:z.a});
    });
    sceneRefs.current.motionObjs=motionObjs;

    // Drag rotation
    let dragging=false,prevX=0,rotAngle=0;
    const onDown=e=>{dragging=true;prevX=e.clientX;renderer.domElement.style.cursor="grabbing";};
    const onMove=e=>{if(!dragging)return;rotAngle+=(e.clientX-prevX)*0.008;const r=Math.sqrt(cam.position.x**2+cam.position.z**2);cam.position.x=r*Math.sin(rotAngle+Math.PI/4);cam.position.z=r*Math.cos(rotAngle+Math.PI/4);cam.lookAt(1,1.5,0);prevX=e.clientX;};
    const onUp=()=>{dragging=false;renderer.domElement.style.cursor="grab";};
    renderer.domElement.style.cursor="grab";
    renderer.domElement.addEventListener("mousedown",onDown);window.addEventListener("mousemove",onMove);window.addEventListener("mouseup",onUp);
    const onTS=e=>{dragging=true;prevX=e.touches[0].clientX;};
    const onTM=e=>{if(!dragging)return;onMove({clientX:e.touches[0].clientX});};
    renderer.domElement.addEventListener("touchstart",onTS,{passive:true});window.addEventListener("touchmove",onTM,{passive:true});window.addEventListener("touchend",onUp);

    let animId;const t0=Date.now();
    const animate=()=>{
      animId=requestAnimationFrame(animate);const t=(Date.now()-t0)/1000;
      const vm=viewModeRef.current;const lzs=lightZoneRef.current;const sel=selZoneRef.current;
      const showEnergy=vm==="energy"||vm==="combined";
      const showSecurity=vm==="security"||vm==="combined";

      // ── Update light zone objects
      lightObjs.forEach((obj,i)=>{
        const lz=lzs[i];const on=lz.on;
        const eff=on?lz.watts/lz.maxW:0;
        const fc=eff>0.65?0xff5533:eff>0.35?0xffaa22:0x33dd88;
        const isSelected=sel===i;

        obj.pl.intensity=on?(showEnergy?2.0+Math.sin(t*0.25+i)*0.15:0.7):0;
        obj.fixMat.emissive.setHex(on?lz.temp:0x080808);
        obj.fixMat.emissiveIntensity=on?0.95+Math.sin(t*0.2+i)*0.04:0;
        obj.coneMat.opacity=on?0.5+Math.sin(t*0.15+i)*0.06:0;

        obj.haloMat.color.setHex(fc);
        obj.borderMat.color.setHex(fc);
        obj.haloMat.opacity=showEnergy?(on?0.09+Math.sin(t*0.4+i)*0.025:0.01):0;
        obj.borderMat.opacity=showEnergy?(on?0.45+Math.sin(t*0.5+i)*0.1:0.02):0;
        obj.spotMat.opacity=showEnergy?(on?0.22+Math.sin(t*0.3+i)*0.06:0):0;

        // Optimization ring — pulse when savings available and energy mode on
        const hasOpt=on&&lz.optSave>0&&showEnergy;
        obj.optMat.opacity=hasOpt?0.25+Math.abs(Math.sin(t*2.0+i*0.8))*0.55:0;

        // Selection ring
        obj.selMat.opacity=isSelected&&showEnergy?0.5+Math.sin(t*3+i)*0.4:0;
      });

      // ── Security sensors fade in/out based on mode
      const secAlpha=showSecurity?1:0.12;
      camObjs.forEach((c,i)=>{c.cMat.opacity=showSecurity?(c.alert?0.08+Math.abs(Math.sin(t*3+i))*0.28:0.06+Math.abs(Math.sin(t*1.4+i))*0.12)*1:0.015;c.lMat.color.setHex(c.alert?(Math.sin(t*5)>0?0xff2200:0x550000):0x00aaff);c.rMat.opacity=showSecurity?0.4+Math.abs(Math.sin(t*2+i))*0.5:0.05;});
      doorObjs.forEach((d,i)=>{const p=0.5+Math.sin(t*2.5+i)*0.45;d.sMat.opacity=(showSecurity?p*0.9:0.04);d.r1Mat.opacity=(showSecurity?(1-p)*0.65:0.02);d.r2Mat.opacity=(showSecurity?p*0.25:0.01);});
      motionObjs.forEach((z,i)=>{const p=0.5+Math.sin(t*1.3+i*1.2)*0.45;z.zMat.opacity=showSecurity?(z.active?0.07+p*0.14:0.02):0.01;z.bMat.opacity=showSecurity?(z.active?0.3+p*0.4:0.06):0.01;});
      ambBlue.intensity=(showSecurity?1.0:0.3)+Math.sin(t*0.4)*0.2;
      renderer.render(scene,cam);
    };
    animate();
    return()=>{cancelAnimationFrame(animId);renderer.domElement.removeEventListener("mousedown",onDown);window.removeEventListener("mousemove",onMove);window.removeEventListener("mouseup",onUp);renderer.domElement.removeEventListener("touchstart",onTS);window.removeEventListener("touchmove",onTM);window.removeEventListener("touchend",onUp);renderer.dispose();if(el.contains(renderer.domElement))el.removeChild(renderer.domElement);};
  },[]);

  const effCol=eff=>eff>0.65?T.red:eff>0.35?T.amber:T.green;
  const effLabel=eff=>eff>0.65?"High":"Medium";
  const hour=new Date().getHours();const isOnPeak=hour>=18&&hour<21;
  const touLabel=isOnPeak?"On-Peak":(hour>=6&&hour<9||hour>=15&&hour<18)?"Mid-Peak":"Off-Peak";
  const touCol=isOnPeak?T.red:T.green;

  return(
    <div>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,flexWrap:"wrap",gap:8}}>
        <div>
          <p style={{margin:"0 0 2px",fontSize:15,fontWeight:500,color:T.txt}}>Digital Twin</p>
          <p style={{margin:0,fontSize:12,color:T.txt2}}>Great Falls Residence · Live IoT + Energy overlay · drag to rotate</p>
        </div>
        <div style={{display:"flex",gap:0,borderRadius:10,overflow:"hidden",border:T.border}}>
          {[{id:"security",icon:"🛡",label:"Security"},{id:"energy",icon:"⚡",label:"Energy"},{id:"combined",icon:"◈",label:"Combined"}].map(m=>(
            <button key={m.id} onClick={()=>setViewMode(m.id)} style={{padding:"6px 14px",background:viewMode===m.id?T.purpleBg:"transparent",color:viewMode===m.id?T.purple:T.txt2,border:"none",fontSize:12,fontWeight:viewMode===m.id?500:400,cursor:"pointer"}}>
              {m.icon} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Energy summary strip */}
      {(viewMode==="energy"||viewMode==="combined")&&(
        <div style={{background:T.card3,border:T.border,borderRadius:10,padding:"8px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:14}}>
            {[{label:"Lit zones",val:litCount+"/"+lightZones.length,col:T.txt},{label:"Lighting load",val:totalW+"W",col:T.purple},{label:"Savings potential",val:savingsW+"W",col:T.amber},{label:"TOU window",val:touLabel,col:touCol}].map(s=>(
              <div key={s.label} style={{textAlign:"center"}}><p style={{margin:0,fontSize:9,color:T.txt3,letterSpacing:.5}}>{s.label.toUpperCase()}</p><p style={{margin:0,fontSize:14,fontWeight:500,color:s.col}}>{s.val}</p></div>
            ))}
          </div>
          <div style={{marginLeft:"auto",display:"flex",gap:8}}>
            {[{c:"#33dd88",l:"Efficient"},{c:"#ffaa22",l:"Moderate"},{c:"#ff5533",l:"High draw"},{c:"#ffaa00",l:"⟳ Optimize available"}].map(e=>(
              <div key={e.l} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:8,height:8,borderRadius:2,background:e.c,opacity:.85}}/><span style={{fontSize:9,color:T.txt3}}>{e.l}</span></div>
            ))}
          </div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 242px",gap:12,alignItems:"start"}}>

        {/* 3D Viewport */}
        <div style={{position:"relative",borderRadius:14,overflow:"hidden",border:"1px solid #0a3060",background:"#030d18"}}>
          {/* HUD top */}
          <div style={{position:"absolute",top:0,left:0,right:0,zIndex:10,pointerEvents:"none",padding:"7px 14px",background:"rgba(3,13,24,0.92)",borderBottom:"0.5px solid #0a3060",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:6,height:6,borderRadius:"50%",background:"#00ff88"}}/><span style={{fontSize:9,color:"#00aaff",fontFamily:"monospace",letterSpacing:1.5,fontWeight:700}}>SENTINEL DIGITAL TWIN v2.2  ·  {viewMode.toUpperCase()} VIEW</span></div>
            <span style={{fontSize:9,color:"#00aaff",fontFamily:"monospace"}}>{clock.toLocaleTimeString("en-US",{hour12:false})}</span>
          </div>
          <div style={{paddingTop:30}} ref={mountRef}/>
          {/* HUD bottom legend */}
          <div style={{position:"absolute",bottom:8,left:12,zIndex:10,pointerEvents:"none",display:"flex",gap:12}}>
            {(viewMode==="security"||viewMode==="combined")&&[{c:"#0066ff",l:"Camera FoV"},{c:"#ffaa00",l:"Entry Sensor"},{c:"#00ffcc",l:"Motion Zone"}].map(e=><div key={e.l} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:7,height:7,borderRadius:2,background:e.c}}/><span style={{fontSize:7.5,color:"#556677",fontFamily:"monospace"}}>{e.l}</span></div>)}
            {(viewMode==="energy"||viewMode==="combined")&&[{c:"#ffcc66",l:"Light Fixture"},{c:"#ffaa00",l:"Optimize"}].map(e=><div key={e.l} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:7,height:7,borderRadius:2,background:e.c}}/><span style={{fontSize:7.5,color:"#556677",fontFamily:"monospace"}}>{e.l}</span></div>)}
          </div>
          {/* Threat badge */}
          <div style={{position:"absolute",top:40,left:12,zIndex:10,pointerEvents:"none"}}><div style={{background:"rgba(3,13,24,.88)",border:"0.5px solid #002244",borderRadius:6,padding:"5px 10px"}}><p style={{margin:0,fontSize:7.5,color:"#336688",fontFamily:"monospace",letterSpacing:1}}>THREAT</p><p style={{margin:"2px 0 0",fontSize:16,fontWeight:700,color:"#00ff88",fontFamily:"monospace",lineHeight:1}}>LOW  12</p></div></div>
          {/* Energy badge */}
          {(viewMode==="energy"||viewMode==="combined")&&<div style={{position:"absolute",top:40,right:12,zIndex:10,pointerEvents:"none"}}><div style={{background:"rgba(3,13,24,.88)",border:"0.5px solid #1a3555",borderRadius:6,padding:"5px 10px"}}><p style={{margin:0,fontSize:7.5,color:"#336688",fontFamily:"monospace",letterSpacing:1}}>LIGHTING</p><p style={{margin:"2px 0 0",fontSize:16,fontWeight:700,color:"#fbbf24",fontFamily:"monospace",lineHeight:1}}>{totalW}W</p></div></div>}
          {/* Alert badge */}
          {(viewMode==="security"||viewMode==="combined")&&<div style={{position:"absolute",top:96,right:12,zIndex:10,pointerEvents:"none"}}><div style={{background:"rgba(40,5,5,.9)",border:"1px solid #ff3300",borderRadius:6,padding:"4px 10px",display:"flex",alignItems:"center",gap:5}}><div style={{width:5,height:5,borderRadius:"50%",background:"#ff3300"}}/><span style={{fontSize:7.5,color:"#ff6644",fontFamily:"monospace",fontWeight:700}}>BACK YARD — INTRUDER</span></div></div>}
        </div>

        {/* Sidebar — adapts to view mode */}
        <div style={{background:"#030d18",borderRadius:14,border:"1px solid #0a3060",overflow:"hidden",display:"flex",flexDirection:"column"}}>
          {/* Tab strip */}
          <div style={{display:"flex",borderBottom:"0.5px solid #0a3060"}}>
            <div style={{flex:1,padding:"8px 10px",borderBottom:"0.5px solid "+((viewMode==="energy"||viewMode==="combined")?"#8b7de8":"transparent"),background:(viewMode==="energy"||viewMode==="combined")?"rgba(21,16,58,.5)":"transparent"}}>
              <p style={{margin:0,fontSize:8,color:(viewMode==="energy"||viewMode==="combined")?T.purple:"#336688",letterSpacing:1.5,fontFamily:"monospace"}}>ENERGY ZONES</p>
            </div>
            <div style={{flex:1,padding:"8px 10px",borderBottom:"0.5px solid "+((viewMode==="security"||viewMode==="combined")?"#00aaff":"transparent"),background:(viewMode==="security"||viewMode==="combined")?"rgba(6,21,40,.5)":"transparent"}}>
              <p style={{margin:0,fontSize:8,color:(viewMode==="security"||viewMode==="combined")?"#00aaff":"#336688",letterSpacing:1.5,fontFamily:"monospace"}}>SECURITY</p>
            </div>
          </div>

          <div style={{padding:"10px 12px",flex:1,overflowY:"auto",maxHeight:468}}>

            {/* Energy Zone Panel */}
            {(viewMode==="energy"||viewMode==="combined")&&(
              <div style={{marginBottom:viewMode==="combined"?14:0}}>
                {lightZones.map((z,i)=>{
                  const eff=z.on?z.watts/z.maxW:0;const ec=effCol(eff);const isSel=selZone===i;
                  return(
                    <div key={z.id} onClick={()=>setSelZone(selZone===i?null:i)} style={{marginBottom:8,cursor:"pointer"}}>
                      <div style={{background:isSel?"rgba(21,16,58,.7)":T.card3,borderRadius:10,padding:"9px 10px",border:"0.5px solid "+(isSel?T.purpleBr:"#0a2040"),transition:"background .15s"}}>
                        {/* Zone header */}
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <div style={{width:7,height:7,borderRadius:"50%",background:z.on?ec:"#1e2d3d",boxShadow:z.on?"0 0 5px "+ec:"none"}}/>
                            <span style={{fontSize:10,fontWeight:500,color:isSel?T.purple:T.txt,fontFamily:"monospace"}}>{z.name}</span>
                          </div>
                          <div onClick={e=>{e.stopPropagation();toggleLight(i);}} style={{width:30,height:16,borderRadius:8,background:z.on?"#4c3db8":"#1e2d3d",position:"relative",cursor:"pointer",flexShrink:0,transition:"background .2s"}}>
                            <div style={{position:"absolute",top:1.5,left:z.on?16:1.5,width:13,height:13,borderRadius:"50%",background:z.on?"#e0daff":"#4a5a6a",transition:"left .2s"}}/>
                          </div>
                        </div>
                        {/* Wattage bar */}
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:z.on?4:0}}>
                          <div style={{flex:1,height:3,background:"#0a1828",borderRadius:2,overflow:"hidden"}}>
                            <div style={{height:"100%",width:(z.watts/z.maxW*100)+"%",background:ec,borderRadius:2,transition:"width .4s,background .3s"}}/>
                          </div>
                          <span style={{fontSize:9,color:ec,fontFamily:"monospace",fontWeight:700,minWidth:28}}>{z.on?z.watts+"W":"Off"}</span>
                        </div>
                        {/* Optimization tip — expanded when selected */}
                        {isSel&&(
                          <div style={{marginTop:6}}>
                            <p style={{margin:"0 0 4px",fontSize:9,color:T.txt2,lineHeight:1.5}}>{z.tip}</p>
                            {z.on&&z.optSave>0&&(
                              <div style={{display:"flex",gap:5,alignItems:"center"}}>
                                <span style={{fontSize:9,color:T.amber,fontFamily:"monospace"}}>⟳ Save ~{z.optSave}W</span>
                                <button onClick={e=>{e.stopPropagation();optimizeZone(i);}} style={{fontSize:8,padding:"2px 7px",borderRadius:4,background:T.amberBg,color:T.amber,border:"0.5px solid "+T.amber+"44",cursor:"pointer"}}>Apply</button>
                              </div>
                            )}
                            {z.on&&z.optSave===0&&<span style={{fontSize:9,color:T.green,fontFamily:"monospace"}}>✓ Already optimal</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div style={{display:"flex",gap:5,marginTop:4}}>
                  <button onClick={optimizeAll} style={{flex:1,padding:"5px 0",borderRadius:7,background:T.amberBg,color:T.amber,border:"0.5px solid "+T.amber+"44",fontSize:9,cursor:"pointer",fontWeight:600,fontFamily:"monospace"}}>OPTIMIZE ALL  −{savingsW}W</button>
                  <button onClick={restoreAll} style={{padding:"5px 8px",borderRadius:7,border:T.border,background:"transparent",color:T.txt3,fontSize:9,cursor:"pointer"}}>Reset</button>
                </div>
                <div style={{marginTop:8,padding:"7px 9px",background:"rgba(6,19,30,.8)",borderRadius:7,border:"0.5px solid #0a2a4a"}}>
                  <p style={{margin:"0 0 3px",fontSize:7.5,color:"#1a4a6a",letterSpacing:1,fontFamily:"monospace"}}>PEMS ENERGY ASSESSMENT</p>
                  <p style={{margin:0,fontSize:8.5,color:"#4488aa",fontFamily:"monospace",lineHeight:1.7}}>{"Living Room + Office at "+Math.round((lightZones[1].watts+lightZones[5].watts)/10)*10+"W combined. Pre-dim before 6 PM peak saves est. $0.34 today. Office monitor strip: 60W reduction available."}</p>
                </div>
              </div>
            )}

            {/* Security Telemetry Panel */}
            {(viewMode==="security"||viewMode==="combined")&&(
              <div>
                {viewMode==="combined"&&<p style={{margin:"0 0 8px",fontSize:7.5,color:"#1a4a6a",letterSpacing:1.5,fontFamily:"monospace",borderBottom:"0.5px solid #061520",paddingBottom:4}}>SECURITY TELEMETRY</p>}
                {[{section:"CAMERAS",items:[{l:"Front Door",s:"ONLINE",t:"ok"},{l:"Back Yard",s:"⚠ ALERT",t:"warn"},{l:"Driveway",s:"ONLINE",t:"ok"},{l:"Side Gate",s:"ONLINE",t:"ok"},{l:"Living Room",s:"ONLINE",t:"ok"},{l:"Garage",s:"ONLINE",t:"ok"}]},{section:"ENTRY SENSORS",items:[{l:"Front Door Lock",s:"LOCKED",t:"ok"},{l:"Back Door",s:"LOCKED",t:"ok"},{l:"Side Gate",s:"LOCKED",t:"ok"},{l:"Garage Door",s:"CLOSED",t:"ok"}]},{section:"MOTION ZONES",items:[{l:"Living Room",s:"ACTIVE",t:"teal"},{l:"Hallway",s:"CLEAR",t:"ok"},{l:"Driveway",s:"ACTIVE",t:"warn"}]}].map(sec=>(
                  <div key={sec.section} style={{marginBottom:12}}>
                    <p style={{margin:"0 0 5px",fontSize:7.5,color:"#1a4a6a",letterSpacing:1.5,fontFamily:"monospace",borderBottom:"0.5px solid #061520",paddingBottom:3}}>{sec.section}</p>
                    {sec.items.map(item=>{const tc={ok:"#00ff88",warn:"#ffaa00",teal:"#00ffcc",alert:"#ff4444"};return(<div key={item.l} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:9,color:"#6699aa",fontFamily:"monospace"}}>{item.l}</span><div style={{display:"flex",alignItems:"center",gap:3}}><div style={{width:4,height:4,borderRadius:"50%",background:tc[item.t]}}/><span style={{fontSize:8,fontWeight:700,color:tc[item.t],fontFamily:"monospace"}}>{item.s}</span></div></div>);})}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ENERGYHUB ──────────────────────────────────────────────────────────────────
function EnergyHub({devices,agents}){
  const chartRef=useRef(null);
  const [persona,setPersona]=useState("home");
  const [pemsMode,setPemsMode]=useState("off-peak-opt");
  const [loads,setLoads]=useState([
    {id:"sec",   name:"Security Mesh",  draw:0.42,max:0.50,shed:false,protected:true, icon:"🛡",zone:"Critical"},
    {id:"hvac",  name:"HVAC System",    draw:1.18,max:2.00,shed:false,protected:false,icon:"🌡",zone:"Comfort"},
    {id:"ev",    name:"EV Charging",    draw:0.82,max:7.20,shed:false,protected:false,icon:"⚡",zone:"Deferrable"},
    {id:"light", name:"Smart Lighting", draw:0.18,max:0.40,shed:false,protected:false,icon:"💡",zone:"Comfort"},
    {id:"appl",  name:"Appliances",     draw:0.24,max:1.20,shed:false,protected:false,icon:"🏠",zone:"Comfort"},
    {id:"vamp",  name:"Vampire Loads",  draw:0.14,max:0.30,shed:false,protected:false,icon:"🧛",zone:"Deferrable"},
  ]);
  const [nimlAlerts]=useState([
    {id:1,device:"Refrigerator Unit",alert:"Irregular compressor — possible overheating",severity:"warn"},
    {id:2,device:"HVAC Compressor 2",alert:"Drawing 18% above 30-day baseline",severity:"info"},
  ]);
  const totalLoad=loads.reduce((s,l)=>s+(l.shed?0:l.draw),0);
  const battery=87;const secAutonomy=((battery/100)*20*0.9).toFixed(1);
  const hour=new Date().getHours();const isOnPeak=hour>=18&&hour<21;const isMidPeak=(hour>=6&&hour<9)||(hour>=15&&hour<18);
  const touRate=isOnPeak?0.32:isMidPeak?0.16:0.08;const touLabel=isOnPeak?"On-Peak":isMidPeak?"Mid-Peak":"Off-Peak";const touColor=isOnPeak?T.red:isMidPeak?T.amber:T.green;
  const shedLoad=id=>setLoads(ls=>ls.map(l=>l.id===id&&!l.protected?{...l,shed:!l.shed}:l));
  const HOME_MODES=[{id:"comfort",label:"Comfort",icon:"🏡",desc:"Full comfort, cost-optimized"},{id:"off-peak-opt",label:"Off-Peak Opt.",icon:"⚡",desc:"Shift deferrable loads"},{id:"away",label:"Away",icon:"🚶",desc:"HVAC setback, lights off"},{id:"deep-sleep",label:"Deep Sleep",icon:"🌙",desc:"Vampire cuts, min HVAC"},{id:"grid-down",label:"Grid-Down",icon:"🔋",desc:"Security Mesh only"}];
  useEffect(()=>{
    const canvas=chartRef.current;if(!canvas)return;const ctx=canvas.getContext("2d");const W=canvas.width,H=canvas.height;let raf,lastT=0,frame=0;
    const draw=(ts)=>{raf=requestAnimationFrame(draw);if(ts-lastT<80)return;lastT=ts;frame++;const f=frame;ctx.clearRect(0,0,W,H);const bW=W/24;
      [{s:0,e:6,c:"rgba(52,211,153,0.07)"},{s:6,e:9,c:"rgba(251,191,36,0.09)"},{s:9,e:15,c:"rgba(52,211,153,0.07)"},{s:15,e:18,c:"rgba(251,191,36,0.09)"},{s:18,e:21,c:"rgba(248,113,113,0.12)"},{s:21,e:24,c:"rgba(52,211,153,0.07)"}].forEach(b=>{ctx.fillStyle=b.c;ctx.fillRect(b.s*bW,0,(b.e-b.s)*bW,H-16);});
      ctx.strokeStyle="rgba(26,37,53,0.7)";ctx.lineWidth=0.5;[0,6,9,12,15,18,21,24].forEach(h=>{ctx.beginPath();ctx.moveTo(h*bW,0);ctx.lineTo(h*bW,H-16);ctx.stroke();});
      const nowH=new Date().getHours()+new Date().getMinutes()/60;const pts=[];
      for(let h=0;h<=nowH;h+=0.08){const base=0.8,daily=Math.sin((h-6)*Math.PI/12)*1.4+1.2,noise=Math.sin(h*7.3)*0.12+Math.sin(h*13.1)*0.07;const peak=(h>7&&h<9)||(h>17&&h<20)?1.35:1;const val=Math.max(0.3,(base+daily*0.65+noise)*peak);pts.push({x:h*bW,y:(H-16)-(val/5)*(H-22)});}
      if(pts.length>1){if(pts.length>0)pts[pts.length-1].y+=Math.sin(f*.15)*2;ctx.beginPath();ctx.moveTo(pts[0].x,H-16);pts.forEach(p=>ctx.lineTo(p.x,p.y));ctx.lineTo(pts[pts.length-1].x,H-16);ctx.closePath();const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgba(139,125,232,0.4)");g.addColorStop(1,"rgba(139,125,232,0.02)");ctx.fillStyle=g;ctx.fill();ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle="#8b7de8";ctx.lineWidth=1.8;ctx.stroke();const cur=pts[pts.length-1];ctx.beginPath();ctx.arc(cur.x,cur.y,4,0,Math.PI*2);ctx.fillStyle="#8b7de8";ctx.fill();}
      ctx.strokeStyle="rgba(248,113,113,0.45)";ctx.lineWidth=1;ctx.setLineDash([5,4]);const tY=(H-16)-(4/5)*(H-22);ctx.beginPath();ctx.moveTo(0,tY);ctx.lineTo(W,tY);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle="rgba(94,122,150,0.8)";ctx.font="9px monospace";[0,6,9,12,15,18,21].forEach(h=>{ctx.fillText(h===0?"12a":h<12?h+"a":h===12?"12p":(h-12)+"p",h*bW+2,H-4);});
    };
    raf=requestAnimationFrame(draw);return()=>cancelAnimationFrame(raf);
  },[]);
  const energySys="You are Aegis PEMS AI. Persona: "+persona+". Load: "+totalLoad.toFixed(2)+"kW. TOU: $"+touRate.toFixed(2)+"/kWh ("+touLabel+"). Battery: "+battery+"% — security autonomy "+secAutonomy+"h. Mode: "+pemsMode+". Priority: Safety > Security > Energy. Never shed Security Mesh unless UPS < 15%. Reply 2-3 sentences with specific kWh/cost savings.";
  const energyInit="PEMS online. Load: "+totalLoad.toFixed(2)+"kW | "+touLabel+" $"+touRate.toFixed(2)+"/kWh | Security autonomy: "+secAutonomy+"h. "+(isOnPeak?"On-peak active — recommend shedding EV and deferring appliances now.":"Off-peak window — optimal for EV charging and appliance cycles.");
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:10}}>
        <div><p style={{margin:"0 0 2px",fontSize:15,fontWeight:500,color:T.txt}}>EnergyHub</p><p style={{margin:0,fontSize:12,color:T.txt2}}>Predictive Energy Management · NILM · Grid-Interactive · PEMS v2</p></div>
        <div style={{display:"flex",gap:0,borderRadius:10,overflow:"hidden",border:T.border}}>
          {["home","business"].map(p=><button key={p} onClick={()=>setPersona(p)} style={{padding:"7px 18px",background:persona===p?T.purpleBg:"transparent",color:persona===p?T.purple:T.txt2,border:"none",fontSize:12,fontWeight:persona===p?500:400,cursor:"pointer",textTransform:"capitalize"}}>{p==="home"?"🏡 Home":"🏢 Business"}</button>)}
        </div>
      </div>
      <div style={{background:T.card3,border:T.border,borderRadius:10,padding:"9px 16px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:6,height:6,borderRadius:"50%",background:T.green,boxShadow:"0 0 6px "+T.green}}/><span style={{fontSize:11,color:T.txt2,fontFamily:"monospace",letterSpacing:.5}}>ENERGY RESILIENCE</span></div>
        <span style={{fontSize:12,color:T.txt,fontFamily:"monospace"}}>{"Load: "+totalLoad.toFixed(2)+"kW  |  Mode: "+HOME_MODES.find(m=>m.id===pemsMode)?.label+"  |  Security Autonomy: "+secAutonomy+"h on Battery"}</span>
        <Bdg type={isOnPeak?"alert":isMidPeak?"warn":"ok"}>{touLabel} · ${touRate.toFixed(2)}/kWh</Bdg>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
        {[{label:"Current draw",val:totalLoad.toFixed(2)+" kW",col:T.purple},{label:"TOU rate",val:"$"+touRate.toFixed(2)+"/kWh",col:touColor},{label:"Battery / UPS",val:battery+"%",col:T.green},{label:"Est. peak savings",val:"$"+(loads.filter(l=>!l.protected&&!l.shed).reduce((s,l)=>s+l.draw,0)*touRate*0.5).toFixed(2),col:T.teal}].map(s=>(
          <div key={s.label} style={{background:T.card2,borderRadius:10,padding:"12px 14px",border:T.border}}><p style={{margin:0,fontSize:11,color:T.txt2,marginBottom:4}}>{s.label}</p><p style={{margin:0,fontSize:20,fontWeight:500,color:s.col}}>{s.val}</p></div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:14}}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={CS}><p style={{margin:"0 0 8px",fontSize:13,fontWeight:500,color:T.txt}}>24-hour power timeline</p><canvas ref={chartRef} width={500} height={130} style={{width:"100%",display:"block"}}/></div>
          <div style={CS}>
            <p style={{margin:"0 0 12px",fontSize:13,fontWeight:500,color:T.txt}}>Load management · NILM</p>
            {loads.map(l=>{const barW=Math.min((l.draw/l.max)*100,100);return(
              <div key={l.id} style={{marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:15}}>{l.icon}</span><div><p style={{margin:0,fontSize:13,fontWeight:500,color:l.shed?T.txt3:T.txt}}>{l.name}</p><p style={{margin:0,fontSize:10,color:T.txt3}}>{l.zone} · {l.shed?"0.00":l.draw.toFixed(2)} kW</p></div></div><div style={{display:"flex",gap:8}}>{l.protected&&<Bdg type="ok">Protected</Bdg>}{!l.protected&&<button onClick={()=>shedLoad(l.id)} style={{fontSize:11,padding:"3px 10px",borderRadius:6,border:"0.5px solid "+(l.shed?T.red+"66":T.border.split(" ")[2]),background:l.shed?T.redBg:"transparent",color:l.shed?T.red:T.txt2,cursor:"pointer"}}>{l.shed?"Restore":"Shed"}</button>}</div></div>
                <div style={{height:4,background:T.card3,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:barW+"%",background:l.shed?"#1e2d3d":l.protected?T.green:l.zone==="Deferrable"?T.amber:T.blue,borderRadius:2,transition:"width .4s",opacity:l.shed?0.3:1}}/></div>
              </div>
            );})}
            <div style={{display:"flex",gap:8,marginTop:4}}>
              <button onClick={()=>setLoads(ls=>ls.map(l=>l.zone==="Deferrable"&&!l.protected?{...l,shed:true}:l))} style={{padding:"6px 14px",borderRadius:8,background:T.amberBg,color:T.amber,border:"0.5px solid "+T.amber+"44",fontSize:12,cursor:"pointer",fontWeight:500}}>Shed Deferrable</button>
              <button onClick={()=>setLoads(ls=>ls.map(l=>({...l,shed:false})))} style={{padding:"6px 12px",borderRadius:8,background:T.card3,color:T.txt2,border:T.border,fontSize:12,cursor:"pointer"}}>Restore All</button>
              <button onClick={()=>setLoads(ls=>ls.map(l=>!l.protected?{...l,shed:true}:l))} style={{padding:"6px 12px",borderRadius:8,background:T.redBg,color:T.red,border:"0.5px solid "+T.red+"44",fontSize:12,cursor:"pointer",fontWeight:500}}>Grid-Down</button>
            </div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={CS}>
            <p style={{margin:"0 0 10px",fontSize:13,fontWeight:500,color:T.txt}}>NILM electrical alerts</p>
            {nimlAlerts.map(a=>(
              <div key={a.id} style={{background:T.card3,borderRadius:8,padding:"10px 12px",marginBottom:8,border:"0.5px solid "+(a.severity==="warn"?T.amber+"44":T.blue+"44")}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,fontWeight:500,color:T.txt}}>{a.device}</span><Bdg type={a.severity==="warn"?"warn":"info"}>{a.severity==="warn"?"⚠":"◉"}</Bdg></div><p style={{margin:0,fontSize:11,color:T.txt2}}>{a.alert}</p></div>
            ))}
          </div>
          <div style={CS}>
            <p style={{margin:"0 0 10px",fontSize:13,fontWeight:500,color:T.txt}}>PEMS mode</p>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {HOME_MODES.map(m=>(
                <button key={m.id} onClick={()=>setPemsMode(m.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,border:"0.5px solid "+(pemsMode===m.id?T.purpleBr:T.border.split(" ")[2]),background:pemsMode===m.id?T.purpleBg:T.card3,cursor:"pointer",textAlign:"left"}}>
                  <span style={{fontSize:16}}>{m.icon}</span><div><p style={{margin:0,fontSize:11,fontWeight:500,color:pemsMode===m.id?T.purple:T.txt}}>{m.label}</p><p style={{margin:0,fontSize:9,color:T.txt3}}>{m.desc}</p></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={CS}><p style={{margin:"0 0 12px",fontSize:13,fontWeight:500,color:T.txt}}>Energy Agent <span style={{fontSize:10,color:T.teal,fontWeight:400,marginLeft:6}}>PEMS AI</span></p><AIChat devices={devices} agents={agents} systemPrompt={energySys} placeholder="Ask about grid pricing, load shedding, pre-conditioning, NILM alerts…" initMsg={energyInit}/></div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App(){
  const [tab,setTab]=useState("Dashboard");
  const [devices,setDevices]=useState(INIT_DEVICES);
  const [agents,setAgents]=useState(INIT_AGENTS);
  const [autos,setAutos]=useState(INIT_AUTOS);
  const [props,setProps]=useState(PROPS_INIT);
  const [selCam,setSelCam]=useState(null);
  const [showEsc,setShowEsc]=useState(false);
  const togDev=id=>setDevices(ds=>ds.map(d=>d.id!==id?d:{...d,status:d.status==="locked"?"unlocked":d.status==="unlocked"?"locked":d.status==="closed"?"open":"closed"}));
  const togAg=id=>setAgents(as=>as.map(a=>a.id!==id?a:{...a,status:a.status==="active"?"paused":"active"}));
  const togAt=i=>setAutos(au=>au.map((a,j)=>j!==i?a:{...a,active:!a.active}));
  const addAuto=a=>setAutos(au=>[...au,{...a,active:true}]);
  const online=devices.filter(d=>["online","locked","closed"].includes(d.status)).length;
  const activeAg=agents.filter(a=>a.status==="active").length;
  const activeAt=autos.filter(a=>a.active).length;
  const hour=new Date().getHours();const isOnPeak=hour>=18&&hour<21;const isMidPeak=(hour>=6&&hour<9)||(hour>=15&&hour<18);
  const touLabel=isOnPeak?"On-Peak":isMidPeak?"Mid-Peak":"Off-Peak";const touCol=isOnPeak?T.red:isMidPeak?T.amber:T.green;

  return(
    <div style={{fontFamily:"system-ui,sans-serif",maxWidth:960,margin:"0 auto",padding:"0 0 48px",position:"relative",minHeight:700,background:T.bg}}>

      {showEsc&&(<div onClick={()=>setShowEsc(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.7)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:12}}><div onClick={e=>e.stopPropagation()} style={{background:T.card,borderRadius:16,padding:24,maxWidth:420,width:"90%",border:"2px solid #f87171"}}><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}><div style={{width:42,height:42,borderRadius:10,background:T.redBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🚨</div><div><p style={{margin:0,fontWeight:500,fontSize:16,color:T.txt}}>Threat Detected</p><p style={{margin:0,fontSize:12,color:T.red}}>Back Yard — Intruder Alert</p></div></div><p style={{fontSize:13,color:T.txt2,marginBottom:16,lineHeight:1.6}}>AI Perimeter Guard identified a person near the back fence. AI Deterrence deployed. Your response?</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>{[{lbl:"Lock Everything",col:T.purple,bg:T.purpleBg},{lbl:"Alert Authorities",col:T.red,bg:T.redBg},{lbl:"Sound Siren",col:T.amber,bg:T.amberBg},{lbl:"Call Emergency Contact",col:T.blue,bg:T.blueBg}].map(a=>(<button key={a.lbl} onClick={()=>setShowEsc(false)} style={{padding:"10px 12px",borderRadius:8,background:a.bg,color:a.col,border:"0.5px solid "+a.col+"44",fontSize:12,fontWeight:500,cursor:"pointer"}}>{a.lbl}</button>))}</div><button onClick={()=>setShowEsc(false)} style={{width:"100%",padding:8,borderRadius:8,border:T.border,background:"transparent",fontSize:13,cursor:"pointer",color:T.txt2}}>Dismiss — False alarm</button></div></div>)}

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 0 10px",borderBottom:T.border,marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:32,height:32,background:"#4c3db8",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#e0daff" strokeWidth={2.2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><div><p style={{margin:0,fontWeight:500,fontSize:16,color:T.txt}}>Aegis</p><p style={{margin:0,fontSize:11,color:T.txt2}}>Your Jarvis for Autonomous Energy & Guard Intelligence</p></div></div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:10,color:touCol,fontFamily:"monospace",background:T.card2,padding:"4px 8px",borderRadius:6,border:T.border}}>⚡ 2.84kW · {touLabel} · 14h UPS</span>
          <button onClick={()=>setShowEsc(true)} style={{padding:"5px 12px",borderRadius:8,background:T.redBg,color:T.red,border:"0.5px solid #f8717144",fontSize:12,cursor:"pointer",fontWeight:500}}>⚠ Simulate Alert</button>
          <Bdg type="ok">● All Systems Normal</Bdg>
        </div>
      </div>

      {/* Nav */}
      <div style={{display:"flex",gap:3,marginBottom:20,overflowX:"auto",paddingBottom:2}}>
        {NAV.map(n=>(<button key={n} onClick={()=>setTab(n)} style={{padding:"7px 12px",borderRadius:20,border:tab===n?"1.5px solid #8b7de8":T.border,background:tab===n?T.purpleBg:"transparent",color:tab===n?T.purple:n==="EnergyHub"?T.teal:n==="Digital Twin"?T.blue:T.txt2,fontSize:12,fontWeight:tab===n?500:400,cursor:"pointer",whiteSpace:"nowrap",transition:"all .15s"}}>
          {n==="EnergyHub"?"⚡ "+n:n==="Digital Twin"?"⬡ "+n:n}
        </button>))}
      </div>

      {/* DASHBOARD */}
      {tab==="Dashboard"&&(<div>
        <div style={{background:T.card3,border:T.border,borderRadius:10,padding:"9px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:T.txt3,fontFamily:"monospace"}}>PEMS STATUS</span>
          <span style={{fontSize:11,color:T.txt,fontFamily:"monospace"}}>Load: 2.84 kW  |  Mode: Off-Peak Optimization  |  Security Autonomy: 14.0h  |</span>
          <Bdg type={isOnPeak?"alert":isMidPeak?"warn":"ok"}>{touLabel} · ${isOnPeak?"0.32":isMidPeak?"0.16":"0.08"}/kWh</Bdg>
          <button onClick={()=>setTab("EnergyHub")} style={{marginLeft:"auto",fontSize:10,color:T.teal,background:"transparent",border:"none",cursor:"pointer"}}>Open EnergyHub ↗</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
          {[{label:"Devices online",val:online+"/"+devices.length,col:T.green},{label:"Active agents",val:activeAg+"/6",col:T.purple},{label:"Events today",val:"23",col:T.blue},{label:"Automations on",val:activeAt+"/"+autos.length,col:T.amber}].map(s=>(<div key={s.label} style={{background:T.card2,borderRadius:10,padding:"12px 14px",border:T.border}}><p style={{margin:0,fontSize:11,color:T.txt2,marginBottom:4}}>{s.label}</p><p style={{margin:0,fontSize:22,fontWeight:500,color:s.col}}>{s.val}</p></div>))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
          <div style={CS}><p style={{margin:"0 0 10px",fontSize:13,fontWeight:500,color:T.txt}}>Threat overview</p><div style={{display:"flex",alignItems:"center",gap:16}}><ThreatRing score={12}/><div><p style={{margin:"0 0 4px",fontSize:13,fontWeight:500,color:T.green}}>Low risk</p><p style={{margin:0,fontSize:12,color:T.txt2,lineHeight:1.5}}>All zones clear. 6 AI agents monitoring continuously.</p></div></div></div>
          <div style={CS}><p style={{margin:"0 0 10px",fontSize:13,fontWeight:500,color:T.txt}}>Quick controls</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{[{label:"Arm Away",icon:"🛡",col:T.purple,bg:T.purpleBg},{label:"Lock All",icon:"🔒",col:T.blue,bg:T.blueBg},{label:"Goodnight",icon:"🌙",col:T.green,bg:T.greenBg},{label:"EV Charge Now",icon:"⚡",col:T.teal,bg:T.tealBg}].map(q=>(<button key={q.label} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 10px",borderRadius:8,border:"0.5px solid "+q.col+"44",background:q.bg,color:q.col,fontSize:12,fontWeight:500,cursor:"pointer"}}><span style={{fontSize:14}}>{q.icon}</span>{q.label}</button>))}</div></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
          <div style={CS}><p style={{margin:"0 0 10px",fontSize:13,fontWeight:500,color:T.txt}}>Live cameras</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>{CAMERAS_DATA.slice(0,4).map(c=><CamFeed key={c.id} cam={c} onClick={()=>setTab("Cameras")}/>)}</div><button onClick={()=>setTab("Cameras")} style={{marginTop:10,width:"100%",padding:7,borderRadius:8,border:"0.5px solid "+T.purpleBr,background:T.purpleBg,color:T.purple,fontSize:12,cursor:"pointer"}}>View all cameras ↗</button></div>
          <div style={CS}><p style={{margin:"0 0 10px",fontSize:13,fontWeight:500,color:T.txt}}>Recent events</p>{EVENTS.map((e,i)=>(<div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"6px 0",borderBottom:i<EVENTS.length-1?T.borderB:"none"}}><div style={{width:6,height:6,borderRadius:"50%",background:e.type==="warn"?T.amber:e.type==="ok"?T.green:T.blue,marginTop:5,flexShrink:0}}/><p style={{margin:0,fontSize:12,flex:1,lineHeight:1.4,color:T.txt}}>{e.msg}</p><span style={{fontSize:10,color:T.txt3,whiteSpace:"nowrap"}}>{e.time}</span></div>))}</div>
        </div>
        <div style={CS}><p style={{margin:"0 0 12px",fontSize:13,fontWeight:500,color:T.txt}}>Aegis AI</p><AIChat devices={devices} agents={agents}/></div>
      </div>)}

      {/* CAMERAS */}
      {tab==="Cameras"&&(<div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}><div><p style={{margin:"0 0 4px",fontSize:15,fontWeight:500,color:T.txt}}>Live feeds</p><p style={{margin:"0 0 14px",fontSize:13,color:T.txt2}}>{CAMERAS_DATA.filter(c=>c.alert).length} alert · AI detection running</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{CAMERAS_DATA.map(c=><CamFeed key={c.id} cam={c} selected={selCam===c.id} onClick={()=>setSelCam(selCam===c.id?null:c.id)}/>)}</div>{selCam&&(()=>{const c=CAMERAS_DATA.find(x=>x.id===selCam);return c?(<div style={{...CS,marginTop:12}}><p style={{margin:"0 0 8px",fontSize:13,fontWeight:500,color:T.txt}}>{c.name} — AI analysis</p><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{c.dets.length>0?c.dets.map((d,i)=><Bdg key={i} type={d.t==="person"?"alert":d.t==="vehicle"?"info":"warn"}>{d.lbl}</Bdg>):<Bdg type="ok">Clear</Bdg>}<Bdg type="info">{c.zone}</Bdg></div></div>):null;})()}</div><div><p style={{margin:"0 0 14px",fontSize:15,fontWeight:500,color:T.txt}}>Event clips</p><div style={{display:"flex",flexDirection:"column",gap:8}}>{CLIPS.map(c=>(<div key={c.id} style={CS}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><Bdg type={c.type}>{c.type==="warn"?"⚠ Alert":c.type==="ok"?"✓ Known":"◉ Event"}</Bdg><span style={{fontSize:11,color:T.txt2}}>{c.time}</span></div><p style={{margin:"4px 0 2px",fontSize:13,fontWeight:500,color:T.txt}}>{c.label}</p><p style={{margin:0,fontSize:11,color:T.txt2}}>{c.cam} · {c.dur}</p></div>))}</div></div></div>)}

      {/* DEVICES */}
      {tab==="Devices"&&(<div style={CS}><p style={{margin:"0 0 4px",fontSize:15,fontWeight:500,color:T.txt}}>All devices</p><p style={{margin:"0 0 14px",fontSize:13,color:T.txt2}}>{online} of {devices.length} online</p>{["Entry","Perimeter","Garage","Interior"].map(zone=>(<div key={zone} style={{marginBottom:16}}><p style={{margin:"0 0 6px",fontSize:11,fontWeight:500,color:T.txt3,textTransform:"uppercase",letterSpacing:.5}}>{zone}</p>{devices.filter(d=>d.zone===zone).map(d=>(<div key={d.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:T.borderB}}><span style={{fontSize:20}}>{d.icon}</span><div style={{flex:1}}><p style={{margin:0,fontSize:14,fontWeight:500,color:T.txt}}>{d.name}</p><p style={{margin:0,fontSize:12,color:T.txt2}}>{d.zone}</p></div>{d.alert&&<Bdg type="warn">Motion</Bdg>}<span style={{fontSize:12,color:["online","locked","closed"].includes(d.status)?T.green:T.amber,fontWeight:500}}>{d.status}</span>{(d.type==="lock"||d.type==="door")&&<button onClick={()=>togDev(d.id)} style={{fontSize:12,padding:"4px 10px",borderRadius:6,border:T.border,background:"transparent",cursor:"pointer",color:T.txt2}}>{d.status==="locked"||d.status==="closed"?"Unlock":"Lock"}</button>}</div>))}</div>))}</div>)}

      {/* AGENTS */}
      {tab==="Agents"&&(<div><p style={{margin:"0 0 16px",fontSize:15,fontWeight:500,color:T.txt}}>AI agents</p><div style={{display:"flex",flexDirection:"column",gap:10}}>{agents.map(a=>(<div key={a.id} style={{...CS,display:"flex",gap:12,alignItems:"flex-start"}}><div style={{width:10,height:10,borderRadius:"50%",background:a.status==="active"?T.green:"#2a3a4a",marginTop:6,flexShrink:0,boxShadow:a.status==="active"?"0 0 6px "+T.green:"none"}}/><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><p style={{margin:0,fontSize:14,fontWeight:500,color:T.txt}}>{a.name}</p><span style={{fontSize:11,color:T.txt3}}>{a.triggers} triggers · {a.last}</span></div><p style={{margin:0,fontSize:12,color:T.txt2,lineHeight:1.5}}>{a.desc}</p></div><button onClick={()=>togAg(a.id)} style={{fontSize:12,padding:"4px 12px",borderRadius:6,border:T.border,background:a.status==="active"?T.greenBg:"transparent",color:a.status==="active"?T.green:T.txt2,cursor:"pointer",flexShrink:0}}>{a.status==="active"?"Active":"Paused"}</button></div>))}</div></div>)}

      {/* AUTOMATIONS */}
      {tab==="Automations"&&(<div><p style={{margin:"0 0 16px",fontSize:15,fontWeight:500,color:T.txt}}>Automations</p><NLBuilder onAdd={addAuto}/><div style={{display:"flex",flexDirection:"column",gap:8}}>{autos.map((a,i)=>(<div key={i} style={{...CS,display:"flex",gap:12,alignItems:"flex-start"}}><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><p style={{margin:0,fontSize:14,fontWeight:500,color:T.txt}}>{a.name}</p>{a.active&&<Bdg type="ok">On</Bdg>}</div><p style={{margin:0,fontSize:12,color:T.txt2}}>Trigger: {a.trigger}</p><p style={{margin:"4px 0 0",fontSize:12,color:T.txt2}}>{a.actions}</p></div><Tgl on={a.active} toggle={()=>togAt(i)}/></div>))}</div></div>)}

      {/* PROPERTIES */}
      {tab==="Properties"&&(<div><p style={{margin:"0 0 16px",fontSize:15,fontWeight:500,color:T.txt}}>Properties</p><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>{props.map((p,i)=>(<div key={p.id} onClick={()=>setProps(ps=>ps.map((x,j)=>({...x,current:j===i})))} style={{...CS,border:p.current?"1.5px solid #8b7de8":T.border,cursor:"pointer"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:28}}>{p.icon}</span>{p.current&&<Bdg type="purple">Active</Bdg>}</div><p style={{margin:"0 0 2px",fontSize:14,fontWeight:500,color:T.txt}}>{p.name}</p><p style={{margin:"0 0 12px",fontSize:12,color:T.txt2}}>{p.addr}</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}><div style={{background:T.card3,borderRadius:8,padding:"8px 10px",border:T.border}}><p style={{margin:0,fontSize:10,color:T.txt2}}>Threat</p><p style={{margin:0,fontSize:16,fontWeight:500,color:p.threat<30?T.green:p.threat<60?T.amber:T.red}}>{p.threat}</p></div><div style={{background:T.card3,borderRadius:8,padding:"8px 10px",border:T.border}}><p style={{margin:0,fontSize:10,color:T.txt2}}>Devices</p><p style={{margin:0,fontSize:16,fontWeight:500,color:T.txt}}>{p.devices}</p></div></div><div style={{display:"flex",gap:6,alignItems:"center"}}><div style={{width:7,height:7,borderRadius:"50%",background:p.armed?T.green:"#2a3a4a"}}/><span style={{fontSize:11,color:T.txt2}}>{p.armed?"Armed":"Disarmed"}</span>{p.alerts>0&&<Bdg type="warn">{p.alerts} alert{p.alerts>1?"s":""}</Bdg>}</div></div>))}</div></div>)}

      {tab==="EnergyHub"&&<EnergyHub devices={devices} agents={agents}/>}
      {tab==="Digital Twin"&&<DigitalTwin devices={devices} agents={agents}/>}

      {/* ANALYTICS */}
      {tab==="Analytics"&&(<div><p style={{margin:"0 0 16px",fontSize:15,fontWeight:500,color:T.txt}}>Analytics & insights</p><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>{[{label:"Events this week",val:"147",delta:"+12%"},{label:"False positives filtered",val:"89%",delta:"AI suppressed"},{label:"Energy saved",val:"38 kWh",delta:"-$9.20"},{label:"Peak demand avoided",val:"1.8 kW",delta:"$14.40 saved"}].map(s=>(<div key={s.label} style={{background:T.card2,borderRadius:10,padding:"14px",border:T.border}}><p style={{margin:"0 0 4px",fontSize:11,color:T.txt2}}>{s.label}</p><p style={{margin:"0 0 6px",fontSize:22,fontWeight:500,color:T.txt}}>{s.val}</p><Bdg type="ok">{s.delta}</Bdg></div>))}</div><div style={{...CS,marginBottom:12}}><p style={{margin:"0 0 10px",fontSize:13,fontWeight:500,color:T.txt}}>Weekly activity heatmap</p><div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day,di)=>(<div key={day}><p style={{margin:"0 0 4px",fontSize:10,textAlign:"center",color:T.txt3}}>{day}</p>{HMAP[di].map((val,hi)=><div key={hi} style={{height:14,borderRadius:3,marginBottom:2,background:"rgba(139,125,232,"+(val/10)+")"}}/>)}</div>))}</div></div><div style={CS}><p style={{margin:"0 0 10px",fontSize:13,fontWeight:500,color:T.txt}}>AI weekly summary</p><p style={{margin:0,fontSize:13,color:T.txt2,lineHeight:1.7}}>147 security events this week, down 8%. AI agents filtered 89% of false positives. PEMS avoided 1.8 kW of peak demand ($14.40 savings). Digital Twin energy layer identified Living Room and Home Office as the top optimization targets — combined 132W potential reduction. NILM flagged refrigerator compressor anomaly with 23% thermal risk in 14 days if unresolved.</p></div></div>)}

      {/* SETTINGS */}
      {tab==="Settings"&&(<div><p style={{margin:"0 0 14px",fontSize:15,fontWeight:500,color:T.txt}}>Platform settings</p><div style={{display:"flex",flexDirection:"column",gap:8}}>{[{label:"Property name",type:"input",val:"Great Falls Residence"},{label:"Emergency contacts",type:"text",val:"Emma · Alex"},{label:"Monitoring center",type:"badge",val:"Connected — Aegis Professional"},{label:"AI sensitivity",type:"select",val:"Balanced",opts:["Low","Balanced","High","Maximum"]},{label:"Threat escalation threshold",type:"range",val:60},{label:"PEMS persona",type:"select",val:"Residential",opts:["Residential","Business","Enterprise"]},{label:"TOU utility provider",type:"text",val:"Dominion Energy (Great Falls)"},{label:"Multi-property sync",type:"toggle",val:true},{label:"Agent auto-learning",type:"toggle",val:true},{label:"NILM signature monitoring",type:"toggle",val:true},{label:"Digital Twin energy overlay",type:"toggle",val:true}].map(s=>(<div key={s.label} style={{...CS,display:"flex",justifyContent:"space-between",alignItems:"center",gap:16}}><p style={{margin:0,fontSize:13,fontWeight:500,flexShrink:0,color:T.txt}}>{s.label}</p>{s.type==="input"&&<input defaultValue={s.val} style={{fontSize:13,padding:"4px 8px",borderRadius:6,border:T.border,width:200,textAlign:"right",background:T.card3,color:T.txt,outline:"none"}}/>}{s.type==="text"&&<p style={{margin:0,fontSize:13,color:T.txt2,textAlign:"right"}}>{s.val}</p>}{s.type==="badge"&&<Bdg type="ok">{s.val}</Bdg>}{s.type==="select"&&<select defaultValue={s.val} style={{fontSize:13,padding:"4px 8px",borderRadius:6,border:T.border,background:T.card3,color:T.txt,outline:"none"}}>{s.opts.map(o=><option key={o}>{o}</option>)}</select>}{s.type==="range"&&<div style={{display:"flex",alignItems:"center",gap:8}}><input type="range" min={20} max={90} defaultValue={s.val} style={{width:100}}/><span style={{fontSize:12,color:T.txt2}}>{s.val}/100</span></div>}{s.type==="toggle"&&<Tgl on={s.val} toggle={()=>{}}/>}</div>))}</div></div>)}
    </div>
  );
}
