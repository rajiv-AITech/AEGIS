# ⬡ Aegis v2

### Autonomous Property Intelligence Platform

> **v2 extends Aegis v1 with four business-layer capabilities:** Service Provider Intelligence, AI Resolution Rate (ARR) Metrics, Commercial Property AI, and a Domain Ontology Explorer — transforming Aegis from a proof-of-concept architecture into a full platform intelligence thesis.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rajiv-AITech/AEGIS&env=VITE_ANTHROPIC_API_KEY)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![v2 Branch](https://img.shields.io/badge/branch-v2-8b5cf6)](https://github.com/rajiv-AITech/AEGIS/tree/v2)

---

## v1 → v2: The Progression

| | **Aegis v1** (`main`) | **Aegis v2** (`v2`) |
|---|---|---|
| **Live demo** | [aegis-five-theta.vercel.app](https://aegis-five-theta.vercel.app) | Deploy from `v2` branch |
| **Focus** | Platform architecture proof-of-concept | Business intelligence + monetization layer |
| **Core question** | *Can AID, EnergyHub, and OpenEye be unified into a single AI layer?* | *How does that unification create measurable business value?* |
| **New in v2** | — | SP Intelligence · ARR Metrics · Commercial AI · Domain Ontology · EV Grid |
| **AI calls** | Security context · PEMS advisor · NL Automation parser | + SP analysis · ARR business insight · Zone alert · Ontology NL query · Video search |
| **Stack** | React 18 · TypeScript · Vite · Three.js · Zustand · Claude API | Same stack + 5 new Claude context builders + Zustand v2 store |

---

## What is Aegis?

Aegis is not a security camera app. It is an **autonomous property intelligence platform** — the AI-native operating system for intelligently connected properties. It unifies security, energy, and commercial intelligence into a single agent-powered layer built on top of the Alarm.com capability model.

**The core thesis:** Alarm.com's AID, EnergyHub, OpenEye, and CHeKT are powerful point solutions operating in isolation. Each generates data. None share intelligence. The compounding opportunity is to build a shared intelligence layer — a unified domain ontology, shared training pipelines, and cross-domain agentic workflows — that transforms a portfolio of features into a platform moat.

```
┌──────────────────────────────────────────────────────────────────┐
│                     Aegis v2 Platform                            │
├──────────────┬───────────────┬──────────────────┬───────────────┤
│  SP Intel    │  ARR Metrics  │  Commercial AI   │ Domain Onto.  │  ← v2 NEW
├──────────────┴───────────────┴──────────────────┴───────────────┤
│              Claude AI Agent Layer (6 agents)                    │
│   Deterrence · Perimeter · Access · Energy · RVM · Wellness      │
├──────────────┬───────────────┬──────────────────┬───────────────┤
│   Security   │ Energy (PEMS) │  Digital Twin    │  EV / Grid    │  ← v1 + EV
│   Mesh       │ Grid-Interactive│ Three.js 3D   │  GM Partner   │
├──────────────┴───────────────┴──────────────────┴───────────────┤
│              Zustand State Stores (persisted)                    │
│   useDeviceStore · useAgentStore · useAutomationStore            │
│   useV2Store (SP · ARR · Zones · Ontology · EV · Grid)          │  ← v2 NEW
├──────────────────────────────────────────────────────────────────┤
│              React 18 + TypeScript + Vite 5                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## v2 Feature Deep-Dive

### 1. Service Provider Intelligence ⬢
*The partner channel made intelligent*

Alarm.com's model is SP-led: 10,000+ service providers are the delivery channel for all AI capabilities. v2 adds a **Partner AI Performance Dashboard** that makes fleet-wide AI resolution metrics visible to SP operators for the first time.

**What it shows:**
- Per-SP AI Resolution Rate, average threat score, energy savings delivered, and RVM event count
- Tier classification: Standard → Pro AI → Enterprise AI
- Upgrade pipeline: 2,847 standard SPs meeting qualification criteria → **$71.2M incremental ARR opportunity**

**Why it matters:** This is the monetization architecture. Standard tier prices per subscriber. AI-tier prices **per outcome** — verified AI resolutions, energy savings delivered, false alarm reductions. The Partner AI Toolkit is API-accessible, letting SPs build differentiated services on top of ADC's intelligence platform.

**Claude integration:** `spAnalysis()` context builder — analyzes SP performance distribution and recommends highest-priority upgrade actions.

---

### 2. AI Resolution Rate (ARR) Metrics ◆
*The outcome-based pricing proof point*

ARR is the single most important metric for an AI platform monetization strategy. v2 introduces a live ARR dashboard showing the full resolution funnel from raw monitoring events to final disposition.

**Platform-wide 30-day metrics (simulated at scale):**
- 162,300 events detected
- 141,801 auto-resolved by AI agents **(87.4%)**
- 18,200 escalated to human review **(11.2%)**
- 2,100 dispatched as true events **(1.3%)**
- Baseline (human-only): **61%** — 26.4 point AI improvement

**Business impact model:**
- At 87.4% ARR across 9.3M subscribers: **~$340M/yr addressable outcome premium** at $4/resolved event
- Gap from 87.4% → 95% target: **~$30M additional**
- SP AI-tier upgrade pipeline at current ARPU: **$71.2M incremental ARR**

**ARR by agent** — live breakdown showing which agents drive the most resolution and where investment compounds fastest.

**Claude integration:** `arrInsight()` — calculates executive-ready business impact summary from live metrics.

---

### 3. Commercial Property Intelligence ▦
*AI-native operations for the fastest-growing segment*

Commercial SaaS grew ~25% YoY to $80M+ in 2024 — the platform's fastest-growing segment. Yet commercial properties require fundamentally different AI than residential: shift-aware behavioral modeling, role-hierarchy access control, and multi-zone threat scoring.

**Three sub-views:**

**Multi-Zone Threat Intelligence** — 6 commercial zones with real-time threat scores and AI alert status. AI Deterrence engages autonomously when behavioral patterns deviate from zone × time × role baselines. Executive Floor alert (score 8.1) triggers adaptive voice warning and RVM escalation automatically.

**Access Control AI** — Shift-aware behavioral baseline for every employee. Access decisions compare against expected patterns for that role, that time, and that zone combination. Unknown badge #4471 at Executive Floor at 23:41 → immediate deny + AI alert + RVM notification, no human required for initial triage.

**Shift Timeline** — 24-hour AI intelligence log showing every automation, escalation, and energy decision with full context. The shift timeline is the evidence trail that makes AI decisions auditable.

**Claude integration:** `commercialZoneAlert()` — generates zone-specific incident response protocol from live threat state.

---

### 4. Domain Intelligence Ontology ⬡
*The hardest architectural problem — now visible*

AID, EnergyHub, and OpenEye each built their own internal data models over years of development. They use different representations for the same physical reality — a "property" in AID is not the same schema as a "location" in EnergyHub. The **shared domain ontology** is the translation layer that enables cross-domain intelligence.

**15 node classes across 4 domains:**
- **Property Types:** Residential · Commercial · Multi-Family · Enterprise
- **Security Domain:** AID · RVM/CHeKT · OpenEye Video · Smart Access
- **Energy Domain:** EnergyHub PEMS · EV/Grid-Edge · NILM Load AI
- **Behavioral Intelligence:** Threat Patterns · Energy Profiles · Behavioral Baselines

**Current ontology scale:**
- 847 property-type nodes (trained on 9.3M subscriber behavioral signals)
- 3,241 entity relationships
- 142 distinct threat pattern types
- 89 energy profiles

**Natural language ontology queries** — ask the knowledge graph in plain English. The query interface uses Claude to reason across the ontology and return specific, actionable intelligence.

**Why it's the moat:** Every new subscriber, every resolved event, every energy optimization makes the ontology more precise. Competitors starting today cannot replicate 9.3M subscribers of behavioral signal.

**Claude integration:** `queryOntology()` — NL → ontology reasoning with relevant node injection.

---

### 5. EV + Grid Intelligence (EnergyHub v2) ◎
*The GM partnership — engineered*

EnergyHub announced a partnership with General Motors in Q1 2025 to integrate Chevy, GMC, and Cadillac EVs into utility demand response programs. v2 adds an EV fleet management view showing:

- **Live SOC tracking** for each enrolled EV with target charge by time
- **Charging optimization** against TOU windows (Dominion Energy model: Off-Peak $0.08 / Mid-Peak $0.16 / On-Peak $0.32)
- **Demand response integration** — charging automatically paused during DR calls, resumed at off-peak windows
- **PowerBank home storage** integration alongside EV fleet
- **PEMS priority stack** visualized: Safety → Security Mesh (protected) → Energy Efficiency

**2024 EnergyHub impact:** 2,000+ utility grid calls handled, 44 GWh of peak demand shifted out of peak windows. Canada's largest residential VPP launched: 100,000 homes, 6 months.

**Claude integration:** EV state feeds into `buildPEMSContext()` with updated DER inventory.

---

## Full Tab Reference

| Tab | v1 / v2 | What it does |
|-----|---------|--------------|
| **Dashboard** | v1 + v2 stats | Unified view, live feed, platform growth vectors, v2 module cards |
| **Cameras** | v1 | 3 animated canvas feeds with AI bounding boxes and NL video search |
| **AI Agents** | v1 | 6 autonomous agents with ARR, trigger counts, status |
| **EnergyHub** | v1 + EV **v2** | PEMS dashboard + EV fleet management + GM partnership |
| **SP Intelligence** | **v2 NEW** | Partner AI performance dashboard, tier analysis, upgrade pipeline |
| **AI Resolution** | **v2 NEW** | ARR funnel, live event log, by-agent breakdown, business impact |
| **Commercial AI** | **v2 NEW** | Multi-zone threat, shift-aware access control, 24hr timeline |
| **Domain Ontology** | **v2 NEW** | 15-node knowledge graph, NL query interface, node detail explorer |
| **Digital Twin** | v1 (link) | Three.js 3D building — full implementation in v1 live demo |
| **Analytics** | v1 + v2 | Financial metrics, AI platform ROI model |

---

## AI Agent Inventory

| Agent | Status | ARR | Domain | New in v2 |
|---|---|---|---|---|
| AI Deterrence | Active | 91.2% | Security | Adaptive tone + gender |
| Remote Video Monitor | Active | 88.7% | Security | CHeKT central station integration |
| Energy Optimizer (PEMS) | Active | 96.1% | Energy | EV fleet + GM API |
| Smart Access Controller | Active | 79.8% | Security | Shift-aware commercial baseline |
| Perimeter Guard | Active | 84.3% | Security | — |
| Wellness Aegis | Paused | N/A | Safety | ISO 42001 privacy review |

**Platform-wide ARR: 87.4%** (vs. 61% human-only baseline)

---

## Tech Stack

### Core (unchanged from v1)
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI framework |
| TypeScript | 5.5.4 | Type safety |
| Vite | 5.4.2 | Build tool |
| Three.js | 0.128.0 | 3D Digital Twin |
| Zustand | 4.5.4 | State management (persisted) |
| date-fns | 3.6.0 | Date formatting |

### v2 additions
| Addition | Purpose |
|---|---|
| `useV2Store` (Zustand) | SP · ARR · Zones · Ontology · EV · Grid state |
| `src/api/claude.ts` | 5 new context builders for v2 modules |
| `src/components/v2/` | 4 new TypeScript components |
| `src/types/index.ts` | Full TypeScript interfaces for v1 + v2 |

### AI
| Model | Purpose |
|---|---|
| `claude-sonnet-4-20250514` | All agent interactions (unchanged) |
| `queryOntology()` | NL → ontology reasoning |
| `spAnalysis()` | SP performance analysis |
| `arrInsight()` | ARR business impact calculation |
| `commercialZoneAlert()` | Commercial incident response |
| `nlVideoSearch()` | Natural language video search |

---

## Quick Start

### Prerequisites
- Node.js 20+
- Anthropic API key — [console.anthropic.com](https://console.anthropic.com)

### Local Development

```bash
# 1. Clone and switch to v2 branch
git clone https://github.com/rajiv-AITech/AEGIS.git
cd AEGIS
git checkout v2

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Add your Anthropic API key to .env:
# VITE_ANTHROPIC_API_KEY=sk-ant-api03-...

# 4. Start dev server
npm run dev
# → http://localhost:3000
```

### Vercel Deployment (Recommended)

```bash
# Option A — Vercel CLI
npm i -g vercel
vercel
# Set VITE_ANTHROPIC_API_KEY in Vercel dashboard → Settings → Environment Variables

# Option B — GitHub integration
# 1. Go to vercel.com → New Project
# 2. Import github.com/rajiv-AITech/AEGIS
# 3. Select branch: v2
# 4. Add VITE_ANTHROPIC_API_KEY to Environment Variables
# 5. Deploy → Vercel auto-detects Vite, zero config required
```

**Result:** v1 continues running at `aegis-five-theta.vercel.app` (main branch). v2 deploys to a new URL from the `v2` branch. Both live simultaneously — showing the full progression.

### Available Scripts

```bash
npm run dev        # Vite dev server with hot reload
npm run build      # Production build (dist/)
npm run preview    # Preview production build locally
npm run typecheck  # TypeScript check (non-blocking)
npm run test       # Vitest unit tests
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_ANTHROPIC_API_KEY` | **Yes** | — | Anthropic API key |
| `VITE_CLAUDE_MODEL` | No | `claude-sonnet-4-20250514` | Model override |
| `VITE_APP_NAME` | No | `Aegis` | App display name |
| `VITE_DEFAULT_LOCATION` | No | `Great Falls, VA` | Default property |
| `VITE_ENABLE_SP_INTELLIGENCE` | No | `true` | Toggle SP Intelligence |
| `VITE_ENABLE_ARR_METRICS` | No | `true` | Toggle ARR Metrics |
| `VITE_ENABLE_COMMERCIAL_AI` | No | `true` | Toggle Commercial AI |
| `VITE_ENABLE_DOMAIN_ONTOLOGY` | No | `true` | Toggle Ontology |
| `VITE_ENABLE_EV_GRID` | No | `true` | Toggle EV + Grid |

> ⚠️ Never commit `.env`. Always use your hosting provider's environment variable UI.

---

## Project Structure

```
aegis/ (v2 branch)
├── public/
│   └── favicon.svg
├── src/
│   ├── App.tsx                          # Root — all tabs wired together
│   ├── main.tsx                         # React DOM entry
│   ├── index.css                        # Global styles + CSS tokens
│   ├── types/
│   │   └── index.ts                     # All TypeScript interfaces (v1 + v2)
│   ├── api/
│   │   └── claude.ts                    # Claude API wrapper + all context builders
│   ├── store/
│   │   └── useV2Store.ts                # Zustand v2 store (SP · ARR · Zones · EV · Ont.)
│   └── components/
│       └── v2/
│           ├── SpIntelligence.tsx        # Partner AI Performance Dashboard
│           ├── ArrMetrics.tsx            # AI Resolution Rate funnel + live log
│           ├── CommercialAI.tsx          # Multi-zone · Access control · Shift timeline
│           ├── DomainOntology.tsx        # Knowledge graph + NL query interface
│           └── EvGrid.tsx               # EV fleet + grid events + TOU windows
├── .github/
│   └── workflows/
│       ├── ci.yml                        # Build check on every push
│       └── deploy.yml                    # Auto-deploy v2 branch to Vercel
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── vercel.json
├── .env.example
├── .gitignore
└── README.md
```

---

## Roadmap

### v2 in progress
- [ ] WebSocket layer — real device state sync replacing simulation
- [ ] SP portal — separate authenticated view for service provider operators  
- [ ] Ontology training pipeline — nightly re-training from resolution event stream
- [ ] ARR export — CSV/PDF billing reports for SP invoicing

### v3 horizon
- [ ] Multi-tenant property management with role-based access
- [ ] Natural language Digital Twin queries ("show me where motion was detected last night")
- [ ] Familiar face enrollment — camera recognition profiles
- [ ] Drone surveillance integration (patent-pending capability)
- [ ] Mobile push notifications via Web Push API
- [ ] EnergyHub export — utility billing integration

---

## Inspired By

Built on top of the **Alarm.com** capability model and extended with agentic AI:

**v1 foundations:**
- AI Deterrence (AID) · Remote Video Monitoring · Access Control
- EnergyHub PEMS · NILM load monitoring · Grid-interactive demand response
- Live 3D Digital Twin with sensor fusion (Three.js)
- NL Automation Builder (describe → Claude parses to structured rule)
- 6 autonomous AI agents with real-time trigger tracking

**v2 additions:**
- Service Provider Intelligence — the partner channel made AI-aware
- AI Resolution Rate (ARR) — the outcome-based pricing metric
- Commercial Property AI — shift-aware, multi-zone, role-hierarchy
- Domain Ontology — the shared knowledge graph across all ADC products
- EV + Grid Intelligence — GM EV partnership + dynamic load-shaping

---

## License

MIT License — see [LICENSE](LICENSE) for full text.

Copyright © 2026 Aegis Platform Contributors

---

## Contributing

Pull requests welcome. For major changes, open an issue first.

```bash
git checkout -b feature/your-feature
# make changes
git commit -m "feat: description"
git push origin feature/your-feature
# open pull request → v2 branch
```
