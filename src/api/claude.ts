import type { ArrMetrics, CommercialZone, OntologyNode, PemsState, ServiceProvider } from '@/types';

const MODEL = import.meta.env.VITE_CLAUDE_MODEL ?? 'claude-sonnet-4-20250514';
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY ?? '';

async function callClaude(systemPrompt: string, userMessage: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 600,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}

// ── V1 context builders ────────────────────────────────────────────────────

export function buildSecurityContext(threatScore: number, activeAgents: number): string {
  return `You are the Aegis Security Intelligence core. Current platform state:
- Threat score: ${threatScore}/10
- Active AI agents: ${activeAgents}
- Platform: Aegis v2 — Autonomous Property Intelligence
- Priority stack: Safety > Security > Energy Efficiency
Provide concise, actionable security guidance. Never recommend reducing security posture.`;
}

export function buildPEMSContext(state: PemsState): string {
  return `You are the Aegis PEMS (Predictive Energy Management System) advisor.
Current state:
- TOU window: ${state.touWindow} at $${state.ratePerKwh}/kWh
- Total load: ${state.totalLoadKw} kW (Security Mesh: ${state.securityMeshKw} kW — protected, never shed)
- Battery: ${state.batteryPct}%
- PEMS mode: ${state.mode}
- EVs enrolled: ${state.evCount}
Priority: Safety > Security > Energy Efficiency. Security Mesh cannot be shed under any circumstance.
Give specific, quantified energy optimization recommendations.`;
}

export async function parseAutomation(nlRule: string): Promise<{ trigger: string; action: string }> {
  const system = `You are the Aegis NL Automation Parser. Convert natural language automation rules into structured JSON.
Respond ONLY with valid JSON: {"trigger": "...", "action": "..."} — no preamble, no markdown.`;
  const raw = await callClaude(system, nlRule);
  try {
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return { trigger: 'motion detected', action: 'alert sent' };
  }
}

// ── V2 context builders ────────────────────────────────────────────────────

export async function queryOntology(
  question: string,
  relevantNodes: OntologyNode[]
): Promise<string> {
  const nodeContext = relevantNodes
    .map(n => `${n.label} (${n.domain}): ${n.description}`)
    .join('\n');
  const system = `You are the Aegis Domain Ontology intelligence layer.
The ontology is the shared knowledge graph that unifies AID, EnergyHub, OpenEye, and CHeKT into a single intelligence fabric.
Relevant ontology nodes:\n${nodeContext}
Answer questions about property intelligence, threat patterns, energy profiles, and behavioral baselines.
Be specific and technical. Reference actual Alarm.com products (AID, EnergyHub, OpenEye, CHeKT, PointCentral, Building36) where relevant.`;
  return callClaude(system, question);
}

export async function spAnalysis(providers: ServiceProvider[]): Promise<string> {
  const summary = providers
    .map(p => `${p.name}: ${(p.aiResolutionRate * 100).toFixed(1)}% ARR, ${p.tier}, ${p.subscribers.toLocaleString()} subs`)
    .join('\n');
  const system = `You are the Aegis Service Provider Intelligence analyzer.
Analyze SP performance and recommend actionable steps to improve the partner network's AI adoption and upgrade SPs to AI-tier.
SP performance data:\n${summary}
Focus on: ARR improvement opportunities, tier upgrade candidates, ARPU expansion, and partner enablement.`;
  return callClaude(system, 'Provide a 3-sentence analysis with the highest-priority action item.');
}

export async function arrInsight(metrics: ArrMetrics): Promise<string> {
  const system = `You are the Aegis AI Resolution Rate business analyst.
Current 30-day metrics:
- Total events: ${metrics.totalEvents.toLocaleString()}
- Auto-resolved: ${metrics.autoResolved.toLocaleString()} (${(metrics.resolutionRate * 100).toFixed(1)}%)
- Escalated: ${metrics.escalated.toLocaleString()}
- Dispatched: ${metrics.dispatched.toLocaleString()}
- Human-only baseline: ${(metrics.baselineRate * 100).toFixed(1)}%
Quantify the business impact in terms of: cost savings, outcome-based pricing opportunity, and the gap to the 95% target.`;
  return callClaude(system, 'Give a 2-sentence executive summary of business impact.');
}

export async function commercialZoneAlert(zone: CommercialZone): Promise<string> {
  const system = `You are the Aegis Commercial Property Intelligence system.
Zone in alert: ${zone.name}
Threat level: ${zone.threatLevel} (score: ${zone.threatScore}/10)
Clearance: Level ${zone.clearanceLevel}
Occupied: ${zone.occupiedNow}
Active alerts: ${zone.activeAlerts}
Provide a specific recommended response protocol for this commercial security situation.`;
  return callClaude(system, `What is the recommended immediate action for ${zone.name}?`);
}

export async function nlVideoSearch(query: string): Promise<string> {
  const system = `You are the Aegis Natural Language Video Search engine.
You have access to a 6-camera indexed video archive with AI event detection (people, vehicles, motion, anomalies).
The archive covers 30 days of footage with per-frame AI classification at 10fps.
Return a realistic search result summary including: event count, top matching clips with timestamps, confidence scores, and recommended next actions.`;
  return callClaude(system, `Search query: "${query}"`);
}
