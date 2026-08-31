# Client-side programming (ELTE 6. semester)

A modern, responsive Single-Page Application (SPA) built with **React, Redux Toolkit, and REST API integration**. 

Roomlie allows venue owners and guests to visualize room layouts with interactive game tables (Snooker, Air Hockey, Foosball), manage dynamic table placements via Drag & Drop, and handle reservations with role-based access control (Guest, User, Admin).

🔗 **Live Demo:** [https://roomline-v2-od-6-o6-w.vercel.app/](https://roomline-v2-od-6-o6-w.vercel.app/)

---

## 📸 Screenshots

| Interactive Room & Drag & Drop | Reservation & Admin Dashboard |
| :---: | :---: |
| ![Room View](docs/room_view.png) | ![Admin Dashboard](docs/admin_dashboard.png) |

---

## ✨ Key Features

### 🎮 Interactive Room & Table Management
* **Visual Room Layout:** Renders scalable room dimensions with precise $(x, y)$ coordinate-based table positions.
* **Table Types & Clearance Boundaries:**
  * **Snooker:** $190 \times 100\text{ px}$ (50 px clearance area).
  * **Air Hockey:** $140 \times 70\text{ px}$ (40 px clearance area).
  * **Foosball:** $120 \times 60\text{ px}$ (30 px clearance area).
* **Dynamic Visual Styling:** Table color saturation reflects condition/status ($1-10$ scale), and borders reflect category (Competition, Normal, Kids).
* **Clearance Collision Detection:** Visual cues alert users if a placement violates surrounding table clearances.
* **Drag & Drop Reordering:** Interactive table positioning with instant API position synchronization upon drop.

### 👥 Role-Based Access Control (RBAC)
* **Guest (Visitor):** Read-only overview of the active room layout, registration, and login.
* **Authenticated User:** Interactive table details view, real-time date/slot availability picker, and reservation booking (`pending` status tracking).
* **Administrator:** Full CRUD privileges (create, edit, delete tables, lock table movements) and reservation management (approve/decline requests).

### ⚡ State & Communication Architecture
* **State Management:** Centralized state with Redux Toolkit (auth sessions, room objects, reservation status).
* **Bearer Token Authentication:** Protected API endpoints secured with JWT tokens passed via Authorization headers.
* **UI Feedback:** Modal dialogs for adding/editing tables, and toast notifications for auth, booking, and CRUD events.

---

## 🛠️ Tech Stack

* **Frontend:** React 18+ (Vite), JavaScript (ES6+)
* **State Management:** Redux Toolkit / RTK Query
* **Styling & UI:** Modern Responsive CSS (Tailwind CSS / Component libraries), Dark/Light mode support
* **Backend API:** Hono REST API (Swagger-documented endpoints)
* **Deployment:** Vercel

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* npm

### Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/kuccerator/roomlie-react-app.git](https://github.com/kuccerator/roomlie-react-app.git)
   cd roomlie-react-app/client
