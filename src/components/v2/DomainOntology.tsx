import React, { useState } from 'react';
import { useV2Store } from '@/store/useV2Store';
import { queryOntology } from '@/api/claude';
import type { OntologyNode } from '@/types';

const DOMAIN_COLORS: Record<string, string> = {
  property: '#10b981',
  security: '#ef4444',
  energy: '#f59e0b',
  behavioral: '#8b5cf6',
};

const DOMAIN_LABELS: Record<string, string> = {
  property: 'Property Types',
  security: 'Security Domain',
  energy: 'Energy Domain',
  behavioral: 'Behavioral Intelligence',
};

export default function DomainOntology() {
  const { ontologyNodes } = useV2Store();
  const [selected, setSelected] = useState<OntologyNode | null>(null);
  const [nlQuery, setNlQuery] = useState('');
  const [nlAnswer, setNlAnswer] = useState('');
  const [nlLoading, setNlLoading] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  const handleNodeClick = (node: OntologyNode) => {
    setSelected(selected?.id === node.id ? null : node);
  };

  const handleQuery = async () => {
    if (!nlQuery.trim()) return;
    setNlLoading(true);
    setNlAnswer('');
    const relevant = ontologyNodes.filter(n =>
      nlQuery.toLowerCase().split(' ').some(w => n.label.toLowerCase().includes(w) || n.domain.includes(w))
    ).slice(0, 6);
    try {
      const ans = await queryOntology(nlQuery, relevant);
      setNlAnswer(ans);
    } catch {
      setNlAnswer('Ontology query unavailable -- check API key in .env');
    } finally {
      setNlLoading(false);
    }
  };

  const visibleNodes = filter ? ontologyNodes.filter(n => n.domain === filter || n.id === 'property-intel') : ontologyNodes;

  const byDomain = ['property', 'security', 'energy', 'behavioral'].reduce<Record<string, OntologyNode[]>>((acc, d) => {
    acc[d] = visibleNodes.filter(n => n.domain === d && n.id !== 'property-intel');
    return acc;
  }, {});

  const hub = ontologyNodes.find(n => n.id === 'property-intel');

  return (
    <div>
      {/* NL query */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          value={nlQuery}
          onChange={e => setNlQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleQuery()}
          placeholder='Ask the ontology: "Show threat patterns for retail after hours" or "Map energy profiles for multi-family"'
          style={{ flex: 1, background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--text)', fontFamily: 'Inter, sans-serif', outline: 'none' }}
        />
        <button onClick={handleQuery} style={{ padding: '10px 18px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          Query
        </button>
      </div>
      {(nlAnswer || nlLoading) && (
        <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, padding: '12px 14px', marginBottom: 14, fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
          {nlLoading ? <span style={{ color: 'var(--text3)' }}>Querying ontology...</span> : nlAnswer}
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { n: '847', l: 'Property-type nodes', c: '#10b981' },
          { n: '3,241', l: 'Entity relationships', c: '#3b82f6' },
          { n: '142', l: 'Threat pattern types', c: '#ef4444' },
          { n: '89', l: 'Energy profiles', c: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--bg3)', borderRadius: 8, padding: 12, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: s.c }}>{s.n}</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Domain filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        <button onClick={() => setFilter(null)} style={{ padding: '4px 12px', borderRadius: 20, border: '1px solid', fontSize: 11, fontWeight: 600, cursor: 'pointer', borderColor: !filter ? 'var(--accent)' : 'var(--border2)', background: !filter ? 'rgba(59,130,246,0.15)' : 'transparent', color: !filter ? 'var(--accent2)' : 'var(--text3)' }}>
          All Domains
        </button>
        {Object.entries(DOMAIN_COLORS).map(([d, c]) => (
          <button key={d} onClick={() => setFilter(filter === d ? null : d)} style={{ padding: '4px 12px', borderRadius: 20, border: '1px solid', fontSize: 11, fontWeight: 600, cursor: 'pointer', borderColor: filter === d ? c : 'var(--border2)', background: filter === d ? `${c}20` : 'transparent', color: filter === d ? c : 'var(--text3)' }}>
            {DOMAIN_LABELS[d]}
          </button>
        ))}
      </div>

      {/* Ontology grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 12, marginBottom: 14 }}>
        {/* Left: Property + Behavioral */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...byDomain.property, ...byDomain.behavioral].map(node => (
            <NodeCard key={node.id} node={node} selected={selected?.id === node.id} onClick={() => handleNodeClick(node)} />
          ))}
        </div>

        {/* Center: Hub + connections */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {hub && (
            <div onClick={() => handleNodeClick(hub)} style={{
              background: 'rgba(59,130,246,0.15)', border: '2px solid var(--accent)',
              borderRadius: 12, padding: '16px 20px', textAlign: 'center', cursor: 'pointer', width: '100%',
              boxShadow: selected?.id === hub.id ? '0 0 20px rgba(59,130,246,0.3)' : 'none',
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent2)', fontFamily: "'Syne', sans-serif" }}>Property Intelligence Hub</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>Central coordination node -- all domain signals converge here</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8 }}>
                {['property', 'security', 'energy', 'behavioral'].map(d => (
                  <div key={d} style={{ width: 8, height: 8, borderRadius: '50%', background: DOMAIN_COLORS[d] }} />
                ))}
              </div>
            </div>
          )}
          <div style={{ fontSize: 12, color: 'var(--text3)', textAlign: 'center', lineHeight: 1.5 }}>
            The shared knowledge graph that lets AID, EnergyHub, OpenEye, and CHeKT share intelligence -- the hardest architectural problem in the platform.
          </div>
        </div>

        {/* Right: Security + Energy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...byDomain.security, ...byDomain.energy].map(node => (
            <NodeCard key={node.id} node={node} selected={selected?.id === node.id} onClick={() => handleNodeClick(node)} />
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ background: 'var(--bg2)', border: `1px solid ${DOMAIN_COLORS[selected.domain]}40`, borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: DOMAIN_COLORS[selected.domain] }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{selected.label}</div>
            <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: `${DOMAIN_COLORS[selected.domain]}20`, color: DOMAIN_COLORS[selected.domain], textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {DOMAIN_LABELS[selected.domain]}
            </span>
            {selected.entityCount != null && selected.entityCount > 0 && (
              <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 'auto' }}>
                {selected.entityCount.toLocaleString()} entities
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 10 }}>{selected.description}</p>
          {selected.connections.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Connected Nodes</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {selected.connections.map(cid => {
                  const cn = ontologyNodes.find(n => n.id === cid);
                  return cn ? (
                    <span key={cid} onClick={() => handleNodeClick(cn)} style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 12, cursor: 'pointer', background: `${DOMAIN_COLORS[cn.domain]}15`, color: DOMAIN_COLORS[cn.domain], border: `1px solid ${DOMAIN_COLORS[cn.domain]}30` }}>
                      {cn.label}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 14 }}>
        {Object.entries(DOMAIN_COLORS).map(([d, c]) => (
          <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text2)' }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: `${c}40`, border: `1px solid ${c}` }} />
            {DOMAIN_LABELS[d]}
          </div>
        ))}
      </div>
    </div>
  );
}

function NodeCard({ node, selected, onClick }: { node: OntologyNode; selected: boolean; onClick: () => void }) {
  const c = DOMAIN_COLORS[node.domain];
  return (
    <div onClick={onClick} style={{
      background: selected ? `${c}12` : 'var(--bg3)',
      border: `1px solid ${selected ? c : 'var(--border)'}`,
      borderRadius: 8, padding: '10px 12px', cursor: 'pointer', transition: 'all .15s',
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: c, marginBottom: 3 }}>{node.label}</div>
      <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.4 }}>
        {node.description.slice(0, 72)}...
      </div>
    </div>
  );
}
