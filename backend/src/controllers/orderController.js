const Order = require('../models/Order');
const Stock = require('../models/Stock');
const Holding = require('../models/Holding');
const Trade = require('../models/Trade');
const User = require('../models/User');

const FEE_RATE = 0.001; // 0.1%

exports.placeOrder = async (req, res, next) => {
  try {
    const { stockId, type, quantity, orderType = 'MARKET', limitPrice } = req.body;
    const qty = parseInt(quantity, 10);
    if (!qty || qty < 1) {
      return res.status(400).json({ success: false, message: 'Invalid quantity' });
    }

    const stock = await Stock.findById(stockId);
    if (!stock || !stock.isActive) {
      return res.status(404).json({ success: false, message: 'Stock not found or inactive' });
    }

    const user = await User.findById(req.user._id);
    const execPrice = orderType === 'LIMIT' && limitPrice ? Number(limitPrice) : stock.currentPrice;
    const gross = execPrice * qty;
    const fees = Math.round(gross * FEE_RATE * 100) / 100;
    const total = type === 'BUY' ? gross + fees : gross - fees;

    if (type === 'BUY') {
      if (user.walletBalance < total) {
        return res.status(400).json({
          success: false,
          message: `Insufficient balance. Need ${total.toFixed(2)}, have ${user.walletBalance.toFixed(2)}`,
        });
      }
    } else {
      const holding = await Holding.findOne({ user: user._id, stock: stock._id });
      if (!holding || holding.quantity < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient shares. Have ${holding?.quantity || 0}, need ${qty}`,
        });
      }
    }

    // Create order
    const order = await Order.create({
      user: user._id,
      stock: stock._id,
      type,
      orderType,
      quantity: qty,
      price: execPrice,
      status: 'FILLED',
      filledQuantity: qty,
      totalAmount: total,
    });

    // Execute trade immediately (simplified matching)
    if (type === 'BUY') {
      user.walletBalance -= total;
      await user.save();

      let holding = await Holding.findOne({ user: user._id, stock: stock._id });
      if (holding) {
        const newQty = holding.quantity + qty;
        holding.avgBuyPrice = (holding.avgBuyPrice * holding.quantity + execPrice * qty) / newQty;
        holding.quantity = newQty;
        holding.totalInvested = holding.avgBuyPrice * newQty;
        await holding.save();
      } else {
        await Holding.create({
          user: user._id,
          stock: stock._id,
          quantity: qty,
          avgBuyPrice: execPrice,
          totalInvested: execPrice * qty,
        });
      }
    } else {
      // SELL
      user.walletBalance += total;
      await user.save();

      const holding = await Holding.findOne({ user: user._id, stock: stock._id });
      holding.quantity -= qty;
      holding.totalInvested = holding.avgBuyPrice * holding.quantity;
      if (holding.quantity <= 0) {
        await holding.deleteOne();
      } else {
        await holding.save();
      }
    }

    // Update stock volume
    stock.volume += qty;
    await stock.save();

    await Trade.create({
      order: order._id,
      user: user._id,
      stock: stock._id,
      type,
      quantity: qty,
      price: execPrice,
      amount: gross,
      fees,
    });

    const populated = await Order.findById(order._id)
      .populate('stock', 'symbol name currentPrice')
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: `${type} order filled at ${execPrice}`,
      data: populated,
      walletBalance: user.walletBalance,
    });
  } catch (e) { next(e); }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('stock', 'symbol name currentPrice')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, data: orders });
  } catch (e) { next(e); }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'Only pending orders can be cancelled' });
    }
    order.status = 'CANCELLED';
    await order.save();
    res.json({ success: true, data: order });
  } catch (e) { next(e); }
};
