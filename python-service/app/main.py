from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random
import math

app = FastAPI(title="Stock Market Simulator", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# In-memory price state for simulation
MARKET = {
    "OGDC": {"price": 145.5, "prev": 142.0, "volume": 2500000, "high": 148.0, "low": 141.0},
    "HBL": {"price": 98.25, "prev": 100.1, "volume": 1800000, "high": 101.0, "low": 97.5},
    "LUCK": {"price": 785.0, "prev": 770.5, "volume": 450000, "high": 790.0, "low": 768.0},
    "SYS": {"price": 425.75, "prev": 418.0, "volume": 320000, "high": 430.0, "low": 415.0},
    "ENGRO": {"price": 312.4, "prev": 315.0, "volume": 890000, "high": 318.0, "low": 310.0},
    "PSO": {"price": 178.9, "prev": 175.2, "volume": 1100000, "high": 180.0, "low": 174.0},
    "MCB": {"price": 185.6, "prev": 182.3, "volume": 650000, "high": 187.0, "low": 181.0},
    "TRG": {"price": 68.45, "prev": 72.1, "volume": 5200000, "high": 73.0, "low": 67.0},
    "NESTLE": {"price": 6850.0, "prev": 6800.0, "volume": 12000, "high": 6900.0, "low": 6780.0},
    "UBL": {"price": 142.3, "prev": 140.0, "volume": 720000, "high": 144.0, "low": 139.0},
    "FCCL": {"price": 22.85, "prev": 23.1, "volume": 9800000, "high": 23.5, "low": 22.5},
    "MARI": {"price": 2150.0, "prev": 2100.0, "volume": 85000, "high": 2180.0, "low": 2090.0},
}


class TickRequest(BaseModel):
    volatility: float = 0.015  # 1.5% max move
    symbols: Optional[List[str]] = None


@app.get("/")
def root():
    return {"service": "Stock Market Simulator (Python)", "symbols": list(MARKET.keys())}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/simulate-tick")
def simulate_tick(body: TickRequest = TickRequest()):
    """Simulate one market tick – random walk price updates."""
    symbols = body.symbols or list(MARKET.keys())
    updates = []
    for sym in symbols:
        if sym not in MARKET:
            continue
        m = MARKET[sym]
        # Geometric-ish random walk
        change_pct = random.uniform(-body.volatility, body.volatility)
        new_price = round(m["price"] * (1 + change_pct), 2)
        if new_price < 0.5:
            new_price = 0.5
        m["high"] = max(m["high"], new_price)
        m["low"] = min(m["low"], new_price)
        vol_add = random.randint(1000, 50000)
        m["volume"] += vol_add
        change = round(new_price - m["prev"], 2)
        change_pct_val = round((change / m["prev"]) * 100, 2) if m["prev"] else 0
        m["price"] = new_price
        updates.append({
            "symbol": sym,
            "price": new_price,
            "change": change,
            "changePercent": change_pct_val,
            "high": round(m["high"], 2),
            "low": round(m["low"], 2),
            "volume": m["volume"],
        })
    return {"success": True, "updates": updates, "tick_count": len(updates)}


@app.get("/analytics")
def analytics():
    """Market analytics snapshot."""
    prices = [m["price"] for m in MARKET.values()]
    changes = [(m["price"] - m["prev"]) / m["prev"] * 100 if m["prev"] else 0 for m in MARKET.values()]
    gainers = sum(1 for c in changes if c > 0)
    losers = sum(1 for c in changes if c < 0)
    avg_change = sum(changes) / len(changes) if changes else 0
    total_vol = sum(m["volume"] for m in MARKET.values())
    top = sorted(
        [{"symbol": s, "changePercent": round((m["price"] - m["prev"]) / m["prev"] * 100, 2)} for s, m in MARKET.items()],
        key=lambda x: x["changePercent"],
        reverse=True,
    )
    return {
        "success": True,
        "data": {
            "symbols_tracked": len(MARKET),
            "advances": gainers,
            "declines": losers,
            "unchanged": len(MARKET) - gainers - losers,
            "avg_change_percent": round(avg_change, 3),
            "total_volume": total_vol,
            "top_gainers": top[:3],
            "top_losers": top[-3:][::-1],
            "sentiment": "Bullish" if avg_change > 0.3 else ("Bearish" if avg_change < -0.3 else "Neutral"),
        },
    }


@app.get("/price/{symbol}")
def get_price(symbol: str):
    sym = symbol.upper()
    if sym not in MARKET:
        return {"success": False, "message": "Symbol not found"}
    m = MARKET[sym]
    return {
        "success": True,
        "data": {
            "symbol": sym,
            "price": m["price"],
            "previousClose": m["prev"],
            "high": m["high"],
            "low": m["low"],
            "volume": m["volume"],
        },
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
