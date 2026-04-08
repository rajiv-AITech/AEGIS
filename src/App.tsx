import React, { useState, useEffect, useRef } from 'react';
import SpIntelligence from '@/components/v2/SpIntelligence';
import ArrMetrics from '@/components/v2/ArrMetrics';
import CommercialAI from '@/components/v2/CommercialAI';
import DomainOntology from '@/components/v2/DomainOntology';
import EvGrid from '@/components/v2/EvGrid';
import { useV2Store } from '@/store/useV2Store';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
type TabId =
  | 'dashboard' | 'cameras' | 'agents' | 'energyhub'
  | 'sp' | 'arr' | 'commercial' | 'ontology' | 'digital' | 'analytics';

interface NavItem { id: TabId; label: string; icon: string; badge?: string; v2?: boolean }

const NAV: NavItem[] = [
  { id: 'dashboard',  label: 'Dashboard',         icon: '*' },
  { id: 'cameras',    label: 'Cameras',            icon: 'o' },
  { id: 'agents',     label: 'AI Agents',          icon: 'H', badge: '6 Active' },
  { id: 'energyhub',  label: 'EnergyHub',          icon: 'O', badge: 'EV', v2: true },
  { id: 'sp',         label: 'SP Intelligence',    icon: 'H', badge: 'NEW', v2: true },
  { id: 'arr',        label: 'AI Resolution',      icon: '*', badge: 'NEW', v2: true },
  { id: 'commercial', label: 'Commercial AI',      icon: '#', badge: 'NEW', v2: true },
  { id: 'ontology',   label: 'Domain Ontology',    icon: 'H', badge: 'NEW', v2: true },
  { id: 'digital',    label: 'Digital Twin',       icon: 'H' },
  { id: 'analytics',  label: 'Analytics',          icon: '*' },
];

// -----------------------------------------------------------------------------
// Inline styles helpers
// -----------------------------------------------------------------------------
const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: 'var(--bg2)', border: '1px solid var(--border)',
  borderRadius: 10, padding: 16, ...extra,
});

const statCard = (): React.CSSProperties => ({
  background: 'var(--bg2)', border: '1px solid var(--border)',
  borderRadius: 10, padding: '14px 16px', position: 'relative', overflow: 'hidden',
});

// -----------------------------------------------------------------------------
// Lightweight live-feed hook
// -----------------------------------------------------------------------------
const FEED_ITEMS = [
  { c: '#10b981', t: 'AI Deterrence resolved perimeter motion -- Great Falls, VA (confidence: 94%)' },
  { c: '#f59e0b', t: 'EnergyHub: demand response signal from Dominion -- load shed initiated' },
  { c: '#3b82f6', t: 'SP Guardian Security: 48,210 subscribers synced -- ARR 93.1%' },
  { c: '#10b981', t: 'RVM auto-resolved: delivery vehicle identified at 94 SPs -- no dispatch' },
  { c: '#ef4444', t: 'Commercial alert: unknown badge attempt -- Executive Floor, AI Deterrence active' },
  { c: '#8b5cf6', t: 'Ontology update: 847 property-type nodes refreshed from nightly training run' },
  { c: '#14b8a6', t: 'EV charging optimized: Blazer EV -> target 90% by 06:00 at $0.08/kWh' },
  { c: '#10b981', t: 'False alarm suppressed: cat motion, Perimeter Zone 3 -- AI classification 97%' },
];

function useLiveFeed() {
  const [feed, setFeed] = useState<typeof FEED_ITEMS>([]);
  const idx = useRef(0);
  useEffect(() => {
    const tick = () => {
      setFeed(f => [FEED_ITEMS[idx.current % FEED_ITEMS.length], ...f].slice(0, 7));
      idx.current++;
    };
    tick();
    const id = setInterval(tick, 3200);
    return () => clearInterval(id);
  }, []);
  return feed;
}

