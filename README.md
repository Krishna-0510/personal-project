<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:16a34a,100:22c55e&height=230&section=header&text=KRISHNA%20KIRANA%20STORES&fontSize=42&fontColor=ffffff&animation=twinkling&fontAlignY=32&desc=A%20Real%20Kirana%20Store.%20A%20Real%20Full-Stack%20Platform.&descAlignY=52&descSize=16"/>

<img src="https://komarev.com/ghpvc/?username=krishna-kirana-stores&label=Repo+Views&color=22c55e&style=flat-square"/>
<img src="https://img.shields.io/badge/Status-Live%20in%20Production-22c55e?style=flat-square&logo=vercel"/>
<img src="https://img.shields.io/github/last-commit/krishna-username/krishna-kirana-stores?style=flat-square&color=16a34a&label=Last%20Shipped"/>

<br/><br/>

<a href="#"><img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=24&duration=2500&pause=800&color=22C55E&center=true&vCenter=true&multiline=true&repeat=true&width=650&height=100&lines=%3E+npm+run+dev;%E2%9C%93+Store+is+live+at+localhost%3A5173;%E2%9C%93+10-page+storefront+%2B+admin+panel;%E2%9C%93+Zero-cost+OTP+%7C+Real+customers%2C+real+orders" alt="Typing SVG"/></a>

</div>

<br/>

<div align="center">
<img src="https://skillicons.dev/icons?i=react,vite,tailwind,nodejs,express,mongodb,firebase,figma,git,github&perline=10" />
</div>

<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:16a34a,100:22c55e&height=3&width=100%25"/>

## 🛒 What This Actually Is

Not a clone-tutorial project — a working e-commerce platform built for a **real kirana store**, currently handling real customers and real orders. Storefront, cart, checkout, order tracking, admin dashboard, and a native mobile admin app — all engineered and shipped solo.

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:22c55e,100:16a34a&height=3&width=100%25"/>

<br/>

## 🖥️ Live Demo Flow (simulated)

```
$ Admin logs in
  → OTP generated on backend, shown instantly on screen
  → No SMS. No WhatsApp API. No wait. ⚡ 0.2s

$ Customer checks out
  → Signs in with Google (1 click)
  → Enters mobile number (no OTP delay)
  → Order placed ✅ in under 10 seconds end-to-end

$ MongoDB Atlas
  → Order synced across 11 normalized schemas in real time
```

<br/>

## 📊 Engineering Snapshot

<div align="center">

| | |
|---|---|
| 🧩 **Frontend Pages** | 10 (React + Vite + Tailwind) |
| 🔌 **API Route Modules** | 5 (Express REST) |
| 🗄️ **Database Schemas** | 11 normalized (MongoDB Atlas) |
| 📱 **Mobile Screens** | 7 (React Native admin app) |
| 🔐 **Auth Cost** | ₹0 — self-generated OTP, no SMS/WhatsApp billing |
| ⚡ **Admin Login Time** | Instant (on-screen OTP vs. SMS delivery lag) |

</div>

<br/>

## 🧠 Why the Auth Design Is the Interesting Part

Most tutorials bolt on Firebase Phone Auth and call it done. This project actually evaluated Firebase Blaze billing, Twilio, MSG91, Fast2SMS, and WhatsApp Cloud API pricing — and made a deliberate call:

> **Admin login doesn't need to prove a stranger's identity — it needs a fast, secure second factor.** So the OTP is generated server-side and shown directly in the UI. Zero external cost, zero delivery lag, same security posture for the actual use case.

Customer-facing flows stay OTP-free by design too — a plain mobile-number field replaces SMS verification at checkout, cutting order-placement time without compromising what customers actually need (reachability for delivery, not cryptographic proof of phone ownership).

<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:16a34a,100:22c55e&height=3&width=100%25"/>

## 🏗️ Architecture at a Glance

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  React (Vite)    │ ───▶ │  Express REST API │ ───▶ │  MongoDB Atlas   │
│  Customer + Admin │      │  5 route modules  │      │  11 schemas      │
└─────────────────┘      └──────────────────┘      └─────────────────┘
        │                          │
        ▼                          ▼
┌─────────────────┐      ┌──────────────────┐
│  Firebase Auth    │      │  Custom JWT +     │
│  (Google Sign-In) │      │  On-screen OTP    │
└─────────────────┘      └──────────────────┘
        │
        ▼
┌─────────────────┐
│  React Native     │
│  Admin App (7 UI)  │
└─────────────────┘
```

<br/>

## 🚀 Quick Start

```bash
git clone https://github.com/krishna-username/krishna-kirana-stores.git
cd krishna-kirana-stores
npm install
npm run dev
```

Visit **`http://localhost:5173`** → browse as a customer, or head to `/login` as admin.

<br/>

## 🗺️ Build Progress

```
Storefront + Cart + Checkout     ████████████████████ 100%
Admin Panel + Zero-Cost OTP       ████████████████████ 100%
React Native Admin App            ████████████████████ 100%
Order Tracking (Orders/OrderDetail) ██████████████░░░░░░  70%
Customer Mobile-Number Popup       ████████████░░░░░░░░  60%
```

<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:16a34a,100:22c55e&height=3&width=100%25"/>

<div align="center">

### 🙋 Built & Maintained by Krishna Prajapati

<a href="https://github.com/krishna-username"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"/></a>
<a href="https://linkedin.com/in/your-linkedin"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/></a>
<a href="mailto:kp602552@gmail.com"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white"/></a>

<br/><br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:22c55e,50:16a34a,100:0f172a&height=150&section=footer"/>

</div>
