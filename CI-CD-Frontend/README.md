<p align="center">
  <img src="public/favicon.svg" alt="CloudOps Logo" width="80" height="80" />
</p>

<h1 align="center">CloudOps — CI/CD Orchestrator Dashboard</h1>

<p align="center">
  A modern, feature-rich CI/CD pipeline management dashboard built with React and Vite. Monitor pipelines, manage deployments, track repositories, and orchestrate your cloud infrastructure — all from a single, stunning interface.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Recharts-3.10-FF6384?logo=chart.js&logoColor=white" alt="Recharts" />
  <img src="https://img.shields.io/badge/React_Router-7.18-CA4245?logo=reactrouter&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture & State Management](#-architecture--state-management)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Production Build](#production-build)
- [Project Structure](#-project-structure)
- [Pages & Modules](#-pages--modules)
- [Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
- [Responsive Design](#-responsive-design)
- [Design System](#-design-system)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**CloudOps** is a comprehensive CI/CD orchestration dashboard that provides real-time visibility into your software delivery pipeline. It features a dark-themed, glassmorphic UI with smooth animations, interactive charts, live log streaming, and multi-cloud account management.

The dashboard is designed for DevOps engineers, platform teams, and engineering managers who need a centralized view of their CI/CD infrastructure, with zero clutter and a highly responsive design.

---

## ✨ Features

### Core Dashboard
- **📊 Real-time Stats Cards** — At-a-glance metrics for pipelines, deployments, repositories, and success rates with animated sparklines and circular progress indicators.
- **📈 Pipeline Runs Chart** — Interactive bar chart with toggleable legend items, time-range dropdown, and rich tooltips powered by Recharts.
- **🔄 Recent Pipelines** — Live feed of pipeline executions with status dots, branch info, and build numbers.
- **📜 Pipeline Activity Timeline** — Chronological activity feed with animated timeline dots and expandable entries.
- **🖥️ Live Logs Terminal** — Full-featured terminal emulator with syntax highlighting, search, stage filtering, fullscreen mode, and copy-to-clipboard.
- **🔍 Pipeline Details Inspector** — Deep-dive view with tabbed navigation (Stages, Logs, Artifacts, Deployment), horizontal flowchart, and vertical stage inspector.

### Infrastructure Management
- **🚀 Deployments** — Track deployment history, status, environments, and rollback capabilities.
- **🌍 Environments** — Manage production, staging, and development environments with health monitoring.
- **📦 Repositories** — Repository listing with branch info, provider badges, status indicators, and last-commit timestamps.
- **☁️ Cloud Accounts** — Multi-cloud management (AWS, Azure, GCP, DigitalOcean) with CPU/memory monitoring, sync, connect/disconnect, and cost tracking.

### Operations & Security
- **📊 Monitoring** — System performance monitoring with resource utilization metrics.
- **🔔 Alerts** — Configurable alert management with severity levels and notification channels.
- **📋 Audit Logs** — Comprehensive audit trail for compliance and security tracking.
- **🔐 Secrets Management** — Secure secrets and environment variable management.
- **👥 User Management** — Team member management with role assignments.
- **⚙️ Settings** — Application configuration, integrations, and preferences.

### UX & Design
- **🎨 Glassmorphic Dark Theme** — Premium dark UI with backdrop blur, subtle gradients, and glow effects.
- **✨ Micro-Animations** — Smooth transitions, hover effects, pulse animations, and entrance animations.
- **📱 Fully Responsive** — Seamless experience from 4K monitors down to mobile phones with collapsible sidebar drawer.
- **🔐 Role-Based Access** — Three-tier role system (Admin, Developer, Viewer) with dynamic navigation and route protection.
- **🔍 Global Search** — Keyboard-shortcut activated search bar (⌘K / Ctrl+K).
- **🔔 Notification Center** — Header notification dropdown with unread badges and mark-all-read.

---

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| [React](https://react.dev/) | UI Framework | 19.1 |
| [Vite](https://vitejs.dev/) | Build Tool & Dev Server | 6.0 |
| [React Router](https://reactrouter.com/) | Client-side Routing | 7.18 |
| [Recharts](https://recharts.org/) | Data Visualization & Charts | 3.10 |
| [Lucide React](https://lucide.dev/) | Icon Library | 1.27 |
| Vanilla CSS | Styling (Custom Properties, Animations) | — |

---

## 🏗 Architecture & State Management

The architecture of **CloudOps** is designed to be highly modular, clean, and easy to scale. Here is how the app manages its state and routing:

### 1. Global State (`RoleContext`)
We use React's Context API to manage the Role-Based Access Control (RBAC). 
- The `RoleProvider` (in `src/context/RoleContext.jsx`) wraps the entire application.
- It stores the `currentRole` (`Admin`, `Developer`, or `Viewer`) and provides a `setCurrentRole` function.
- Any component can access this state using the `useRole()` hook. This makes it trivial to hide/show buttons, routes, or sidebar links based on the user's role.

### 2. Routing (`react-router-dom`)
Routing is handled centrally in `src/App.jsx`.
- We use a `<ProtectedRoute>` wrapper component that checks the `currentRole` against an `allowedRoles` array. 
- If a user tries to access a page they don't have permission for, they are shown a `403 - Access Denied` screen.

### 3. Component Architecture
- **Page Components (`src/pages/`)**: These act as containers. They manage the specific data for that view (like fetching lists of repositories or pipelines) and compose smaller UI components.
- **UI Components (`src/components/`)**: These are highly reusable, stateless (or locally-stateful) UI blocks like `StatsCards`, `LiveLogs`, and `PipelineRunsChart`. They accept data via props.

### 4. CSS Strategy
We avoid heavy CSS frameworks to maintain complete control over the glassmorphic design.
- **`index.css`**: Defines global CSS variables (colors, spacing, shadows, radii) and keyframe animations.
- **Component-Level CSS**: Every component (e.g., `Header.jsx`) has a matching CSS file (`Header.css`) that uses these global variables, ensuring a perfectly consistent design system.
- **Responsive Design**: All CSS files follow a mobile-first or graceful degradation approach with standard media queries (`1200px`, `768px`, `576px`).

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** — v18.0 or higher ([Download](https://nodejs.org/))
- **npm** — v9.0 or higher (comes with Node.js)

Verify your installation:

```bash
node --version   # Should output v18.x or higher
npm --version    # Should output 9.x or higher
```

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/cicd-dashboard.git
cd cicd-dashboard
```

2. **Install dependencies:**

```bash
npm install
```

### Development

Start the development server with hot module replacement (HMR):

```bash
npm run dev
```

The app will be available at **`http://localhost:5173`** (default Vite port).

### Production Build

Build the optimized production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The production build will be output to the `dist/` directory.

---

## 📁 Project Structure

```
cicd-dashboard/
├── public/
│   ├── favicon.svg              # App favicon (SVG)
│   └── icons.svg                # Shared icon sprite
│
├── src/
│   ├── assets/                  # Static assets
│   │
│   ├── components/              # Reusable UI components
│   │   ├── Artifacts.jsx/.css       # Build artifacts display
│   │   ├── Deployment.jsx/.css      # Deployment status table
│   │   ├── Header.jsx/.css          # Top navigation header
│   │   ├── LiveLogs.jsx/.css        # Terminal log viewer
│   │   ├── PipelineActivity.jsx/.css # Activity timeline
│   │   ├── PipelineDetails.jsx/.css  # Pipeline inspector
│   │   ├── PipelineRunsChart.jsx/.css # Bar chart component
│   │   ├── RecentPipelines.jsx/.css  # Recent pipeline list
│   │   ├── Repositories.jsx/.css     # Repository cards
│   │   ├── Sidebar.jsx/.css         # Navigation sidebar
│   │   └── StatsCards.jsx/.css      # Metric stat cards
│   │
│   ├── context/
│   │   └── RoleContext.jsx      # Role-based access context (RBAC)
│   │
│   ├── pages/                   # Page-level container components
│   │   ├── AlertsPage.jsx/.css
│   │   ├── AuditLogsPage.jsx/.css
│   │   ├── DashboardPage.jsx/.css
│   │   ├── DeploymentsPage.jsx/.css
│   │   ├── EnvironmentsPage.jsx/.css
│   │   ├── LogsPage.jsx/.css
│   │   ├── MonitoringPage.jsx/.css
│   │   ├── PipelinesPage.jsx/.css
│   │   ├── RepositoriesPage.jsx/.css
│   │   ├── SecretsPage.jsx/.css
│   │   ├── SettingsPage.jsx/.css
│   │   └── UsersPage.jsx/.css
│   │
│   ├── App.jsx                  # Root app component & Route configurations
│   ├── App.css                  # App layout styles (Main grid layouts)
│   ├── index.css                # Global styles & CSS variables (Design System)
│   └── main.jsx                 # React entry point
│
├── index.html                   # HTML entry point
├── vite.config.js               # Vite configuration
├── package.json                 # Dependencies & scripts
└── README.md                    # This file
```

---

## 📄 Pages & Modules

| Page | Route | Description |
|------|-------|-------------|
| **Dashboard** | `/` | Main overview with stats, charts, pipelines, logs, and repositories |
| **Repositories** | `/repositories` | Manage connected repositories, branches, and providers |
| **Pipelines** | `/pipelines` | View and manage CI/CD pipeline configurations and runs |
| **Deployments** | `/deployments` | Track deployment history and manage releases |
| **Environments** | `/environments` | Configure and monitor deployment environments |
| **Logs** | `/logs` | Centralized log viewer with filtering and search |
| **Monitoring** | `/monitoring` | System health, performance metrics, and resource utilization |
| **Alerts** | `/alerts` | Alert rules, active incidents, and notification management |
| **Secrets** | `/secrets` | Secure management of API keys, tokens, and credentials |
| **Settings** | `/settings` | Application preferences, integrations, and configurations |
| **Users** | `/users` | Team member management and role assignments |
| **Audit Logs** | `/audit-logs` | Security and compliance audit trail |

---

## 🔐 Role-Based Access Control (RBAC)

The application implements a three-tier RBAC system that dynamically controls navigation visibility and route access using `RoleContext`.

| Feature | Admin | Developer | Viewer |
|---------|:-----:|:---------:|:------:|
| Dashboard | ✅ | ✅ | ✅ |
| Repositories | ✅ | ✅ | ✅ |
| Pipelines | ✅ | ✅ | ✅ |
| Deployments | ✅ | ✅ | ✅ |
| Environments | ✅ | ✅ | ❌ |
| Logs | ✅ | ✅ | ✅ |
| Monitoring | ✅ | ✅ | ✅ |
| Alerts | ✅ | ✅ | ✅ |
| Secrets | ✅ | ✅ | ❌ |
| Settings | ✅ | ❌ | ❌ |
| Users | ✅ | ❌ | ❌ |
| Audit Logs | ✅ | ❌ | ❌ |

> **💡 Tip:** You can quickly test permissions using the role switcher located at the bottom of the sidebar (click on the user profile card).

---

## 📱 Responsive Design

The dashboard is fully responsive across all screen sizes:

| Breakpoint | Target | Behavior |
|------------|--------|----------|
| `> 1200px` | Desktop / Large screens | Full sidebar, multi-column grids, all features visible |
| `769px – 1200px` | Tablet landscape | Reduced grid columns, condensed spacing |
| `577px – 768px` | Tablet portrait | Collapsible sidebar drawer, stacked layouts, simplified headers |
| `≤ 576px` | Mobile phones | Single-column layout, hidden search bar, touch-optimized controls |

### Key responsive features:
- **Collapsible sidebar** — Transforms into a slide-out drawer with backdrop overlay on mobile.
- **Hamburger menu** — Appears in the header on screens ≤ 768px.
- **Adaptive grids** — Stat cards, tables, and card layouts intelligently reflow from 4 → 2 → 1 columns.
- **Scrollable tables** — Data tables become horizontally scrollable via `overflow-x: auto` on narrow viewports to prevent layout breakage.

---

## 🎨 Design System

The application relies completely on native CSS custom properties for a unified and clean design system. All variables are defined in `index.css`.

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0a0e1a` | Page background |
| `--bg-secondary` | `#111827` | Secondary background |
| `--bg-card` | `#1a1f2e` | Card backgrounds |
| `--accent-blue` | `#3b82f6` | Primary accent, active states |
| `--accent-green` | `#22c55e` | Success states |
| `--accent-red` | `#ef4444` | Error/failure states |
| `--accent-purple` | `#a855f7` | Secondary accent |
| `--accent-cyan` | `#06b6d4` | Terminal highlights |

### Typography

- **Font Family:** Inter (Google Fonts) with system font fallbacks
- **Weights:** 300 (Light) through 700 (Bold)
- **Scale:** 11px – 28px across components

### Spacing & Radii

| Token | Value |
|-------|-------|
| `--radius-sm` | `6px` |
| `--radius-md` | `10px` |
| `--radius-lg` | `14px` |
| `--radius-xl` | `18px` |

---

## 🤝 Contributing

Contributions are welcome! If you want to improve this dashboard:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Style Guidelines

- **No Unused Code:** Keep components clean. Remove unused imports and redundant styles.
- **CSS Custom Properties:** Always use the defined CSS variables (`var(--accent-blue)`) instead of hardcoding colors.
- **Component Pattern:** Keep styling modular. `ComponentName.jsx` should only be styled by `ComponentName.css`.
- **Responsiveness:** Do not use generic wildcard selectors (e.g., `* { ... }`) in component CSS, as they break layouts globally. Ensure all new components are tested on mobile breakpoints.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by <strong>Sunny Kumar</strong>
</p>
