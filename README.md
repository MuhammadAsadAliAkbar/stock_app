# 📈 Stock Exchange Management System

Virtual stock exchange platform for paper trading with live price simulation.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | **Next.js 14** + TypeScript + Tailwind (dark theme) |
| Backend | **Node.js + Express + MongoDB** |
| Market Sim | **Python FastAPI** (price ticks & analytics) |

## Features

- User registration with **₨100,000** virtual wallet
- 12 PSE-style stocks (OGDC, HBL, LUCK, SYS, ENGRO, etc.)
- **Buy / Sell** market orders with 0.1% fee
- Portfolio with live P&L
- Order history & trade log
- Market watch (gainers, losers, volume)
- **Python market tick** simulator (random walk prices)
- Market sentiment analytics
- Admin role support

## Quick Start

### 1. Backend (Port 5003)
```bash
cd backend
npm install
npm run seed
npm run dev
```

**Demo accounts:**
- Trader: `trader@exchange.com` / `trader123`
- Admin: `admin@exchange.com` / `admin123`

### 2. Python Market Simulator (Port 8003)
```bash
cd python-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py
```

### 3. Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000**

## How to Trade

1. Login as demo trader
2. Go to **Market** → pick a stock → **Trade**
3. Choose BUY/SELL, enter quantity → Place order
4. Check **Portfolio** for holdings & P&L
5. Click **Simulate Tick** on Dashboard to move prices (needs Python service)

## Project Structure

```
stock-exchange-system/
├── backend/          # Express API (auth, stocks, orders, portfolio)
├── frontend/         # Next.js trading UI
├── python-service/   # Price simulation & analytics
└── README.md
```

## API Highlights

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/stocks | List all stocks |
| GET | /api/stocks/summary/market | Gainers, losers, volume |
| POST | /api/orders | Place BUY/SELL order |
| GET | /api/portfolio | Holdings + P&L summary |
| POST | /api/market/tick | Run Python price simulation |

---

Educational paper-trading system. No real money involved.
# stock_app
