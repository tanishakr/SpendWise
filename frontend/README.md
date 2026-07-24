# SpendWise 💸

A personal finance tracker built for Indian users — type your expenses the way you'd text a friend ("chai aur nashta 200 rupaye"), and AI handles the categorizing, insights, and budget tracking.

**Live demo:** [spend-wise-7x4b.vercel.app](https://spend-wise-7x4b.vercel.app)

## Why this project

Most finance apps don't handle Hinglish (code-mixed Hindi-English) input at all — you either type in stiff formal English or not at all. SpendWise uses Gemini to understand natural, everyday expense notes and turns them into structured, categorized data automatically.

AI is used meaningfully across three features, not as a single gimmick API call:
- **Categorization** — reads a Hinglish note and assigns it to the right spending category
- **Insights** — generates a plain-language summary of spending patterns
- **Anomaly detection** — flags unusually high transactions compared to your own spending history

## Features

- 🔐 JWT-based authentication (signup/login)
- 💬 Chat-style expense entry with AI categorization
- 📊 Dashboard with category breakdown, spending trend, and month-over-month comparison charts
- 🎯 Budgets with live, color-coded progress bars (green → amber → red)
- 📜 Searchable, filterable transaction history with inline editing
- ✨ AI-generated plain-language spending insights
- 🌗 Dark/light mode
- 📱 Fully responsive, mobile-friendly layout

## Tech stack

**Frontend:** React (Vite), Tailwind CSS v4, React Router, Recharts, react-hot-toast
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT + bcrypt
**AI:** Google Gemini API (`gemini-3.1-flash-lite`)
**Deployment:** Vercel (frontend + backend), MongoDB Atlas

## Project structure

spendwise/
├── backend/ # Express API, MongoDB models, Gemini integration
└── frontend/ # React app (Vite)

## API overview

| Method & Route | Auth | Purpose |
|---|---|---|
| POST /api/auth/signup | No | Create account |
| POST /api/auth/login | No | Log in |
| POST /api/transactions | Yes | Create expense (AI-categorized) |
| GET /api/transactions | Yes | Get all expenses |
| PUT /api/transactions/:id | Yes | Update an expense |
| DELETE /api/transactions/:id | Yes | Delete an expense |
| GET /api/insights | Yes | AI-generated spending summary |
| POST /api/budgets | Yes | Set/update a monthly budget |
| GET /api/budgets/:month | Yes | Get budgets with live progress |
| DELETE /api/budgets/:id | Yes | Delete a budget |

## Future scope

- Voice note entry (Whisper transcription)
- Multi-language support beyond Hinglish
- WhatsApp integration
- Recurring expense detection
- Export to PDF/CSV

