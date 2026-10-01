const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
  type: { type: String, enum: ['BUY', 'SELL'], required: true },
  orderType: { type: String, enum: ['MARKET', 'LIMIT'], default: 'MARKET' },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }, // limit price or executed price
  status: {
    type: String,
    enum: ['PENDING', 'FILLED', 'PARTIAL', 'CANCELLED', 'REJECTED'],
    default: 'PENDING',
  },
  filledQuantity: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
}, { timestamps: true });

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ stock: 1, status: 1 });

module.exports = mongoose.model('Order', orderSchema);
