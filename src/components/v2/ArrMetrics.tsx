import React, { useState, useEffect, useRef } from 'react';
import { useV2Store } from '@/store/useV2Store';
import { arrInsight } from '@/api/claude';
import { format } from 'date-fns';
import type { ResolutionEvent } from '@/types';

const AGENT_COLORS: Record<string, string> = {
  'AI Deterrence': '#10b981',
  'Remote Video Monitor': '#3b82f6',
  'Perimeter Guard': '#14b8a6',
  'Energy Optimizer': '#f59e0b',
  'Smart Access Controller': '#8b5cf6',
};

const EVENT_TEMPLATES = [
  { type: 'Motion · Perimeter', agent: 'Perimeter Guard', disp: 'auto-resolved' as const, conf: 0.94 },
  { type: 'Video Alert · Front Door', agent: 'Remote Video Monitor', disp: 'auto-resolved' as const, conf: 0.91 },
  { type: 'Access Anomaly · Server', agent: 'Smart Access Controller', disp: 'escalated' as const, conf: 0.73 },
  { type: 'NILM Spike · HVAC', agent: 'Energy Optimizer', disp: 'auto-resolved' as const, conf: 0.97 },
  { type: 'Perimeter Breach · Cam2', agent: 'AI Deterrence', disp: 'auto-resolved' as const, conf: 0.89 },
  { type: 'Unknown Badge · Exec Floor', agent: 'Smart Access Controller', disp: 'dispatched' as const, conf: 0.99 },
];

export default function ArrMetricsPanel() {
  const { arrMetrics, addResolutionEvent, resolutionEvents } = useV2Store();
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setLoading(true);
    arrInsight(arrMetrics)
      .then(setInsight)
      .catch(() => setInsight('AI insight unavailable — check API key in .env'))
      .finally(() => setLoading(false));

    // Simulate live event stream
    let idx = 0;
    intervalRef.current = setInterval(() => {
      const tmpl = EVENT_TEMPLATES[idx % EVENT_TEMPLATES.length]; idx++;
      const ev: ResolutionEvent = {
        id: `ev-${Date.now()}`,
        timestamp: new Date(),
        type: tmpl.type,
        zone: 'Zone ' + (Math.floor(Math.random() * 4) + 1),
        disposition: tmpl.disp,
        confidence: tmpl.conf,
        agentId: tmpl.agent,
        durationMs: Math.floor(Math.random() * 4000) + 400,
      };
      addResolutionEvent(ev);
    }, 2800);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const dispColor = (d: string) =>
    d === 'auto-resolved' ? '#10b981' : d === 'escalated' ? '#f59e0b' : '#ef4444';

  return (
    <div>
      {/* Big stat */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 8 }}>Platform-Wide AI Resolution Rate</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 56, fontWeight: 800, color: '#34d399', lineHeight: 1, letterSpacing: -2 }}>
            {(arrMetrics.resolutionRate * 100).toFixed(1)}%
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--text3)', marginTop: 4, letterSpacing: 0.5 }}>
            AI RESOLUTION RATE — {arrMetrics.windowDays}-DAY ROLLING
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '14px 0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { n: arrMetrics.autoResolved.toLocaleString(), l: 'Auto-resolved', c: '#34d399' },
              { n: arrMetrics.escalated.toLocaleString(), l: 'Human review', c: '#fcd34d' },
              { n: arrMetrics.dispatched.toLocaleString(), l: 'Dispatched', c: '#f87171' },
              { n: `${(arrMetrics.baselineRate * 100).toFixed(0)}%`, l: 'Human-only baseline', c: '#8b9ab5' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: s.c }}>{s.n}</div>
                <div style={{ fontSize: 10, color: 'var(--text3)' }}>{s.l}</div>
              </div>
            ))}
          </div>
          {(insight || loading) && (
            <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(59,130,246,0.06)', borderRadius: 8, border: '1px solid rgba(59,130,246,0.15)', fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent2)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>AI Business Insight</div>
              {loading ? 'Calculating business impact...' : insight}
            </div>
          )}
        </div>

        {/* Funnel */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 16 }}>Resolution Funnel — 30 Days</div>
          {[
            { label: `${arrMetrics.totalEvents.toLocaleString()} events detected`, pct: 1, c: 'rgba(59,130,246,0.25)', t: '#60a5fa' },
            { label: `${arrMetrics.autoResolved.toLocaleString()} auto-resolved (${(arrMetrics.resolutionRate * 100).toFixed(1)}%)`, pct: arrMetrics.resolutionRate, c: 'rgba(16,185,129,0.2)', t: '#34d399' },
            { label: `${arrMetrics.escalated.toLocaleString()} escalated to human`, pct: arrMetrics.escalated / arrMetrics.totalEvents, c: 'rgba(245,158,11,0.2)', t: '#fcd34d' },
            { label: `${arrMetrics.dispatched.toLocaleString()} dispatched`, pct: arrMetrics.dispatched / arrMetrics.totalEvents, c: 'rgba(239,68,68,0.2)', t: '#f87171' },
          ].map((row, i) => (
            <div key={i}>
              <div style={{ height: 32, background: row.c, borderRadius: 6, width: `${Math.max(row.pct * 100, 6)}%`, minWidth: 60, display: 'flex', alignItems: 'center', paddingLeft: 10, fontSize: 11, fontWeight: 600, color: row.t, marginBottom: 4 }}>
                {row.pct > 0.15 ? row.label : ''}
              </div>
              {row.pct <= 0.15 && <div style={{ fontSize: 11, color: row.t, marginBottom: 4, paddingLeft: 4 }}>{row.label}</div>}
              {i < 3 && <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 8, paddingLeft: 4 }}>↓ AI processing</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Live events + by-agent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 12 }}>Live Resolution Log</div>
          {resolutionEvents.slice(0, 8).map(ev => (
            <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: dispColor(ev.disposition), flexShrink: 0 }} />
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', width: 54, flexShrink: 0 }}>
                {format(ev.timestamp, 'HH:mm:ss')}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)', flex: 1 }}>{ev.type}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: dispColor(ev.disposition), textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                {ev.disposition.replace('-', ' ')}
              </div>
            </div>
          ))}
          {resolutionEvents.length === 0 && (
            <div style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>Waiting for events...</div>
          )}
        </div>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 14 }}>ARR by Agent</div>
          {Object.entries(arrMetrics.byAgent).map(([agent, rate]) => (
            <div key={agent} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text2)', marginBottom: 5 }}>
                <span>{agent}</span>
                <span style={{ color: rate > 0.9 ? '#10b981' : rate > 0.85 ? '#34d399' : rate > 0.8 ? '#60a5fa' : '#f59e0b', fontWeight: 600 }}>
                  {(rate * 100).toFixed(1)}%
                </span>
              </div>
              <div style={{ height: 6, background: 'var(--bg4)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${rate * 100}%`, background: AGENT_COLORS[agent] ?? '#3b82f6', borderRadius: 3 }} />
              </div>
            </div>
          ))}
          <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />
          <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: 12, fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
            At 87.4% ARR across 9.3M subscribers: <strong style={{ color: '#34d399' }}>~$340M/yr addressable outcome premium</strong> at $4/resolved event. Improvement to 95% target unlocks ~$30M additional.
          </div>
        </div>
      </div>
    </div>
  );
}
