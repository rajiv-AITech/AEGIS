import React, { useState } from 'react';
import { useV2Store } from '@/store/useV2Store';
import { commercialZoneAlert } from '@/api/claude';
import type { CommercialZone } from '@/types';

type SubView = 'zones' | 'access' | 'timeline';

const THREAT_COLORS: Record<string, string> = {
  normal: '#10b981', watch: '#3b82f6', elevated: '#f59e0b', alert: '#ef4444',
};

const ACCESS_EVENTS = [
  { initials: 'JM', name: 'James Martinez', role: 'Facilities Mgr', zone: 'Loading Dock 06:42', result: 'Granted -- Normal', c: '#10b981', note: 'Expected shift 06:00-14:00 [icon]' },
  { initials: 'SK', name: 'Sarah Kim', role: 'IT Engineer', zone: 'Server Room 23:18', result: 'Granted -- Flagged', c: '#f59e0b', note: 'Off-shift anomaly logged' },
  { initials: '??', name: 'Unknown Badge #4471', role: 'No profile match', zone: 'Executive Floor 23:41', result: 'Denied -- AI Alert', c: '#ef4444', note: 'AI Deterrence engaged' },
  { initials: 'RP', name: 'Robert Park', role: 'VP Operations', zone: 'All zones 08:15', result: 'Granted -- Normal', c: '#10b981', note: 'Level 4 clearance, normal pattern' },
];

const TIMELINE = [
  { time: '23:41', c: '#ef4444', text: 'AI ALERT: Unknown access attempt, Executive Floor. AI Deterrence engaged. Behavioral score 8.1. RVM operator notified.' },
  { time: '22:15', c: '#f59e0b', text: 'Anomaly: S. Kim badge -- Server Room, 08:00 off-shift deviation. Authorized but atypical. Logged for next-day review.' },
  { time: '20:00', c: '#3b82f6', text: 'Shift transition: After-hours mode engaged. Lobby -> Watch, Server Room -> Elevated, all other zones -> Normal.' },
  { time: '18:02', c: '#14b8a6', text: 'Energy AI: End-of-day load shed. HVAC setback to 74degF. Vampire loads suspended. Security Mesh protected -- not shed.' },
  { time: '14:30', c: '#10b981', text: 'Auto-resolved: Parking structure motion. AI camera review: delivery vehicle, plate matched. No human intervention.' },
  { time: '09:15', c: '#10b981', text: 'Morning baseline set: 47 employees badged in. AI behavioral baseline updated. Threat score: 1.4 (low).' },
];

