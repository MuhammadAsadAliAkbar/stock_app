const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: { type: String, required: true },
  sector: { type: String, default: 'General' },
  exchange: { type: String, enum: ['PSE', 'KSE', 'NYSE', 'NASDAQ'], default: 'PSE' },
  currentPrice: { type: Number, required: true, min: 0 },
  openPrice: { type: Number, default: 0 },
  highPrice: { type: Number, default: 0 },
  lowPrice: { type: Number, default: 0 },
  previousClose: { type: Number, default: 0 },
  volume: { type: Number, default: 0 },
  marketCap: { type: Number, default: 0 },
  change: { type: Number, default: 0 },
  changePercent: { type: Number, default: 0 },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

stockSchema.index({ symbol: 1 });
stockSchema.index({ sector: 1 });

module.exports = mongoose.model('Stock', stockSchema);
