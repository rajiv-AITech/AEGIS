import React, { useEffect, useRef } from 'react';
import { useV2Store } from '@/store/useV2Store';
import type { EvDevice, GridEvent } from '@/types';

const TOU_WINDOWS = [
  { label: 'OFF-PEAK', hours: '9PM-6AM', rate: 0.08, pct: 38, color: '#10b981' },
  { label: 'MID-PEAK', hours: '6-9AM', rate: 0.16, pct: 13, color: '#f59e0b' },
  { label: 'OFF-PEAK', hours: '9AM-3PM', rate: 0.08, pct: 25, color: '#10b981' },
  { label: 'MID-PEAK', hours: '3-6PM', rate: 0.16, pct: 12, color: '#f59e0b' },
  { label: 'ON-PEAK', hours: '6-9PM', rate: 0.32, pct: 12, color: '#ef4444' },
];

const GRID_SEED: GridEvent[] = [
  { id: 'g1', timestamp: new Date(), type: 'demand-response',
    message: 'Dominion Energy DR call 18:00-21:00. EV charging paused. HVAC setback 2degF. Expected savings: $3.40', savingsUsd: 3.4 },
  { id: 'g2', timestamp: new Date(Date.now() - 3600000), type: 'off-peak',
    message: '21:00 - now. EV charging resumed at 6.2 kW. Rate: $0.08/kWh. Optimal window for full charge by 06:00.' },
  { id: 'g3', timestamp: new Date(Date.now() - 7200000), type: 'nilm-alert',
    message: 'HVAC electrical signature anomaly detected 14:32. Pattern deviation 23% above baseline. Maintenance recommended.' },
];

const EVENT_COLORS: Record<string, string> = {
  'demand-response': '#3b82f6',
  'off-peak': '#10b981',
  'nilm-alert': '#f59e0b',
  'peak-warning': '#ef4444',
};

const EVENT_LABELS: Record<string, string> = {
  'demand-response': 'Demand Response',
  'off-peak': 'Off-Peak Window',
  'nilm-alert': 'NILM Alert',
  'peak-warning': 'Peak Warning',
};