export default function CommercialAI() {
  const { commercialZones } = useV2Store();
  const [subView, setSubView] = useState<SubView>('zones');
  const [selectedZone, setSelectedZone] = useState<CommercialZone | null>(null);
  const [aiRec, setAiRec] = useState('');
  const [loadingRec, setLoadingRec] = useState(false);

  const handleZoneClick = async (zone: CommercialZone) => {
    setSelectedZone(zone);
    if (zone.threatLevel === 'alert' || zone.threatLevel === 'elevated') {
      setLoadingRec(true);
      try {
        const rec = await commercialZoneAlert(zone);
        setAiRec(rec);
      } catch {
        setAiRec('AI recommendation unavailable -- check API key in .env');
      } finally {
        setLoadingRec(false);
      }
    } else {
      setAiRec('');
    }
  };

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { n: '$80M+', l: 'Commercial SaaS 2024', sub: '^ ~25% YoY', c: '#10b981' },
          { n: '$20M', l: 'OpenEye SaaS', sub: '+ CHeKT RVM (Feb 2025)', c: '#3b82f6' },
          { n: '6', l: 'Active Zones Monitored', sub: `${commercialZones.filter(z=>z.threatLevel==='alert').length} in alert`, c: '#ef4444' },
          { n: '91.2%', l: 'Commercial AI ARR', sub: 'vs 61% standard-tier', c: '#8b5cf6' },
        ].map((s,i) => (
          <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: 2, background: s.c }} />
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>{s.n}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{s.l}</div>
            <div style={{ fontSize: 11, color: s.c, marginTop: 5 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Sub-nav */}
      <div style={{ display: 'flex', gap: 0, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', width: 'fit-content', marginBottom: 16 }}>
        {(['zones', 'access', 'timeline'] as SubView[]).map(v => (
          <button key={v} onClick={() => setSubView(v)} style={{
            padding: '7px 16px', fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', transition: 'all .15s',
            background: subView === v ? 'var(--accent)' : 'transparent',
            color: subView === v ? 'white' : 'var(--text3)',
          }}>
            {v === 'zones' ? 'Multi-Zone View' : v === 'access' ? 'Access Control AI' : 'Shift Timeline'}
          </button>
        ))}
      </div>

      {/* Zones */}
      {subView === 'zones' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
            {commercialZones.map(zone => (
              <div key={zone.id} onClick={() => handleZoneClick(zone)} style={{
                background: selectedZone?.id === zone.id ? `${THREAT_COLORS[zone.threatLevel]}10` : 'var(--bg3)',
                border: `1px solid ${selectedZone?.id === zone.id ? THREAT_COLORS[zone.threatLevel] : 'var(--border)'}`,
                borderRadius: 8, padding: 12, cursor: 'pointer', transition: 'all .2s',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{zone.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>
                  {zone.hours}  .  {zone.cameras} cameras
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    background: `${THREAT_COLORS[zone.threatLevel]}20`,
                    color: THREAT_COLORS[zone.threatLevel],
                    padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 600,
                    textTransform: 'uppercase',
                  }}>
                    {zone.threatLevel}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text3)' }}>Score: {zone.threatScore.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>

          {selectedZone && (
            <div style={{ background: `${THREAT_COLORS[selectedZone.threatLevel]}08`, border: `1px solid ${THREAT_COLORS[selectedZone.threatLevel]}30`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: THREAT_COLORS[selectedZone.threatLevel], marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Zone Detail -- {selectedZone.name}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 10 }}>
                {[
                  { l: 'Threat Score', v: selectedZone.threatScore.toFixed(1) },
                  { l: 'Active Alerts', v: selectedZone.activeAlerts },
                  { l: 'Clearance Level', v: selectedZone.clearanceLevel },
                  { l: 'Occupied', v: selectedZone.occupiedNow ? 'Yes' : 'No' },
                ].map((s,i) => (
                  <div key={i} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 6, padding: 10, textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{s.v}</div>
                    <div style={{ fontSize: 10, color: 'var(--text3)' }}>{s.l}</div>
                  </div>
                ))}
              </div>
              {(aiRec || loadingRec) && (
                <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>AI Recommendation: </span>
                  {loadingRec ? 'Analyzing zone state...' : aiRec}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Access */}
      {subView === 'access' && (
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 6 }}>AI-Driven Access Control -- Shift-Aware Behavioral Baseline</div>
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 14 }}>
            Unlike residential access control, commercial AI models shift patterns, role hierarchies, and anomalous cross-zone movement. Access decisions compare against expected behavioral patterns for that role x time x zone combination.
          </p>
          {ACCESS_EVENTS.map((ev, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 10, background: 'var(--bg3)', borderRadius: 8, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${ev.c}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: ev.c, flexShrink: 0 }}>
                {ev.initials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{ev.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>{ev.role}  .  {ev.zone}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>{ev.note}</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: ev.c, whiteSpace: 'nowrap' }}>{ev.result}</div>
            </div>
          ))}
        </div>
      )}

      {/* Timeline */}
      {subView === 'timeline' && (
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 14 }}>AI Shift Timeline -- 24-Hour Intelligence Log</div>
          {TIMELINE.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', width: 44, flexShrink: 0, paddingTop: 2 }}>{item.time}</div>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.c, flexShrink: 0, marginTop: 3 }} />
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: item.text.replace(/([A-Z\s]+:)/, '<strong style="color:#e8edf5">$1</strong>') }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
