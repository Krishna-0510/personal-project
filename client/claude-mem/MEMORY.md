# 🧠 Project Memory — Krishna Kirana Stores

## 📌 Project Overview

* Project: Krishna Kirana Stores (Full Stack Grocery System)
* Purpose: Digital grocery ordering system with WhatsApp-based order handling for shop owner (father)
* Tech Stack:

  * Backend: Node.js + Express
  * Database: MongoDB Atlas
  * Auth: Firebase (OTP + Google)
  * Frontend: React (pending)
  * Admin App: React Native (planned)
  * Messaging: Twilio WhatsApp

---

## 📊 Current Progress (05 April 2026)

### ✅ Completed

* Git workflow (branching, merging)
* Project setup (folders, .env, structure)
* MongoDB Atlas + 11 schemas (including PriceChangeLog)
* Backend API (routes, controllers, JWT middleware)
* Firebase Authentication (OTP + Google login)

### ⏳ Next

* Phase 5: Twilio WhatsApp integration

### 🔜 Pending

* React frontend (customer side)
* Admin mobile app (React Native)
* Realtime updates (polling + FCM)
* PWA setup
* Deployment (Vercel + Render)
* Security + testing

---

## ⚙️ Key Decisions

* Replaced AWS with free stack:

  * Render (backend), Vercel (frontend), Cloudinary (images)
* Admin dashboard replaced with **mobile app (React Native)**
* WhatsApp used for:

  * Accept/decline orders
  * Order status updates
* Admin app used for:

  * Price updates (with confirmation safety)
  * Analytics & logs
* Implemented **PriceChangeLog** for tracking price mistakes

---

## 🐞 Bugs & Fixes

* MongoDB password exposed → changed immediately
* Firebase private key leaked → revoked and secured
* .env and sensitive files added to `.gitignore`

---

## 🚀 Features Built

* Express server with full routing
* JWT authentication middleware
* Firebase auth integration
* Product, Order, Cart, Admin APIs
* Price change logging system
* Order lifecycle (place → cancel → status update)

---

## ❗ Pending Work

* Twilio WhatsApp integration (next step)
* Customer frontend (React pages)
* Admin mobile app
* Realtime notifications
* Deployment setup
* Security audit + testing

---

## 📁 Important Files

* server/index.js → main backend server
* server/config/db.js → MongoDB connection
* server/middleware/verifyToken.js → auth middleware
* server/models/* → all schemas
* server/routes/* → API endpoints
* server/controllers/* → business logic

---

## 🌿 Git Workflow Rules

* Never code directly on `main`
* Always create feature branches
* Merge only after full testing
* Never push `.env` or secrets

---

## 🔐 Security Notes

* All credentials stored in `.env`
* firebase-admin.json protected
* Sensitive files ignored in Git
* No keys shared publicly

---

## 💡 Notes for Future

* Always check branch before coding
* Test WhatsApp flow carefully (real-world impact)
* Focus on clean API design before frontend
* Keep logs for debugging real shop usage

---

## 🚀 Immediate Next Step

* Start Phase 5:

  * Setup Twilio account
  * Create WhatsApp webhook
  * Implement reply flow (1/2/3/4)