function SocBar({ pct, color = '#10b981' }: { pct: number; color?: string }) {
  return (
    <div style={{ height: 6, background: 'var(--bg4)', borderRadius: 3, marginTop: 6, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 1.5s ease' }} />
    </div>
  );
}

export default function EvGrid() {
  const { evDevices, gridEvents, addGridEvent, updateEvSoc } = useV2Store();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Seed grid events if empty and simulate slow EV charge
  useEffect(() => {
    if (gridEvents.length === 0) {
      GRID_SEED.forEach(e => addGridEvent(e));
    }
    intervalRef.current = setInterval(() => {
      // Tick EV SOC upward by tiny amount to show live charging
      evDevices.forEach(ev => {
        if (ev.status === 'charging' && ev.stateOfCharge < ev.targetSoc) {
          updateEvSoc(ev.id, Math.min(ev.stateOfCharge + 0.1, ev.targetSoc));
        }
      });
    }, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const allEvents = [...GRID_SEED, ...gridEvents].slice(0, 6);
  const totalGridCalls = 2000;
  const gwhShifted = 44;
  const currentTou = 'off-peak';
  const currentRate = 0.08;

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { n: 'Off-Peak', l: 'TOU Mode Active', sub: `$${currentRate}/kWh  .  Charging open`, c: '#10b981' },
          { n: `${evDevices.find(e=>e.status==='charging')?.chargeRateKw ?? 6.2} kW`, l: 'EV Charge Rate', sub: 'Optimized for off-peak', c: '#3b82f6' },
          { n: `${Math.round(evDevices.find(e=>e.status==='charging')?.stateOfCharge ?? 78)}%`, l: 'Primary EV SOC', sub: 'Target 90% by 06:00', c: '#f59e0b' },
          { n: `${totalGridCalls.toLocaleString()}+`, l: 'Grid Calls Handled 2024', sub: `${gwhShifted} GWh shifted`, c: '#8b5cf6' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: 2, background: s.c }} />
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>{s.n}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{s.l}</div>
            <div style={{ fontSize: 11, color: s.c, marginTop: 5 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

        {/* EV Fleet */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text3)' }}>EV Fleet -- Grid Integration</span>
            <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>GM Partnership</span>
          </div>

          <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 14 }}>
            EnergyHub integrates directly with GM's EV fleet (Chevy, GMC, Cadillac) and PowerBank home storage. Charging is scheduled and optimized against TOU windows and utility demand response signals.
          </p>

          {evDevices.map((ev: EvDevice) => {
            const isCharging = ev.status === 'charging';
            const barColor = ev.id === 'ev2' ? '#14b8a6' : '#10b981';
            return (
              <div key={ev.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: 'var(--bg3)', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, background: 'var(--bg4)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {ev.id === 'ev2' ? '[icon]' : '[icon]'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{ev.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>{ev.location}  .  {isCharging ? `Charging at ${ev.chargeRateKw} kW` : ev.status === 'idle' ? 'Standby' : 'Paused -- DR'}</div>
                  <SocBar pct={ev.stateOfCharge} color={barColor} />
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3 }}>
                    Target: {ev.targetSoc}% by {String(ev.targetByHour).padStart(2,'0')}:00
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 500, color: barColor }}>
                    {Math.round(ev.stateOfCharge)}%
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
                    {isCharging ? `${ev.chargeRateKw} kW ^` : 'Standby'}
                  </div>
                </div>
              </div>
            );
          })}

          {/* PEMS priority stack */}
          <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: 12, marginTop: 4 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 }}>PEMS Priority Stack</div>
            {[
              { c: '#ef4444', label: '1. Safety', desc: 'Life safety systems -- never shed' },
              { c: '#f59e0b', label: '2. Security Mesh', desc: 'Protected -- cannot be shed under any condition' },
              { c: '#10b981', label: '3. Energy Efficiency', desc: 'Optimize, shed deferrable loads (EV, HVAC, vampire)' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: i < 2 ? 6 : 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: row.c, flexShrink: 0, marginTop: 4 }} />
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                  <strong style={{ color: 'var(--text)' }}>{row.label}</strong> -- {row.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid Events */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text3)' }}>Utility Grid Events -- Live</span>
            <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: 'rgba(20,184,166,0.15)', color: '#2dd4bf', border: '1px solid rgba(20,184,166,0.3)' }}>Grid-Interactive</span>
          </div>

          {allEvents.map((ev) => {
            const c = EVENT_COLORS[ev.type];
            return (
              <div key={ev.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: `${c}08`, border: `1px solid ${c}25`, borderRadius: 8, marginBottom: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: c, flexShrink: 0, marginTop: 5 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: c, marginBottom: 3 }}>{EVENT_LABELS[ev.type]}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{ev.message}</div>
                </div>
                {ev.savingsUsd && (
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#34d399', whiteSpace: 'nowrap' }}>
                    -${ev.savingsUsd.toFixed(2)}
                  </div>
                )}
              </div>
            );
          })}

          {/* TOU bar */}
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 }}>TOU Windows -- Dominion Energy</div>
            <div style={{ display: 'flex', gap: 0, borderRadius: 6, overflow: 'hidden', height: 32 }}>
              {TOU_WINDOWS.map((w, i) => (
                <div key={i} style={{
                  width: `${w.pct}%`,
                  background: `${w.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 700, color: w.color,
                  borderRight: i < TOU_WINDOWS.length - 1 ? '1px solid var(--bg)' : 'none',
                }}>
                  {w.pct >= 12 ? w.label : ''}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 10, color: 'var(--text3)' }}>
              {TOU_WINDOWS.map((w, i) => (
                <span key={i} style={{ color: w.color }}>${w.rate}/kWh</span>
              ))}
            </div>
          </div>

          {/* GM Partnership callout */}
          <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#34d399', marginBottom: 4 }}>GM EV Partnership -- Active</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
              Direct integration with Chevy, GMC, and Cadillac EVs + PowerBank home storage. EV charging schedules automatically optimized against utility programs. Enrolled vehicles participate in demand response without driver action.
            </div>
          </div>
        </div>
      </div>

      {/* EnergyHub metrics */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 14 }}>EnergyHub 2024 -- Platform Impact</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {[
            { n: '$50M+', l: 'EnergyHub SaaS 2024', sub: 'Fastest growing segment', c: '#10b981' },
            { n: '1.6M', l: 'Grid-Edge Devices', sub: 'DERs enrolled', c: '#14b8a6' },
            { n: '2,000+', l: 'Utility Grid Calls', sub: 'Summer 2024', c: '#3b82f6' },
            { n: '44 GWh', l: 'Peak Demand Shifted', sub: 'Out of peak windows', c: '#8b5cf6' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--bg3)', borderRadius: 8, padding: 14, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, color: s.c }}>{s.n}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>{s.l}</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--bg3)', borderRadius: 8, fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text)' }}>Dynamic load-shaping</strong> -- introduced in 2024 -- uses AI-driven optimizations to automatically coordinate distributed energy resources (batteries, thermostats, EVs) in response to grid conditions. EnergyHub called upon over 2,000 times in summer 2024, shifting 44 GWh out of peak windows. Canada's largest residential VPP launched in partnership with Ontario's IESO: 100,000 homes enrolled in six months.
        </div>
      </div>
    </div>
  );
}
