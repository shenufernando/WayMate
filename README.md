# 🌴 WayMate - Sri Lanka Travel Companion

**WayMate** is a modern full-stack web application designed to enhance the travel experience in Sri Lanka. It helps tourists and travelers discover top attractions, hire verified private vehicles and local drivers, book curated group tour packages, and plan custom travel itineraries using AI.

---

## 🚀 Features

- 🏛️ **Top Attractions:** Explore iconic travel destinations, historical landmarks, best visiting times, and entry fees.
- 🚗 **Private Vehicles & Drivers:** Browse verified drivers and vehicles (cars, vans, buses) with transparent daily rates.
- 🎒 **Group Tour Packages:** Book curated group tours managed by local tour operators.
- 🤖 **AI Trip Planner:** Generate personalized multi-day Sri Lanka itineraries based on preferences and budget.
- 🔐 **User Authentication & Profiles:** Secure registration, login, and user dynamic management.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** Next.js (App Router)
- **Library:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS

### **Backend**
- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Language:** JavaScript (ES6+)

### **Database & Authentication**
- **Database:** MongoDB
- **ODM:** Mongoose

### **Tools & Version Control**
- VS Code, Postman, Git, GitHub, npm

---

## 📂 Project Structure

```text
WayMate/
├── app/                  # Next.js App Router (Frontend)
│   ├── layout.tsx        # Global Layout & Metadata
│   ├── page.tsx          # Home Page
│   ├── user/             # Top Attractions / User Dashboard Page
│   ├── vehicles/         # Private Vehicles & Drivers Page
│   ├── tours/            # Group Tour Packages Page
│   └── ai-planner/       # AI Trip Planner Page
│
├── components/           # Reusable React UI Components
│   └── Navbar.tsx        # Responsive Navigation Bar
│
├── backend/              # Node.js + Express Backend API
│   ├── config/           # Database configuration (db.js)
│   ├── models/           # Mongoose schemas/models
│   ├── routes/           # Express API endpoints
│   ├── .env              # Environment variables
│   └── server.js         # Backend entry point
│
├── public/               # Static assets & icons
└── package.json          # Project dependencies & scripts
