const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
  quantity: { type: Number, required: true, min: 0 },
  avgBuyPrice: { type: Number, required: true },
  totalInvested: { type: Number, default: 0 },
}, { timestamps: true });

holdingSchema.index({ user: 1, stock: 1 }, { unique: true });

module.exports = mongoose.model('Holding', holdingSchema);
