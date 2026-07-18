# ElevateeX — Next.js Setup Guide

## 📁 Project Structure
```
elevateeX/
├── app/
│   ├── layout.tsx        ← Root layout (fonts + theme provider)
│   ├── globals.css       ← All styles + dark/light CSS variables
│   ├── page.tsx          ← Main homepage
│   ├── login/
│   │   └── page.tsx      ← Login page
│   └── signup/
│       └── page.tsx      ← Signup page
├── components/
│   └── ThemeProvider.tsx ← Dark/Light mode context + toggle button
├── package.json
├── next.config.js
└── tsconfig.json
```

---

## 🚀 Step-by-Step Setup in VS Code

### Step 1 — Prerequisites install karo
Make sure ye installed hain:
- **Node.js** (v18 ya usse upar) → https://nodejs.org
- **VS Code** → https://code.visualstudio.com

Node version check karne ke liye terminal mein likho:
```bash
node -v
```
`v18.x.x` ya usse upar aana chahiye.

---

### Step 2 — Project folder VS Code mein kholein
1. Downloaded ZIP ko kisi jagah extract karo (e.g. `Desktop/elevateeX`)
2. VS Code kholein
3. **File → Open Folder** → `elevateeX` folder select karo
4. VS Code mein terminal kholein: **Terminal → New Terminal** (ya `Ctrl + `` `)

---

### Step 3 — Dependencies install karo
Terminal mein likho:
```bash
npm install
```
Thodi der mein `node_modules` folder ban jaayega. Iska matlab sab packages install ho gaye.

---

### Step 4 — Dev server chalao
```bash
npm run dev
```
Output kuch aisa aayega:
```
▲ Next.js 14.2.3
- Local: http://localhost:3000
```

---

### Step 5 — Browser mein dekho
Browser kholein aur jaao:
- **Homepage** → http://localhost:3000
- **Login** → http://localhost:3000/login
- **Signup** → http://localhost:3000/signup

---

## 🎨 Dark / Light Mode
- Top right navbar mein **sun/moon icon** hai
- Click karo — poori website ki theme change ho jaayegi
- Theme `localStorage` mein save hoti hai (refresh karne ke baad bhi yaad rakhega)

---

## 🎬 Background Video
Video URL already set hai in `app/page.tsx` line:
```ts
const VIDEO_URL = 'https://d8j0ntlcm91z4...'
```
Apna khud ka video use karna ho toh:
1. Video file `public/` folder mein rakho (e.g. `public/bg.mp4`)
2. `page.tsx` mein VIDEO_URL change karo:
```ts
const VIDEO_URL = '/bg.mp4'
```

---

## 🔗 Pages Connection
- Login page pe **"Create an account"** → `/signup` pe jaata hai
- Signup page pe **"Sign In"** → `/login` pe jaata hai
- Navbar ka **"Sign in"** button → `/login` pe jaata hai

---

## 🏗️ Production Build (deploy karne ke liye)
```bash
npm run build
npm run start
```

---

## ❓ Common Errors & Fix

| Error | Fix |
|-------|-----|
| `node: command not found` | Node.js install nahi hai, nodejs.org se install karo |
| `npm install` mein error | Delete `node_modules` and `package-lock.json`, phir dobara `npm install` |
| Port 3000 busy | `npm run dev -- -p 3001` likho |
| Font load nahi ho raha | Internet connection check karo (Google Fonts use ho raha hai) |

---

## 📦 Tech Stack
- **Next.js 14** — App Router
- **TypeScript** — Type-safe code
- **CSS Variables** — Dark/Light theming
- **React Hooks** — useState, useEffect, useContext
- **No extra libraries** — Pure CSS + React only

---

*Built for ElevateeX · Learn. Build. Elevate.*
