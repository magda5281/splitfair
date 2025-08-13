# SplitFair 💸

A friendly, lightweight web app to **split expenses fairly** with friends. Add people, log what each person paid, then click **“Split it!”** to see who owes whom. You can **export** your data to JSON and **import** it back later.

> **Status:** early version / work-in-progress.

##

---

## 🌐 Live

## **Deployed on Vercel:** [https://splitfair.vercel.app](https://splitfair.vercel.app)

## ✨ Features

- Add users with tidy validation (no duplicates, clean names)
- Log expenses (payer, amount, description), auto-timestamped
- One-click settlement: compute a minimal set of “A pays B” transfers
- Import / Export JSON
  - Export a portable backup of users + expenses
  - Import from a file with validation & conflict handling
- Polished UI details  
  Floating labels, hover shimmer buttons, rounded custom scrollbars
- Accessible focus states, keyboard-friendly forms
- Toast notifications (success / info / error)
- Stable IDs using `crypto.randomUUID()`

---

## 🏗️ Architecture

- **Class-oriented core (OOP)**
  - Models: `User`, `Expense` (IDs via `crypto.randomUUID`, `toJSON()`; `Expense.fromJSON()` for imports)
  - Services: `UserService`, `ExpenseService`, `StorageService` manage state with in-memory `Map`s
- **DTOs at the edges:** export/import uses plain JSON objects returned by `toJSON()`—a clean boundary between app state and file format
- **UI layer:** vanilla JS modules (no framework). DOM wiring lives in `ExpenseUI` (forms, select, lists, toasts)
- **Validation layer (optional):** pure functions for names, UUIDs, amounts, timestamps—shared by services and import flow
- **Separation of concerns:** models (state/behavior) → services (business rules) → UI (render & events)
- **Testing:** Vitest + jsdom for models/services; DOM smoke tests for UI

---

## 🧠 How it works (high level)

- **UserService** — manages a `Map` of users (stored as `User` instances with `toJSON()`)
- **ExpenseService** — manages expenses and performs settlement logic
- **StorageService** — handles **export** (download JSON) and **import** (read file → parse → validate → insert)
- **ExpenseUI** — vanilla JS wiring for forms, lists, select boxes, and the Import/Export buttons (hidden file input pattern)

---

## 🧰 Tech Stack

- **Vite** (dev server & bundler)
- **Vanilla JavaScript**
- **Tailwind CSS** (+ `@tailwindcss/forms`) for styling
- **Toastify** for toasts
- **Vitest** (+ **jsdom**) for unit tests

---

## 🚀 Getting started

```bash
# 1) Install deps
npm install

# 2) Start dev server (http://localhost:3000)
npm run dev

# 3) Build for production
npm run build

# 4) Preview the production build locally
npm run preview

```

## 🧪 Testing

Vitest is configured with jsdom.

# Run all tests

npm test

# Watch mode

npm run test:watch

Optional: src/tests/setup.js stubs browser-only globals (e.g., toast helpers) and polyfills crypto.randomUUID if needed.

## 🖼️ App flow

Add user → appears in the “Who paid?” select

Add expense → listed under All expenses

Split it! → shows Who owes whom

Export → downloads expenses_YYYY-MM-DD.json

Import → choose a .json file to merge/restore data

## 📦 JSON export format

Exports include a version and timestamp so imports remain compatible.

{
"version": 1,
"exportedAt": "2025-08-12T14:12:42.135Z",
"users": [
{ "id": "262d2d20-d0cf-4b33-8733-e73424f241ad", "name": "Magda" }
],
"expenses": [
{
"id": "f4d8a1e0-6f8e-4f16-9a8f-0b2d1c7e3e8b",
"paidBy": "Magda",
"amount": 12.5,
"description": "Ice cream",
"timestamp": "2025-08-12T14:12:42.135Z"
}
]
}

# Notes

users[].name is the display name; id is a stable identifier

expenses[].paidBy currently references the payer by name (consider migrating to userId for robustness)

Timestamps are ISO-8601 UTC (YYYY-MM-DDTHH:mm:ss.SSSZ)

## 🎨 UI notes

Floating label pattern (adjacent-sibling selectors or Tailwind peer)

Shimmer hover on buttons via ::before + transform: translateX(...)

Custom scrollbar (WebKit) with rounded track & thumb; Firefox via scrollbar-width / scrollbar-color

Accessible colours & focus rings; subtle placeholder colour (OKLCH) for inputs
