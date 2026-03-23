# ⬡ Aegis
### Your Jarvis for Autonomous Energy & Guard Intelligence System

> A full-stack, AI-native smart property platform that unifies security, energy management, IoT sensors, and a live 3D Digital Twin into a single autonomous operating layer — powered by Claude AI agents.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/aegis)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## What is Aegis?

Aegis is not a security camera app. It is an **autonomous property intelligence platform** — the operating system for your home or business that continuously monitors, reasons, and acts across three domains simultaneously:

- **Security** — AI agents detect, deter, and escalate threats in real time across cameras, sensors, and access points
- **Energy** — Predictive Energy Management (PEMS) shifts loads, responds to grid pricing signals, and protects your security mesh during outages
- **Awareness** — A live 3D Digital Twin renders your physical property with real-time IoT sensor overlays, lighting heatmaps, and motion zones

Built on top of the Alarm.com capability model and extended with agentic AI, Aegis goes beyond monitoring — it acts.

---

## Live Demo

Deployed at: **[https://your-aegis-url.vercel.app](https://your-aegis-url.vercel.app)**

---

## Feature Overview

### 9 Navigation Tabs — All Fully Functional

| Tab | What it does |
|---|---|
| **Dashboard** | Live threat ring, stat tiles, camera grid, event feed, PEMS status banner, AI chat |
| **Cameras** | 6 animated canvas feeds with real-time AI bounding boxes, event clips, natural language video search |
| **Devices** | Full device inventory across Entry, Perimeter, Garage, Interior zones — toggle locks/doors live |
| **Agents** | 6 autonomous AI agents — toggle active/paused, view trigger counts and last-fired times |
| **Automations** | Trigger-based workflows + NL Automation Builder (describe in plain English → Claude parses to structured rule) |
| **Properties** | Multi-location management — Great Falls Residence, Shenandoah Cabin, Tysons Office |
| **EnergyHub** | PEMS dashboard — TOU pricing, load shedding, NILM alerts, battery/UPS gauge, 24h power chart, grid-interactive recommendations |
| **Digital Twin** | Live Three.js 3D building — Security / Energy / Combined view modes, drag-to-rotate, light zone controls |
| **Analytics** | Weekly heatmap, AI-generated intelligence summary, cross-property stats |
| **Settings** | Full platform config — AI sensitivity, TOU provider, NILM toggle, multi-property sync, agent auto-learning |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Aegis Platform                    │
├──────────────┬──────────────────┬───────────────────────┤
│   Security   │   Energy (PEMS)  │   Digital Twin        │
│   Mesh       │   Grid-Interactive│  Three.js 3D Scene   │
├──────────────┴──────────────────┴───────────────────────┤
│              Claude AI Agent Layer                       │
│  Deterrence · Perimeter · Access · Energy · RVM · Wellness│
├─────────────────────────────────────────────────────────┤
│              Zustand State Stores (persisted)            │
│  useDeviceStore · useAgentStore · useAutomationStore     │
├─────────────────────────────────────────────────────────┤
│              React 18 + TypeScript + Vite 5              │
└─────────────────────────────────────────────────────────┘
```

### State Management
All application state is managed by **Zustand** with `persist` middleware — device states, agent statuses, and automations survive page refreshes via `localStorage`. State is domain-sliced into three independent stores:

- `useDeviceStore` — 10 IoT devices across 4 zones
- `useAgentStore` — 6 AI agents with trigger counters
- `useAutomationStore` — configurable automation rules

### AI Layer
All Claude API calls are routed through `src/api/claude.ts` with dedicated context builders:

- `buildSecurityContext()` — injects live device state, agent status, and threat score
- `buildPEMSContext()` — injects TOU pricing, load totals, battery level, and PEMS mode
- `parseAutomation()` — NL → structured JSON automation rule parser

### Digital Twin (Three.js r128)
The 3D scene is built entirely with orthographic camera geometry:

- Semi-transparent glass walls (`MeshPhongMaterial`, opacity 0.22)
- 7 light zones with `PointLight` + animated floor halos
- 6 camera frustum cones with per-direction quaternion rotation
- 4 door sensor amber pulse rings
- 3 infrared motion heatmap zones
- Drag-to-rotate via mouse/touch with arc-orbit math
- Reactive energy layer — React state → `useRef` → Three.js animation loop (no remount)

### PEMS — Predictive Energy Management
Implements the full PEMS priority stack:

```
Priority order: Safety > Security > Energy Efficiency
```

- **NILM** (Non-Intrusive Load Monitoring) — electrical signature anomaly detection
- **TOU pricing** — real-time off-peak / mid-peak / on-peak window detection
- **Occupancy-intent logic** — Occupied → Arriving → Departing → Away state machine
- **Grid-down mode** — Security Mesh is `protected: true` and cannot be shed
- **UPS autonomy** — computed from battery % and current load draw

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI framework |
| TypeScript | 5.5.4 | Type safety |
| Vite | 5.4.2 | Build tool and dev server |
| Three.js | 0.128.0 | 3D Digital Twin rendering |
| Zustand | 4.5.4 | State management with persistence |
| React Router DOM | 6.26.2 | Client-side routing |
| date-fns | 3.6.0 | Date formatting utilities |

### AI & API
| Technology | Purpose |
|---|---|
| Anthropic Claude API | AI chat, NL automation parsing, PEMS advisor |
| claude-sonnet-4-20250514 | Default model for all agent interactions |
| `import.meta.env` | Secure API key injection via Vite environment variables |

### Infrastructure & Deployment
| Technology | Purpose |
|---|---|
| Vercel | Primary deployment target (zero-config Vite detection) |
| GitHub Actions | CI/CD pipeline — build + GitHub Pages deploy |
| Docker + nginx | Self-hosted container option |
| nginx 1.27 | Static file serving with SPA fallback, gzip, 1-year cache headers |

### Canvas & Visualization
| Technology | Purpose |
|---|---|
| HTML5 Canvas 2D | Camera feed simulation with AI bounding box overlays |
| Three.js WebGL | 3D orthographic Digital Twin scene |
| requestAnimationFrame | 10fps camera feeds, 60fps Three.js scene |

---

## Project Structure

```
aegis/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.tsx                    # Full single-file application (all 9 tabs)
│   ├── main.tsx                   # React DOM entry point
│   ├── vite-env.d.ts              # Vite environment type declarations
│   ├── theme.ts                   # Global dark design tokens (T object)
│   ├── types/
│   │   └── index.ts               # All TypeScript interfaces
│   ├── api/
│   │   ├── claude.ts              # Claude API wrapper + context builders
│   │   └── nlParser.ts            # NL → automation JSON parser
│   ├── store/
│   │   ├── useDeviceStore.ts      # IoT device state (Zustand + persist)
│   │   ├── useAgentStore.ts       # AI agent state (Zustand + persist)
│   │   └── useAutomationStore.ts  # Automation rules (Zustand + persist)
│   ├── hooks/
│   │   ├── useThreatScore.ts      # Reactive threat score computation
│   │   ├── useEscalation.ts       # Threshold-triggered escalation modal
│   │   └── usePEMS.ts             # TOU pricing + grid-interactive logic
│   └── utils/
│       └── formatters.ts          # kW, rate, time, percentage formatters
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Build check on every push
│       └── deploy.yml             # Auto-deploy to GitHub Pages + Docker Hub
├── index.html                     # App shell with dark background
├── package.json                   # Dependencies and build scripts
├── vite.config.ts                 # Vite config with ESM-safe path aliases
├── tsconfig.json                  # TypeScript config (strict: false for prototype)
├── vercel.json                    # Vercel build + SPA rewrite rules
├── Dockerfile                     # Multi-stage Node 20 → nginx build
├── nginx.conf                     # Production nginx with gzip + cache headers
├── docker-compose.yml             # Production + dev profiles
├── .env.example                   # Environment variable template
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 20+
- An Anthropic API key — get one at [console.anthropic.com](https://console.anthropic.com)

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/aegis.git
cd aegis

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Open .env and add your Anthropic API key:
# VITE_ANTHROPIC_API_KEY=sk-ant-api03-...

# 4. Start the dev server
npm run dev
# → http://localhost:3000
```

### Available Scripts

```bash
npm run dev        # Start Vite dev server with hot reload
npm run build      # Production build (output: dist/)
npm run preview    # Preview production build locally
npm run typecheck  # Run TypeScript type checking (does not block build)
npm run test       # Run Vitest unit tests
```

---

## Deployment

### Vercel (Recommended — zero config)

```bash
# Option A — Vercel CLI
npm i -g vercel
vercel
# Set VITE_ANTHROPIC_API_KEY in Vercel dashboard → Settings → Environment Variables

# Option B — GitHub integration
# Push to main → Vercel auto-detects Vite → deploys automatically
# vercel.json handles build command and SPA rewrites
```

### GitHub Pages (Free, auto on push to main)

```bash
git push origin main
# GitHub Actions workflow builds and deploys automatically
# Go to: GitHub repo → Settings → Pages → Source: GitHub Actions
```

Your live URL: `https://YOUR_USERNAME.github.io/aegis/`

### Docker (Self-hosted)

```bash
# Production (serves on port 8080)
docker-compose up aegis

# Development with hot reload (serves on port 3000)
docker-compose --profile dev up aegis-dev

# Build and push to Docker Hub (set secrets in GitHub → Settings → Secrets)
# DOCKERHUB_USERNAME + DOCKERHUB_TOKEN
# Triggered automatically on push to main via deploy.yml
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_ANTHROPIC_API_KEY` | **Yes** | — | Your Anthropic API key |
| `VITE_CLAUDE_MODEL` | No | `claude-sonnet-4-20250514` | Claude model override |
| `VITE_APP_NAME` | No | `Aegis` | App display name |
| `VITE_DEFAULT_LOCATION` | No | `Great Falls, VA` | Default property location |
| `VITE_ENABLE_DIGITAL_TWIN` | No | `true` | Toggle Digital Twin tab |
| `VITE_ENABLE_PEMS` | No | `true` | Toggle EnergyHub tab |
| `VITE_ENABLE_NL_AUTOMATIONS` | No | `true` | Toggle NL Automation Builder |

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore`. Always set your API key through your hosting provider's environment variable UI (Vercel, Netlify, etc.)

---

## AI Agents

Aegis ships with 6 pre-configured autonomous agents:

| Agent | Default Status | Trigger Count | Description |
|---|---|---|---|
| AI Deterrence | Active | Tracked | Delivers adaptive verbal warnings to detected intruders based on clothing and environment context |
| Perimeter Guard | Active | Tracked | Monitors all outdoor sensors and cameras 24/7, auto-escalates on motion |
| Smart Access Controller | Active | Tracked | Manages lock/unlock schedules, visitor access codes, and anomalous entry attempts |
| Energy Optimizer (PEMS) | Active | Tracked | Grid-interactive load management, TOU optimization, demand response |
| Remote Video Monitor | Active | Tracked | 24/7 AI video review — flags high-confidence human/vehicle events, suppresses false positives |
| Wellness Sentinel | Paused | Tracked | Tracks occupancy patterns and alerts trusted contacts on unusual inactivity |

Each agent is fully toggle-able from the Agents tab. The PEMS priority rule is enforced in the Energy Optimizer's system prompt: **Safety > Security > Energy Efficiency**.

---

## PEMS — Predictive Energy Management

The EnergyHub implements a full grid-interactive energy management stack:

### Operating Modes (Home & Enterprise profiles)

| Mode | Description |
|---|---|
| Comfort | Full comfort, cost-optimized scheduling |
| Off-Peak Optimization | Shift all deferrable loads to cheap windows |
| Away / After-Hours | HVAC setback, vampire load cuts |
| Deep Sleep | Minimum HVAC, security-only draw |
| Grid-Down | Security Mesh only — all comfort loads shed |

### Load Priority Classes

| Class | Example Loads | Shed-able? |
|---|---|---|
| Critical | Security Mesh, cameras, sensors | Never (protected) |
| Comfort | HVAC, smart lighting, appliances | Yes |
| Deferrable | EV charging, vampire loads | Yes (first to shed) |

### TOU Pricing Windows (Dominion Energy model)

| Window | Hours | Rate |
|---|---|---|
| Off-Peak | 9 PM – 6 AM, 9 AM – 3 PM | $0.08/kWh |
| Mid-Peak | 6–9 AM, 3–6 PM | $0.16/kWh |
| On-Peak | 6–9 PM | $0.32/kWh |

---

## Digital Twin — View Modes

| Mode | What's visible |
|---|---|
| Security | Camera FoV cones, door sensor amber pulses, motion heatmap zones |
| Energy | Light zone halos (color = efficiency), ceiling fixtures, optimization pulse rings |
| Combined | Both layers at reduced opacity — full situational awareness |

**Energy halo color coding:**
- Green = efficient (< 35% of max draw)
- Amber = moderate (35–65% of max draw)
- Red = high draw (> 65% of max draw)
- Pulsing amber ring = optimization savings available

---

## GitHub Secrets Required for CI/CD

Add in GitHub → Settings → Secrets and Variables → Actions:

| Secret | Purpose |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub image push |
| `DOCKERHUB_TOKEN` | Docker Hub authentication |

Add in GitHub → Settings → Variables → Actions:

| Variable | Value |
|---|---|
| `VITE_CLAUDE_MODEL` | `claude-sonnet-4-20250514` |

---

## Roadmap

- [ ] WebSocket layer for real device state sync
- [ ] React Router — each tab gets a shareable URL
- [ ] Familiar face enrollment UI (camera recognition profiles)
- [ ] Mobile push notifications via Web Push API
- [ ] Multi-tenant property management with role-based access
- [ ] Drone surveillance integration (patent-pending capability)
- [ ] Natural language Digital Twin queries ("show me where motion was detected last night")
- [ ] EnergyHub export — CSV/PDF billing reports

---

## Inspired By

Built on top of the **Alarm.com** capability model (security cameras, access control, AI deterrence, remote video monitoring, energy management) and extended with:

- Agentic AI architecture (Claude API)
- Natural language automation building
- Live 3D Digital Twin with sensor fusion
- Grid-interactive PEMS with NILM anomaly detection
- Occupancy-intent logic beyond binary motion sensing

---

## License

MIT License — see [LICENSE](LICENSE) for full text.

Copyright (c) 2026 Aegis Platform Contributors

---

## Contributing

Pull requests welcome. For major changes, open an issue first to discuss what you'd like to change.

```bash
git checkout -b feature/your-feature-name
# make changes
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
# open a pull request
```
