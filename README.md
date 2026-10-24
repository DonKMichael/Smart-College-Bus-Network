# 🚌 Smart College Bus Network (SCBN)

> An interactive role-based campus transportation management system and multi-bus fleet simulation with live telemetry, passenger manifests, and computer-networking diagnostics.

![SCBN Logo](public/scbn-logo.svg)

---

## ✦ Key Features

- **Multi-Role Workspaces**:
  - 🎒 **Student Workspace**: Select routes, mark "Waiting at Stop" or "I have boarded", track simulated bus ETAs, and submit emergency support tickets.
  - 🚌 **Driver Console**: Dedicated controls for assigned bus, trip starting/pausing, stop confirmations, live route queue, and priority broadcast feeds.
  - 🧑‍💼 **Transport Admin Control Centre**: Fleet overview across all 4 buses, simulate delays or telematic outages, issue emergency broadcasts, inspect full passenger manifests, and manage student reports.
- **Interactive Live Transit Map**:
  - Vector road network with road-following geometry, stop markers, zoom controls, full-screen canvas mode, and animated real-time bus position markers.
- **Connectivity Monitor & Diagnostics**:
  - Live top-bar connectivity pill (`Connected`, `Partial`, `Offline`) with simulated round-trip latency (`ms`), status dot, and `↻ Refresh Data` cycle.
  - Explanatory modal covering 6 fundamental computer-networking concepts:
    1. **Client–Server Architecture**
    2. **Request–Response Cycle**
    3. **Latency / Round-Trip Time (RTT)**
    4. **Polling & Live Updates**
    5. **Availability Monitoring**
    6. **Shared State & Data Integrity**
- **Safety & Alerts**:
  - Urgent emergency broadcasts with real-time acknowledgment logs and student safety help forms.
- **Theme & Presentation**:
  - Full Light and Dark themes, pre-populated with presentation demo values ("Use demo values" / "Clear demo values").

---

## 🚀 How to Host This Full Project on GitHub

You can host both the **source code** and the **live website for free** using **GitHub Pages** with the included automated GitHub Actions workflow (`.github/workflows/deploy.yml`).

### Step 1: Create a New Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Set a repository name (e.g., `smart-college-bus-network` or `scbn`).
3. Choose **Public** (recommended for free GitHub Pages hosting).
4. Do **not** initialize with a README, .gitignore, or license (they are already included).
5. Click **Create repository**.

### Step 2: Push Your Code to GitHub
Run the following commands in your terminal from the project folder:

```bash
# 1. Initialize git
git init -b main

# 2. Stage all project files
git add .

# 3. Commit the codebase
git commit -m "Initial commit: Smart College Bus Network"

# 4. Link your GitHub repository (replace with your GitHub username and repo name)
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

# 5. Push to GitHub
git push -u origin main
```

*(Tip: If you use GitHub Desktop or VS Code, you can also use "Publish to GitHub" with one click).*

---

### Step 3: Enable Free 1-Click Hosting (GitHub Pages)
1. In your GitHub repository, click on **Settings** (top tab).
2. On the left sidebar, click on **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. That's it! GitHub will automatically trigger the included workflow (`.github/workflows/deploy.yml`), build the site, and publish it.
5. In ~1 minute, your live URL will be ready at:
   ```
   https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/
   ```

---

## 💻 Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`

### Installation & Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start local dev server
npm run dev

# 3. Open browser at http://localhost:3000
```

### Production Build & Preview

```bash
# Build production bundle to /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 🛠️ Built With

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Hosting / CI/CD**: [GitHub Pages](https://pages.github.com/) + [GitHub Actions](https://github.com/features/actions)

---

## 📄 License
Apache-2.0
