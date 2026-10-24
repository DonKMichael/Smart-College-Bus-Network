# 🚌 Smart College Bus Network (SCBN)

> An interactive, role-based campus transportation management system featuring a multi-bus fleet simulation, live transit visualization, passenger manifests, emergency communication, and computer-networking diagnostics.

<p align="center">
  <img src="public/scbn-logo.svg" alt="Smart College Bus Network Logo" width="180" />
</p>

<p align="center">
  <strong>Smarter Campus Transportation · Connected Journeys · Safer Travel</strong>
</p>

---

## 📖 About the Project

**Smart College Bus Network (SCBN)** is a browser-based campus transportation management application designed to demonstrate how students, drivers, and transport administrators can coordinate bus operations through a unified digital platform.

The application simulates a fleet of four buses travelling along predefined routes toward a shared college gate. It provides role-specific dashboards, simulated bus telemetry, passenger boarding information, arrival estimates, emergency communication, and a connectivity monitoring interface.

SCBN also demonstrates fundamental computer-networking concepts through an interactive connectivity monitor, making it useful as an educational project combining web development, transportation workflows, and networking principles.

## ✨ Key Features

### 👥 1. Role-Based Workspaces

The application provides three dedicated workspaces with different responsibilities.

**🎒 Student Workspace**
- Select a bus route and boarding stop.
- View bus status and simulated estimated arrival times.
- Mark the student as waiting at a stop or boarded.
- View relevant bus information on the live transit map.
- Submit assistance requests for missed buses, delays, stop-related issues, or safety concerns.
- Receive relevant emergency broadcasts.

**🚌 Driver Console**
- View information for the assigned bus.
- Start or pause simulated trips.
- Confirm stops and view upcoming stops along the route.
- Monitor students waiting at stops ahead.
- Receive emergency broadcasts and relevant operational information.

**👨‍💼 Transport Administrator Control Centre**
- Monitor the four-bus fleet from a unified dashboard.
- Inspect passenger manifests for each bus.
- View boarded passengers and students waiting at stops.
- Simulate bus delays and telematics outages.
- Send emergency broadcasts.
- Review student assistance requests and reports.
- Load or clear demonstration data.

### 🗺️ 2. Interactive Live Transit Map

- Visualize the road network and predefined bus routes.
- Display bus markers with unique identifiers.
- Simulate bus movement along route geometry.
- Show bus stops and the shared college-gate destination.
- Use zoom controls to inspect routes.
- Expand the map into full-screen mode.
- Focus on a selected route or bus where supported by the interface.

### 📡 3. Connectivity Monitor & Networking Diagnostics

The connectivity monitor demonstrates essential networking concepts through a dedicated status indicator and explanatory interface.

**Monitoring features**
- Connection states: `Connected`, `Partial`, and `Offline`.
- Simulated round-trip latency measurements in milliseconds.
- A refresh control for demonstrating request-response activity.
- Connection status and refresh information.
- An explanation of the distinction between a bus being offline and the application connection being unavailable.

**Computer-networking concepts**
1. **Client-Server Architecture** — how clients and servers exchange information.
2. **Request-Response Cycle** — how a request is sent and a response is received.
3. **Latency and Round-Trip Time (RTT)** — how communication delay can be measured.
4. **Polling and Live Updates** — how applications periodically refresh information.
5. **Availability Monitoring** — how connection status can be represented.
6. **Shared State and Data Integrity** — how consistent application data supports multiple views.

> **Important:** Bus movement, latency values, and connectivity states are simulated for demonstration purposes. They do not necessarily represent actual GPS positions, physical bus telemetry, or real network measurements.

### 👥 4. Passenger Manifest Management

- Organize passenger information by bus.
- Display boarded and waiting students.
- Present upcoming-stop information for drivers.
- Allow students to update their boarding status.
- Provide administrators with a fleet-wide passenger overview.

### 🚨 5. Emergency Communication & Student Safety

- Allow students to submit assistance requests.
- Support scenarios involving missed buses, delays, stop-related issues, and safety concerns.
- Enable administrators to issue emergency broadcasts.
- Present relevant emergency information to students and drivers.
- Provide administrative visibility into submitted reports and acknowledgement information where implemented.

