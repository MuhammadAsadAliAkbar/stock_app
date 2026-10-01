require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Stock = require('../models/Stock');

const stocks = [
  { symbol: 'OGDC', name: 'Oil & Gas Development', sector: 'Energy', currentPrice: 145.5, previousClose: 142.0, volume: 2500000, description: 'Leading oil & gas exploration company' },
  { symbol: 'HBL', name: 'Habib Bank Limited', sector: 'Banking', currentPrice: 98.25, previousClose: 100.1, volume: 1800000, description: 'Largest commercial bank' },
  { symbol: 'LUCK', name: 'Lucky Cement', sector: 'Cement', currentPrice: 785.0, previousClose: 770.5, volume: 450000, description: 'Major cement manufacturer' },
  { symbol: 'SYS', name: 'Systems Limited', sector: 'Technology', currentPrice: 425.75, previousClose: 418.0, volume: 320000, description: 'IT services & software' },
  { symbol: 'ENGRO', name: 'Engro Corporation', sector: 'Conglomerate', currentPrice: 312.4, previousClose: 315.0, volume: 890000, description: 'Diversified conglomerate' },
  { symbol: 'PSO', name: 'Pakistan State Oil', sector: 'Energy', currentPrice: 178.9, previousClose: 175.2, volume: 1100000, description: 'Oil marketing company' },
  { symbol: 'MCB', name: 'MCB Bank', sector: 'Banking', currentPrice: 185.6, previousClose: 182.3, volume: 650000, description: 'Private sector bank' },
  { symbol: 'TRG', name: 'TRG Pakistan', sector: 'Technology', currentPrice: 68.45, previousClose: 72.1, volume: 5200000, description: 'Business process outsourcing' },
  { symbol: 'NESTLE', name: 'Nestle Pakistan', sector: 'FMCG', currentPrice: 6850.0, previousClose: 6800.0, volume: 12000, description: 'Food & beverage' },
  { symbol: 'UBL', name: 'United Bank Limited', sector: 'Banking', currentPrice: 142.3, previousClose: 140.0, volume: 720000, description: 'Commercial banking' },
  { symbol: 'FCCL', name: 'Fauji Cement', sector: 'Cement', currentPrice: 22.85, previousClose: 23.1, volume: 9800000, description: 'Cement producer' },
  { symbol: 'MARI', name: 'Mari Petroleum', sector: 'Energy', currentPrice: 2150.0, previousClose: 2100.0, volume: 85000, description: 'Oil & gas exploration' },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Stock.deleteMany({});
  await User.deleteMany({});

  for (const s of stocks) {
    s.openPrice = s.previousClose;
    s.highPrice = Math.max(s.currentPrice, s.previousClose) * 1.02;
    s.lowPrice = Math.min(s.currentPrice, s.previousClose) * 0.98;
    s.change = Math.round((s.currentPrice - s.previousClose) * 100) / 100;
    s.changePercent = Math.round((s.change / s.previousClose) * 10000) / 100;
    s.marketCap = Math.round(s.currentPrice * 50000000);
    s.exchange = 'PSE';
  }
  await Stock.insertMany(stocks);
  console.log(`Seeded ${stocks.length} stocks`);

  await User.create({
    name: 'Admin Trader',
    email: 'admin@exchange.com',
    password: 'admin123',
    role: 'admin',
    walletBalance: 500000,
  });
  await User.create({
    name: 'Demo Trader',
    email: 'trader@exchange.com',
    password: 'trader123',
    role: 'trader',
    walletBalance: 100000,
  });
  console.log('Users: admin@exchange.com/admin123 | trader@exchange.com/trader123');
  process.exit(0);
}
seed().catch((e) => { console.error(e); process.exit(1); });
