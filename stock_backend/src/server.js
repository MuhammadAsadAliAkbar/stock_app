const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(helmet());
app.use(cors({ origin: ['https://stockfrontend-bice.vercel.app'], credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/stocks', require('./routes/stockRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));

// Python market simulator proxy
app.post('/api/market/tick', async (req, res) => {
  try {
    const url = process.env.PYTHON_SERVICE_URL;
    const response = await fetch(`${url}/simulate-tick`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {}),
    });
    const data = await response.json();
    // Optionally update DB prices
    if (data.success && data.updates) {
      const Stock = require('./models/Stock');
      for (const u of data.updates) {
        await Stock.findOneAndUpdate(
          { symbol: u.symbol },
          {
            currentPrice: u.price,
            change: u.change,
            changePercent: u.changePercent,
            highPrice: u.high,
            lowPrice: u.low,
            volume: u.volume,
          }
        );
      }
    }
    res.json(data);
  } catch {
    res.status(503).json({ success: false, message: 'Python market service unavailable' });
  }
});

app.get('/api/market/analytics', async (req, res) => {
  try {
    const url = process.env.PYTHON_SERVICE_URL;
    const response = await fetch(`${url}/analytics`);
    res.json(await response.json());
  } catch {
    res.status(503).json({ success: false, message: 'Python service unavailable' });
  }
});

app.get('/', (req, res) => res.json({ success: true, message: 'Stock Exchange API running' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Stock Exchange API on port ${PORT}`));
