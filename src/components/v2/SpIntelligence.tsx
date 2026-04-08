import React, { useState, useEffect } from 'react';
import { useV2Store } from '@/store/useV2Store';
import { spAnalysis } from '@/api/claude';
import type { ServiceProvider } from '@/types';

const TIER_LABELS: Record<string, string> = {
  'enterprise-ai': 'Enterprise AI',
  'pro-ai': 'Pro AI',
  'standard': 'Standard',
};

const STATUS_COLORS: Record<string, string> = {
  'optimal': '#10b981',
  'scaling': '#3b82f6',
  'upgrade-ready': '#f59e0b',
};

const STATUS_LABELS: Record<string, string> = {
  'optimal': 'Optimal',
  'scaling': 'Scaling',
  'upgrade-ready': 'Upgrade Ready',
};

function MiniBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, width: 80, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${value * 100}%`, background: color, borderRadius: 2 }} />
    </div>
  );
}

export default function SpIntelligence() {
  const { serviceProviders } = useV2Store();
  const [aiInsight, setAiInsight] = useState('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  const totalSubs = serviceProviders.reduce((a, b) => a + b.subscribers, 0);
  const aiTierSPs = serviceProviders.filter(sp => sp.tier !== 'standard');
  const upgradeReady = serviceProviders.filter(sp => sp.status === 'upgrade-ready');
  const avgAiArr = aiTierSPs.reduce((a, b) => a + b.aiResolutionRate, 0) / (aiTierSPs.length || 1);

  useEffect(() => {
    setLoadingInsight(true);
    spAnalysis(serviceProviders)
      .then(setAiInsight)
      .catch(() => setAiInsight('AI analysis unavailable -- check API key in .env'))
      .finally(() => setLoadingInsight(false));
  }, []);

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { n: serviceProviders.length.toLocaleString(), l: 'Active SPs', sub: '^ 847 this year', c: '#3b82f6' },
          { n: aiTierSPs.length, l: 'AI-Tier Partners', sub: 'New tier -- Q1 2025', c: '#10b981' },
          { n: `${upgradeReady.length}`, l: 'Upgrade-Ready SPs', sub: `~$71M incremental ARR`, c: '#f59e0b' },
          { n: `${(avgAiArr * 100).toFixed(1)}%`, l: 'Avg ARR (AI-tier)', sub: 'vs 61% standard', c: '#8b5cf6' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: 2, background: s.c }} />
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>{s.n}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{s.l}</div>
            <div style={{ fontSize: 11, color: '#10b981', marginTop: 6 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      {(aiInsight || loadingInsight) && (
        <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--accent2)', display: 'block', marginBottom: 4 }}>AI Analysis</span>
          {loadingInsight ? 'Analyzing partner network...' : aiInsight}
        </div>
      )}

      {/* Partner Table */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text3)' }}>Partner AI Performance</span>
          <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: 'rgba(59,130,246,0.15)', color: 'var(--accent2)', border: '1px solid rgba(59,130,246,0.3)' }}>API-Accessible</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>
              {['Service Provider', 'Tier', 'Subscribers', 'AI Res. Rate', 'Threat Score', 'Energy Savings/mo', 'Status'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '6px 10px', fontSize: 10, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text3)', borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {serviceProviders.map((sp: ServiceProvider) => {
              const arrColor = sp.aiResolutionRate > 0.85 ? '#10b981' : sp.aiResolutionRate > 0.7 ? '#3b82f6' : '#f59e0b';
              return (
                <tr key={sp.id} style={{ cursor: 'pointer' }}>
                  <td style={{ padding: '9px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'middle' }}>
                    <div style={{ fontWeight: 500, color: 'var(--text)', fontSize: 13 }}>{sp.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text3)' }}>{sp.location}  .  {sp.yearsPartner}yr partner</div>
                  </td>
                  <td style={{ padding: '9px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'middle' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 600,
                      background: sp.tier === 'enterprise-ai' ? 'rgba(139,92,246,0.15)' : sp.tier === 'pro-ai' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.06)',
                      color: sp.tier === 'enterprise-ai' ? '#a78bfa' : sp.tier === 'pro-ai' ? '#60a5fa' : 'var(--text3)',
                    }}>
                      {TIER_LABELS[sp.tier]}
                    </span>
                  </td>
                  <td style={{ padding: '9px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'middle', color: 'var(--text)', fontWeight: 500 }}>
                    {sp.subscribers.toLocaleString()}
                  </td>
                  <td style={{ padding: '9px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MiniBar value={sp.aiResolutionRate} color={arrColor} />
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500, color: arrColor }}>
                        {(sp.aiResolutionRate * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '9px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'middle' }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: sp.avgThreatScore > 6 ? '#f87171' : sp.avgThreatScore > 4 ? '#f59e0b' : 'var(--text2)' }}>
                      {sp.avgThreatScore.toFixed(1)}
                    </span>
                  </td>
                  <td style={{ padding: '9px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'middle', color: sp.energySavingsMonthly > 0 ? '#34d399' : 'var(--text3)', fontWeight: 600 }}>
                    {sp.energySavingsMonthly > 0 ? `$${(sp.energySavingsMonthly / 1000).toFixed(0)}K` : 'N/A'}
                  </td>
                  <td style={{ padding: '9px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'middle' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                      background: `${STATUS_COLORS[sp.status]}20`,
                      color: STATUS_COLORS[sp.status],
                      border: `1px solid ${STATUS_COLORS[sp.status]}40`,
                    }}>
                      {STATUS_LABELS[sp.status]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Upgrade Pipeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 12 }}>AI-Tier Monetization Model</div>
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 12 }}>
            Standard tier prices per subscriber. AI-tier prices <strong style={{ color: 'var(--text)' }}>per outcome</strong> -- verified AI resolutions, energy savings, false alarm reductions. This transforms SPs from connectivity resellers into intelligence service providers.
          </p>
          {[
            { c: '#3b82f6', t: 'Base:', d: '$X per subscriber/month (unchanged)' },
            { c: '#10b981', t: 'AI Premium:', d: '+$Y per autonomous resolution' },
            { c: '#f59e0b', t: 'Energy Tier:', d: '% of verified grid savings delivered' },
            { c: '#8b5cf6', t: 'Enterprise API:', d: 'Platform access for SP-built services' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: row.c, flexShrink: 0, marginTop: 6 }} />
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                <strong style={{ color: 'var(--text)' }}>{row.t}</strong> {row.d}
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 12 }}>Upgrade Pipeline -- Incremental ARR</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 800, color: '#fcd34d', letterSpacing: -1 }}>$71.2M</div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 14 }}>If {upgradeReady.length * 283} standard SPs upgrade to AI-tier at current ARPU</div>
          {upgradeReady.map(sp => (
            <div key={sp.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                <strong style={{ color: 'var(--text)' }}>{sp.name}</strong> -- {(sp.aiResolutionRate * 100).toFixed(0)}% vs 91% AI-tier avg -> clear value prop
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