### 🎨 6. User Interface & Demonstration Controls

- Light and dark presentation themes.
- Role-specific navigation and dashboards.
- Interactive status indicators and information cards.
- Demonstration controls for loading and clearing sample data.
- Sample buses, passengers, reports, and operational scenarios for presentations.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| **React** | Component-based user interface |
| **TypeScript** | Typed application development |
| **Vite** | Development server and production build tooling |
| **HTML** | Web application structure |
| **CSS** | Layout, styling, themes, and responsive presentation |
| **JavaScript** | Application interactions and simulation logic |
| **GitHub** | Source code hosting and version control |
| **GitHub Pages** | Potential static website hosting |

The project's exact dependencies and available commands are defined in `package.json`.

## 🏗️ Application Architecture

SCBN is organized around the following functional areas:

| Component | Responsibility |
|---|---|
| **Presentation Layer** | Dashboards, navigation, map, tables, and status indicators |
| **Role-Based Interface** | Student, driver, and administrator workspaces |
| **Transportation Simulation** | Bus routes, simulated movement, arrival estimates, and trip status |
| **Passenger Management** | Boarding information, passenger manifests, and waiting students |
| **Communication Layer** | Notifications, assistance requests, and emergency broadcasts |
| **Diagnostics Layer** | Simulated connectivity, latency, and request-response demonstrations |

The architecture describes the application's functional organization. It does not imply that a production backend, real GPS infrastructure, or live vehicle tracking service is configured.

---

## 🚀 Running the Project Locally

### Prerequisites

Install the following tools:

- [Node.js](https://nodejs.org/)
- npm, included with Node.js
- [Git](https://git-scm.com/) (optional)

### Installation

**1. Clone the repository**

Replace `REPOSITORY-NAME` with the actual repository name.

```bash
git clone https://github.com/DonKMichael/REPOSITORY-NAME.git
```

**2. Navigate to the project directory**

```bash
cd REPOSITORY-NAME
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

Open the local URL printed in the terminal. With the default Vite configuration, it is commonly:

`http://localhost:5173/`

**5. Build the production version**

```bash
npm run build
```

Vite normally generates the production files in the `dist/` directory.

**6. Preview the production build**

```bash
npm run preview
```

These commands assume that the corresponding scripts are available in `package.json`.

---

## 🌐 Live Demo

**Application:** Add your deployed website URL here once deployment is complete.

The source code is maintained in this GitHub repository. The live demo URL, when available, will provide access to the deployed application separately from the repository's documentation.

---

## 🔐 Security, Data & Limitations

- The application is designed as an interactive demonstration and educational project.
- Simulated bus locations, arrival estimates, connectivity measurements, and sample passenger records should not be treated as verified operational data.
- Browser-based role selection alone is not a substitute for secure authentication and server-side authorization.
- Data persistence and sharing depend on the application's implemented state-management and storage mechanisms.
- A production deployment should use appropriate authentication, protected APIs, secure data storage, and validated transportation information.
- Never commit passwords, API keys, private credentials, or secrets to a public repository.

---

## 🎯 Project Objectives

- Demonstrate role-based web application development.
- Model campus transportation workflows.
- Simulate a multi-bus fleet and passenger boarding process.
- Visualize bus routes, arrival estimates, and operational status.
- Demonstrate emergency communication and reporting workflows.
- Explain fundamental computer-networking concepts through an interactive interface.
- Provide a foundation for future integration with real transportation systems.

## 🔮 Future Enhancements

Potential improvements include:

- Real-time GPS integration for physical buses.
- Backend authentication and role-based authorization.
- Database-backed passenger, route, and report management.
- Real-time notifications and emergency alerts.
- Integration with live network monitoring services.
- Automated testing and continuous deployment.
- Improved accessibility and mobile responsiveness.

---

## 👨‍💻 Author

**DonKMichael**

GitHub: [@DonKMichael](https://github.com/DonKMichael)

---

## 📄 License

No license is specified in this README. Refer to the repository's `LICENSE` file if one is present. If no license has been added, the project should not be assumed to be available for unrestricted reuse.

---

<p align="center">
  🚌 <strong>Smart College Bus Network</strong>
  <br />
  <em>Connecting students, drivers, and campus transportation through technology.</em>
</p>
