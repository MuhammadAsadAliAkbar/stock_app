const Holding = require('../models/Holding');
const Trade = require('../models/Trade');
const User = require('../models/User');

exports.getPortfolio = async (req, res, next) => {
  try {
    const holdings = await Holding.find({ user: req.user._id })
      .populate('stock', 'symbol name currentPrice change changePercent sector');
    const user = await User.findById(req.user._id);

    let totalInvested = 0;
    let currentValue = 0;
    const items = holdings.map((h) => {
      const mkt = h.stock.currentPrice * h.quantity;
      const invested = h.avgBuyPrice * h.quantity;
      const pnl = mkt - invested;
      const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;
      totalInvested += invested;
      currentValue += mkt;
      return {
        _id: h._id,
        stock: h.stock,
        quantity: h.quantity,
        avgBuyPrice: h.avgBuyPrice,
        invested: Math.round(invested * 100) / 100,
        currentValue: Math.round(mkt * 100) / 100,
        pnl: Math.round(pnl * 100) / 100,
        pnlPercent: Math.round(pnlPct * 100) / 100,
      };
    });

    res.json({
      success: true,
      data: {
        holdings: items,
        summary: {
          walletBalance: user.walletBalance,
          totalInvested: Math.round(totalInvested * 100) / 100,
          currentValue: Math.round(currentValue * 100) / 100,
          totalPnL: Math.round((currentValue - totalInvested) * 100) / 100,
          totalPnLPercent: totalInvested > 0
            ? Math.round(((currentValue - totalInvested) / totalInvested) * 10000) / 100
            : 0,
          netWorth: Math.round((user.walletBalance + currentValue) * 100) / 100,
        },
      },
    });
  } catch (e) { next(e); }
};

exports.getTrades = async (req, res, next) => {
  try {
    const trades = await Trade.find({ user: req.user._id })
      .populate('stock', 'symbol name')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, data: trades });
  } catch (e) { next(e); }
};