// -----------------------------------------------------------------------------
// Camera canvas component
// -----------------------------------------------------------------------------
function CameraCanvas({ idx, label, status }: { idx: number; label: string; status: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = ['#0d2035', '#1a1500', '#1a0d0d'];
  const boxColors = ['#10b981', '#f59e0b', '#ef4444'];
  const tags = ['Person 94%', 'Vehicle 87%', 'Motion 91%'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number;
    let lastDraw = 0;

    function draw(ts: number) {
      if (ts - lastDraw > 900) {
        lastDraw = ts;
        ctx!.fillStyle = colors[idx];
        ctx!.fillRect(0, 0, 280, 158);
        ctx!.strokeStyle = boxColors[idx];
        ctx!.lineWidth = 1.5;
        const x = 40 + Math.random() * 100, y = 30 + Math.random() * 60;
        const w = 60 + Math.random() * 40, h = 50 + Math.random() * 30;
        ctx!.strokeRect(x, y, w, h);
        ctx!.fillStyle = boxColors[idx];
        ctx!.font = '9px monospace';
        ctx!.fillText(tags[idx], x, y - 4);
        ctx!.strokeStyle = 'rgba(255,255,255,0.04)';
        for (let k = 0; k < 8; k++) {
          ctx!.strokeRect(Math.random()*240, Math.random()*120, 20+Math.random()*30, 15+Math.random()*25);
        }
      }
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [idx]);

  const statusColors: Record<string, string> = { Normal: '#10b981', Watching: '#f59e0b', Alert: '#ef4444' };

  return (
    <div style={{ background: 'var(--bg3)', border: `1px solid ${statusColors[status] ?? 'var(--border)'}40`, borderRadius: 8, overflow: 'hidden' }}>
      <canvas ref={canvasRef} width={280} height={158} style={{ width: '100%', display: 'block' }} />
      <div style={{ padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--text2)' }}>{label}</span>
        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: `${statusColors[status]}20`, color: statusColors[status] }}>{status}</span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Agent card
// -----------------------------------------------------------------------------
const AGENTS = [
  { name: 'AI Deterrence Agent', status: 'Active', c: '#10b981', triggers: 847, arr: '91.2%', last: '2 min ago',
    desc: 'Delivers adaptive verbal warnings with context-aware tone and gender. Integrates AID and OpenEye for full situational awareness before engagement.' },
  { name: 'Remote Video Monitor', status: 'Active', c: '#10b981', triggers: 1204, arr: '88.7%', last: '4 min ago',
    desc: '24/7 AI video review. Flags high-confidence events, suppresses false positives. CHeKT integration enables central station RVM workflows.' },
  { name: 'Energy Optimizer (PEMS)', status: 'Active', c: '#14b8a6', triggers: 2000, arr: '96.1%', last: '1 min ago',
    desc: 'Grid-interactive load management with NILM anomaly detection, TOU optimization, and EV scheduling. Security Mesh always protected.' },
  { name: 'Smart Access Controller', status: 'Active', c: '#3b82f6', triggers: 4102, arr: '79.8%', last: '11 min ago',
    desc: 'Shift-aware behavioral baseline for commercial access control. Cross-zone anomaly detection. Unusual entry pattern alerts.' },
  { name: 'Perimeter Guard', status: 'Active', c: '#10b981', triggers: 2341, arr: '84.3%', last: '8 min ago',
    desc: 'Monitors all outdoor sensors 24/7. Auto-escalates on motion with confidence scoring. Hands off to AI Deterrence when appropriate.' },
  { name: 'Wellness Aegis', status: 'Paused', c: 'var(--text3)', triggers: 0, arr: 'N/A', last: '--',
    desc: 'Tracks occupancy patterns and alerts trusted contacts on unusual inactivity. Paused pending ISO 42001 privacy framework review.' },
];

// -----------------------------------------------------------------------------
// Root App
// -----------------------------------------------------------------------------
export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [clock, setClock] = useState('');
  const [mode, setMode] = useState<'residential' | 'commercial'>('residential');
  const feed = useLiveFeed();
  const { arrMetrics } = useV2Store();

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // -- Shared layout styles --------------------------------------------------
  const layoutStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateRows: '56px 1fr',
    gridTemplateColumns: '220px 1fr',
    height: '100vh',
    overflow: 'hidden',
  };

  const topbarStyle: React.CSSProperties = {
    gridColumn: '1/-1',
    background: 'var(--bg2)',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    gap: 16,
    zIndex: 100,
  };

  const sidebarStyle: React.CSSProperties = {
    background: 'var(--bg2)',
    borderRight: '1px solid var(--border)',
    overflowY: 'auto',
    padding: '16px 0',
  };

  const contentStyle: React.CSSProperties = {
    overflowY: 'auto',
    background: 'var(--bg)',
    padding: 24,
  };

  // -- Render helpers --------------------------------------------------------
  function HBar({ value, color }: { value: number; color: string }) {
    return (
      <div style={{ height: 6, background: 'var(--bg4)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 3 }} />
      </div>
    );
  }

  function PageHead({ title, sub, v2 }: { title: string; sub: string; v2?: boolean }) {
    return (
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: -0.3, display: 'flex', alignItems: 'center', gap: 8 }}>
          {title}
          {v2 && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)', fontFamily: "'DM Mono', monospace", verticalAlign: 'middle' }}>v2</span>}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>{sub}</div>
      </div>
    );
  }

  // -- Tab content -----------------------------------------------------------
  function renderContent() {
    switch (activeTab) {

      case 'dashboard': return (
        <div>
          <PageHead title="Intelligence Dashboard" sub="Unified view across Security  .  Energy  .  Commercial  .  Partner Network" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { n: '9.3M', l: 'Connected Subscribers', sub: '^ 8.2% YoY', c: '#3b82f6' },
              { n: `${(arrMetrics.resolutionRate*100).toFixed(1)}%`, l: 'AI Resolution Rate', sub: '^ 12pts vs human-only', c: '#10b981' },
              { n: '1.6M', l: 'Grid-Edge Devices', sub: '44 GWh shifted 2024', c: '#f59e0b' },
              { n: '10,247', l: 'Active Service Providers', sub: '94 AI-tier partners', c: '#8b5cf6' },
            ].map((s, i) => (
              <div key={i} style={{ ...statCard() }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: 2, background: s.c }} />
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>{s.n}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{s.l}</div>
                <div style={{ fontSize: 11, color: '#10b981', marginTop: 6 }}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div style={card()}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
                Live Intelligence Feed
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>Real-time</span>
              </div>
              {feed.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.c, flexShrink: 0, marginTop: 5 }} />
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.4 }}>{item.t}</div>
                </div>
              ))}
            </div>
            <div style={card()}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 14 }}>Platform Growth Vectors</div>
              {[
                { l: 'Commercial SaaS', v: '$80M+ ^25%', pct: 78, c: '#10b981' },
                { l: 'EnergyHub SaaS', v: '$50M+ ^35%', pct: 62, c: '#14b8a6' },
                { l: 'International Revenue', v: '6% -> 10% target', pct: 38, c: '#8b5cf6' },
                { l: 'AI Resolution Rate', v: '87.4% target: 95%', pct: 87, c: '#3b82f6' },
              ].map((row, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text2)', marginBottom: 5 }}>
                    <span>{row.l}</span><span style={{ color: 'var(--text)', fontWeight: 500 }}>{row.v}</span>
                  </div>
                  <HBar value={row.pct} color={row.c} />
                </div>
              ))}
              <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>AI Platform Intelligence Layer -- the compounding moat that unifies all four growth vectors into a single data flywheel.</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {[
              { title: 'SP Intelligence', tag: 'NEW v2', tagC: '#60a5fa', n: '94', sub: 'AI-Tier Partners Active', desc: 'Fleet-wide AI resolution metrics -- click to explore.', tab: 'sp' as TabId, tc: '#3b82f6' },
              { title: 'AI Resolution', tag: 'NEW v2', tagC: '#34d399', n: '87.4%', sub: 'Events Auto-Resolved', desc: 'Outcome-based pricing unlocked -- click to explore.', tab: 'arr' as TabId, tc: '#10b981' },
              { title: 'Commercial AI', tag: 'NEW v2', tagC: '#fcd34d', n: '$80M+', sub: 'Commercial SaaS 2024', desc: '~25% YoY growth, fastest segment -- click to explore.', tab: 'commercial' as TabId, tc: '#f59e0b' },
              { title: 'Domain Ontology', tag: 'NEW v2', tagC: '#a78bfa', n: '847', sub: 'Property-Type Nodes', desc: 'Shared knowledge graph -- click to explore.', tab: 'ontology' as TabId, tc: '#8b5cf6' },
            ].map((c, i) => (
              <div key={i} onClick={() => setActiveTab(c.tab)} style={{ ...card({ cursor: 'pointer', borderColor: `${c.tc}30`, transition: 'border-color .2s' }) }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = c.tc)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = `${c.tc}30`)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--text3)' }}>{c.title}</div>
                  <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: `${c.tagC}20`, color: c.tagC }}>{c.tag}</span>
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 700, color: 'var(--text)' }}>{c.n}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>{c.sub}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      );

      case 'cameras': return (
        <div>
          <PageHead title="Camera Intelligence" sub="AI bounding box detection  .  Natural language video search  .  RVM integration" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            <CameraCanvas idx={0} label="Front Door  .  4K" status="Normal" />
            <CameraCanvas idx={1} label="Garage  .  AI Active" status="Watching" />
            <CameraCanvas idx={2} label="Perimeter  .  Alert" status="Alert" />
          </div>
        </div>
      );

      case 'agents': return (
        <div>
          <PageHead title="AI Agent Hub" sub="6 autonomous agents -- unified AI workforce across security, energy, and access" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {AGENTS.map((ag, i) => (
              <div key={i} style={{ ...card({ borderColor: `${ag.c}30` }) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  {ag.status === 'Active' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: ag.c, animation: 'blink 2s infinite' }} />}
                  {ag.status === 'Paused' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text3)' }} />}
                  <div style={{ fontSize: 14, fontWeight: 600, color: ag.status === 'Paused' ? 'var(--text2)' : 'var(--text)' }}>{ag.name}</div>
                  <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: ag.status === 'Active' ? `${ag.c}15` : 'rgba(255,255,255,0.05)', color: ag.status === 'Active' ? ag.c : 'var(--text3)' }}>
                    {ag.status}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: ag.status === 'Paused' ? 'var(--text3)' : 'var(--text2)', lineHeight: 1.5, marginBottom: 8 }}>{ag.desc}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--text3)' }}>
                  Triggers: {ag.triggers.toLocaleString()}  .  ARR: {ag.arr}  .  Last: {ag.last}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      case 'energyhub':   return <div><PageHead title="EnergyHub + EV Grid Intelligence" sub="$50M+ SaaS  .  1.6M grid-edge devices  .  GM EV partnership" v2 /><EvGrid /></div>;
      case 'sp':          return <div><PageHead title="Service Provider Intelligence" sub="Fleet-wide AI performance metrics for 10,247 active partners" v2 /><SpIntelligence /></div>;
      case 'arr':         return <div><PageHead title="AI Resolution Rate (ARR) Metrics" sub="Outcome-based pricing proof point -- from monitoring events to autonomous resolutions" v2 /><ArrMetrics /></div>;
      case 'commercial':  return <div><PageHead title="Commercial Property Intelligence" sub="AI-native operations for commercial -- $80M+ SaaS, fastest growing at ~25% YoY" v2 /><CommercialAI /></div>;
      case 'ontology':    return <div><PageHead title="Domain Intelligence Ontology" sub="The shared knowledge graph unifying AID  .  EnergyHub  .  OpenEye  .  CHeKT" v2 /><DomainOntology /></div>;

      case 'digital': return (
        <div>
          <PageHead title="3D Digital Twin" sub="Live Three.js property rendering -- Security / Energy / Combined view modes" />
          <div style={{ ...card({ textAlign: 'center', padding: '60px 24px' }) }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>H</div>
            <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 8 }}>3D Digital Twin -- Full implementation in Aegis v1</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 20, lineHeight: 1.6 }}>
              Three.js r128  .  Orthographic camera  .  Security + Energy + Combined modes<br />
              Drag-to-rotate  .  Camera FoV cones  .  Motion heatmap zones  .  Light zone efficiency halos<br />
              Reactive energy layer: React state -> useRef -> Three.js animation loop (no remount)
            </div>
            <a href="https://aegis-five-theta.vercel.app" target="_blank" rel="noreferrer" style={{ display: 'inline-block', padding: '8px 20px', background: 'var(--accent)', color: 'white', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              Open Live v1 Demo ->
            </a>
          </div>
        </div>
      );

      case 'analytics': return (
        <div>
          <PageHead title="Platform Analytics" sub="Cross-property intelligence  .  AI performance trends  .  Business metrics" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { n: '$631M', l: 'SaaS Revenue 2024', sub: '^ 10.9% YoY', c: '#3b82f6' },
              { n: '87.4%', l: 'Platform ARR', sub: 'Target: 95% Q4 2025', c: '#10b981' },
              { n: '$122.5M', l: 'GAAP Net Income 2024', sub: '^ 53% from $80.3M', c: '#f59e0b' },
              { n: '$176M', l: 'Adj. EBITDA 2024', sub: 'Strong operational leverage', c: '#8b5cf6' },
            ].map((s, i) => (
              <div key={i} style={{ ...statCard() }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: 2, background: s.c }} />
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>{s.n}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{s.l}</div>
                <div style={{ fontSize: 11, color: s.c, marginTop: 5 }}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div style={card()}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 14 }}>AI Platform ROI Model -- The Business Case</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
              {[
                { n: '$340M', l: 'ARR Improvement Value', sub: 'Addressable outcome premium at current scale, $4/resolved event', c: '#34d399' },
                { n: '$71M', l: 'SP AI-Tier Pipeline', sub: 'Incremental ARR if 2,847 standard SPs upgrade', c: '#fcd34d' },
                { n: '10x', l: 'Data Flywheel Moat', sub: 'Model accuracy advantage from 9.3M-subscriber unified ontology', c: '#a78bfa' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'var(--bg3)', borderRadius: 8, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 30, fontWeight: 800, color: s.c, letterSpacing: -1 }}>{s.n}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4, fontWeight: 500 }}>{s.l}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

      default: return null;
    }
  }

  // -- Render ----------------------------------------------------------------
  return (
    <>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes slideIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        a { color: inherit; }
      `}</style>

      <div style={layoutStyle}>
        {/* TOPBAR */}
        <div style={topbarStyle}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: -0.5, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M13 2L22.5 7.5V18.5L13 24L3.5 18.5V7.5L13 2Z" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="1"/>
              <path d="M13 7L18 10V16L13 19L8 16V10L13 7Z" fill="#3b82f6" opacity="0.6"/>
              <circle cx="13" cy="13" r="2" fill="#60a5fa"/>
            </svg>
            Aegis
            <span style={{ fontSize: 11, fontWeight: 600, background: 'var(--accent)', color: 'white', padding: '2px 6px', borderRadius: 4, letterSpacing: 0.5, fontFamily: "'DM Mono', monospace" }}>v2</span>
          </div>

          <div style={{ display: 'flex', gap: 6, marginLeft: 16 }}>
            <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}>
              Autonomous Property Intelligence
            </span>
          </div>

          <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'blink 2s infinite' }} />
              <span style={{ color: 'var(--green)' }}>LIVE</span>
            </div>
            {(['residential', 'commercial'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                padding: '4px 10px', border: '1px solid', borderRadius: 20, cursor: 'pointer',
                fontSize: 11, fontWeight: 500, background: 'transparent', textTransform: 'capitalize',
                borderColor: mode === m ? 'var(--accent)' : 'var(--border2)',
                color: mode === m ? 'var(--accent2)' : 'var(--text2)',
              }}>{m}</button>
            ))}
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--text3)', marginLeft: 8 }}>{clock}</span>
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={sidebarStyle}>
          {[
            { sectionLabel: 'Core Platform', items: NAV.filter(n => !n.v2) },
            { sectionLabel: 'Aegis v2 -- New', items: NAV.filter(n => n.v2) },
          ].map(({ sectionLabel, items }) => (
            <div key={sectionLabel} style={{ padding: '0 12px', marginBottom: 4 }}>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--text3)', padding: '8px 8px 4px' }}>{sectionLabel}</div>
              {items.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <div key={item.id} onClick={() => setActiveTab(item.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 9, padding: '7px 8px',
                    borderRadius: 7, cursor: 'pointer', fontSize: 12.5, marginBottom: 1,
                    background: isActive ? 'rgba(59,130,246,0.12)' : 'transparent',
                    color: isActive ? 'var(--accent2)' : 'var(--text2)',
                    position: 'relative', transition: 'all .15s',
                  }}>
                    {isActive && <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 2, height: '60%', background: 'var(--accent)', borderRadius: '0 2px 2px 0' }} />}
                    <span style={{ fontSize: 14, width: 16, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                    {item.label}
                    {item.badge && (
                      <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 10, background: item.badge === 'NEW' ? 'rgba(59,130,246,0.2)' : 'rgba(239,68,68,0.2)', color: item.badge === 'NEW' ? 'var(--accent2)' : 'var(--red2)', border: `1px solid ${item.badge === 'NEW' ? 'rgba(59,130,246,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Health panel */}
          <div style={{ padding: '14px 20px', marginTop: 8, borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>Platform Health</div>
            {[
              { l: 'Intelligence Layer', v: 'Active', c: 'var(--green)' },
              { l: 'Domain Ontology', v: 'Synced', c: 'var(--green)' },
              { l: 'PEMS Mode', v: 'Off-Peak', c: 'var(--amber)' },
              { l: 'Partner API', v: 'Healthy', c: 'var(--green)' },
            ].map((row, i) => (
              <div key={i} style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                <span>{row.l}</span>
                <span style={{ color: row.c }}>{row.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div style={contentStyle} key={activeTab}>
          <div style={{ animation: 'slideIn .2s ease' }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}
