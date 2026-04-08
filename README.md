# Aegis v2 -- Autonomous Property Intelligence Platform

### Your Jarvis for Autonomous Energy & Guard Intelligence System

> **v2 extends Aegis v1 with four business-layer capabilities:** Service Provider Intelligence, AI Resolution Rate (ARR) Metrics, Commercial Property AI, and a Domain Ontology Explorer -- transforming Aegis from a proof-of-concept architecture into a full platform intelligence thesis.

[![Live Demo v1](https://img.shields.io/badge/Live%20Demo-v1-3b82f6)](https://aegis-five-theta.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Branch: aegis-v2](https://img.shields.io/badge/branch-aegis--v2-8b5cf6)](https://github.com/rajiv-AITech/AEGIS/tree/aegis-v2)

---

## Live Demos

| Version | URL | Deployment |
|---------|-----|------------|
| **v1** | [aegis-five-theta.vercel.app](https://aegis-five-theta.vercel.app) | React + Vite (main branch) |
| **v2** | Your Vercel URL after deploy | Static HTML (aegis-v2 branch) |

---

## v1 -> v2: The Progression

| | **Aegis v1** (`main`) | **Aegis v2** (`aegis-v2`) |
|---|---|---|
| **Focus** | Platform architecture proof-of-concept | Business intelligence + monetization layer |
| **Core question** | *Can AID, EnergyHub, and OpenEye be unified into a single AI layer?* | *How does that unification create measurable business value?* |
| **Deployment** | React 18 + TypeScript + Vite build | Single HTML file -- zero build step |
| **New in v2** | -- | SP Intelligence, ARR Metrics, Commercial AI, Domain Ontology, EV Grid |
| **Claude API** | Security context, PEMS advisor, NL Automation | + SP analysis, ARR insight, zone alert, ontology NL query |

---

## What is Aegis?

Aegis is not a security camera app. It is an **autonomous property intelligence platform** -- the AI-native operating system for intelligently connected properties. It unifies security, energy, and commercial intelligence into a single agent-powered layer built on top of the Alarm.com capability model.

**The core thesis:** AID, EnergyHub, OpenEye, and CHeKT are powerful point solutions operating in isolation. Each generates data. None share intelligence. The compounding opportunity is to build a shared intelligence layer -- a unified domain ontology, shared training pipelines, and cross-domain agentic workflows -- that transforms a portfolio of features into a platform moat.

---

## v2 Feature Deep-Dive

### 1. Service Provider Intelligence
*The partner channel made intelligent*

Alarm.com's model is SP-led: 10,000+ service providers are the delivery channel. v2 adds a **Partner AI Performance Dashboard** that makes fleet-wide AI resolution metrics visible to SP operators for the first time.

- Per-SP AI Resolution Rate, threat score, energy savings, RVM event count
- Tier classification: Standard -> Pro AI -> Enterprise AI
- **$71.2M incremental ARR opportunity** from 2,847 standard SPs meeting AI-tier criteria
- AI-tier monetization: prices **per outcome** (verified resolutions, energy savings) not per subscriber
- Claude integration: `spAnalysis()` -- real-time partner network recommendations

### 2. AI Resolution Rate (ARR) Metrics
*The outcome-based pricing proof point*

The single most important metric for an AI platform monetization strategy.

- **87.4% platform-wide ARR** vs 61% human-only baseline (26.4 point improvement)
- Full resolution funnel: 162,300 events -> 141,801 auto-resolved -> 18,200 escalated -> 2,100 dispatched
- ARR by agent: Energy Optimizer leads at 96.1%, Smart Access lowest at 79.8%
- **~$340M/yr addressable outcome premium** at $4/resolved event at current scale
- Live event log with real-time simulation
- Claude integration: `arrInsight()` -- executive business impact summary

### 3. Commercial Property Intelligence
*AI-native operations for the fastest-growing segment*

Commercial SaaS grew ~25% YoY to $80M+ in 2024. Commercial properties require fundamentally different AI:

- **Multi-Zone Threat Intelligence** -- 6 zones with real-time threat scores, AI Deterrence auto-engages on behavioral deviation
- **Shift-Aware Access Control** -- role x time x zone behavioral baseline; unknown badge triggers immediate deny + AI alert
- **24-Hour Shift Timeline** -- every automation, escalation, and energy decision with full context
- Claude integration: `commercialZoneAlert()` -- zone-specific incident response protocol

### 4. Domain Intelligence Ontology
*The hardest architectural problem -- now visible*

AID, EnergyHub, and OpenEye each built independent data models. The shared domain ontology is the translation layer enabling cross-domain intelligence.

- **13 node classes** across 4 domains: Property Types, Security, Energy, Behavioral Intelligence
- **847 property-type nodes** trained on 9.3M subscriber behavioral signals
- **3,241 entity relationships** across AID, EnergyHub, OpenEye, CHeKT
- **142 threat pattern types**, **89 energy profiles**
- Natural language query interface -- ask the knowledge graph in plain English
- Claude integration: `queryOntology()` -- NL reasoning across the ontology

### 5. EnergyHub + EV Grid Intelligence
*The GM partnership -- engineered*

- **Live EV SOC tracking** with charging optimization against TOU windows
- **GM partnership**: Chevy, GMC, Cadillac EVs + PowerBank storage enrolled in utility DR programs
- **PEMS priority stack**: Safety > Security Mesh (protected) > Energy Efficiency
- **2024 impact**: 2,000+ utility grid calls, 44 GWh peak demand shifted
- **Dynamic load-shaping**: AI-driven DER coordination across batteries, thermostats, EVs

---

## Full Tab Reference

| Tab | v1/v2 | What it does |
|-----|-------|--------------|
| **Dashboard** | v1 + v2 stats | Unified view, live intelligence feed, growth vectors, v2 module cards |
| **AI Agents** | v1 | 6 autonomous agents with ARR, trigger counts, live status |
| **Cameras** | v1 | Animated canvas feeds with AI bounding boxes |
| **EnergyHub + EV** | v1 + EV v2 | PEMS dashboard + EV fleet + GM partnership |
| **SP Intelligence** | **v2 NEW** | Partner AI performance, tier analysis, upgrade pipeline |
| **AI Resolution** | **v2 NEW** | ARR funnel, live event log, by-agent breakdown, business impact |
| **Commercial AI** | **v2 NEW** | Multi-zone threat, shift-aware access, 24hr timeline |
| **Domain Ontology** | **v2 NEW** | 13-node knowledge graph, NL query, node detail explorer |
| **Analytics** | v1 + v2 | Financial metrics, AI platform ROI model |

---

## AI Agent Inventory

| Agent | Status | ARR | Domain |
|---|---|---|---|
| AI Deterrence | Active | 91.2% | Security |
| Remote Video Monitor | Active | 88.7% | Security |
| Energy Optimizer (PEMS) | Active | 96.1% | Energy |
| Smart Access Controller | Active | 79.8% | Security |
| Perimeter Guard | Active | 84.3% | Security |
| Wellness Aegis | Paused | N/A | Safety |

**Platform-wide ARR: 87.4%** (vs 61% human-only baseline)

---

## Deployment

### v2 Branch -- Zero Build Step (Static HTML)

v2 is a single self-contained HTML file. No npm, no build pipeline, no TypeScript compilation. Vercel serves it directly as a static asset.

**Step 1 -- Push to Vercel**

```bash
git clone https://github.com/rajiv-AITech/AEGIS.git
cd AEGIS
git checkout aegis-v2
```

Only two files matter for deployment:
- `index.html` -- the entire application
- `vercel.json` -- instructs Vercel to skip the build

**Step 2 -- Configure Vercel project settings**

In Vercel dashboard -> Settings -> Build & Development Settings:
- **Framework Preset:** Other
- **Build Command:** (leave empty)
- **Output Directory:** `.` (single dot)
- **Install Command:** (leave empty)

**Step 3 -- Deploy**

```bash
git push origin aegis-v2
# Vercel auto-deploys -- no build log, instant static serve
```

**Why no build step?** v2 loads React 18 and Babel from CDN via `<script>` tags, then compiles JSX in the browser at runtime. This eliminates the entire Vite/TypeScript/esbuild pipeline while keeping the full React component model. The tradeoff is a ~2 second initial parse time vs a pre-built bundle.

---

## Claude API Setup

The AI features (ontology queries, SP analysis, zone alerts, ARR insights) require an Anthropic API key.

**In the live app:**
1. Click **"API Key"** button in the top-right header
2. Enter your key: `sk-ant-api03-...`
3. Click **Save** -- the key is stored in `localStorage` only, never transmitted anywhere except Anthropic's API

**Get a key:** [console.anthropic.com](https://console.anthropic.com)

**Model used:** `claude-sonnet-4-20250514`

The app is fully functional without a key -- all UI, simulations, and data are built-in. The API key only enables the live Claude responses in the four AI-powered panels.

---

## Architecture

```
Aegis v2 -- Static Architecture
+------------------------------------------+
|  index.html (single file, ~60KB)         |
+------------------+-----------------------+
|  React 18 (CDN)  |  Babel (CDN, runtime) |
+------------------+-----------------------+
|  9 Tab Components (all inline)            |
|  SP Intel - ARR - Commercial - Ontology  |  <- v2 NEW
|  Dashboard - Agents - Cameras - Energy   |  <- v1 core
+------------------------------------------+
|  Claude API (direct browser fetch)        |
|  SP Analysis - ARR Insight - Zone Alert  |
|  Ontology NL Query - Video Search        |
+------------------------------------------+
|  Vercel Static Hosting (zero build)       |
+------------------------------------------+
```

**v1 architecture (main branch):**
```
React 18 + TypeScript + Vite 5
Three.js Digital Twin (WebGL)
Zustand state management (persisted)
Claude API via server context builders
Docker + nginx self-host option
GitHub Actions CI/CD
```

---

## What Each File Does

```
aegis-v2 branch/
+-- index.html        # Entire Aegis v2 application (all tabs, all logic)
+-- vercel.json       # Vercel static config (no build command)
+-- README.md         # This file
+-- LICENSE           # MIT
```

That is the complete deployment. No `node_modules`, no `package.json`, no `src/`, no build artifacts needed.

---

## v1 vs v2 Technical Comparison

| Aspect | v1 (main) | v2 (aegis-v2) |
|--------|-----------|----------------|
| Build time | ~45s (Vite) | 0s (no build) |
| Bundle size | ~280KB gzip | ~16KB gzip |
| First load | ~200ms (pre-built) | ~2s (Babel parse) |
| TypeScript | Full type safety | Runtime JSX only |
| State | Zustand + localStorage | useState + localStorage |
| 3D Twin | Three.js WebGL scene | Link to v1 demo |
| Deployment | npm ci + vite build | Git push -> instant |
| Debugging | Source maps + TS errors | Browser DevTools |

v2 optimizes for **demonstration velocity** -- getting a live URL with all four new modules working in minutes, not hours of build debugging.

---

## Business Context

Aegis v2 demonstrates the AI platform intelligence thesis for the Alarm.com platform:

| Metric | Current | Target | AI Platform Impact |
|--------|---------|--------|--------------------|
| AI Resolution Rate | 87.4% | 95% | ~$30M additional ARR |
| SP AI-Tier Partners | 94 | 500+ | $71M incremental ARR |
| Outcome-based premium | -- | $4/event | ~$340M addressable |
| Data flywheel moat | Fragmented | Unified ontology | 10x model accuracy |

The domain ontology -- the shared knowledge graph across AID, EnergyHub, OpenEye, and CHeKT -- is the architectural investment that makes all four metrics compound.

---

## Roadmap

### v2 (current)
- [x] Service Provider Intelligence Dashboard
- [x] AI Resolution Rate funnel and live log
- [x] Commercial Property multi-zone AI
- [x] Domain Ontology knowledge graph + NL query
- [x] EV + Grid Intelligence with GM partnership

### v3 horizon
- [ ] WebSocket layer for real device state sync
- [ ] SP portal -- separate authenticated view for operators
- [ ] Ontology training pipeline -- nightly re-training from event stream
- [ ] ARR export -- CSV/PDF billing reports for SP invoicing
- [ ] Multi-tenant property management with role-based access
- [ ] Mobile push notifications via Web Push API
- [ ] Natural language Digital Twin queries
- [ ] Familiar face enrollment -- camera recognition profiles

---

## Inspired By

Built on top of the **Alarm.com** capability model:

**v1 foundations:** AI Deterrence (AID), Remote Video Monitoring, Access Control, EnergyHub PEMS, NILM load monitoring, Grid-interactive demand response, Live 3D Digital Twin (Three.js), NL Automation Builder, 6 autonomous AI agents

**v2 additions:** Service Provider Intelligence (partner channel), AI Resolution Rate (outcome-based pricing), Commercial Property AI (shift-aware, multi-zone), Domain Ontology (shared knowledge graph), EV + Grid Intelligence (GM EV partnership)

---

## License

MIT License -- see [LICENSE](LICENSE) for full text.

Copyright (c) 2026 Aegis Platform Contributors

---

## Contributing

```bash
git checkout -b feature/your-feature
# edit index.html directly -- no build step needed
# test by opening index.html in browser
git commit -m "feat: description"
git push origin feature/your-feature
# open pull request -> aegis-v2 branch
```
