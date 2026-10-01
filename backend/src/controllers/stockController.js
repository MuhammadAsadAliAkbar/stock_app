const Stock = require('../models/Stock');

exports.getStocks = async (req, res, next) => {
  try {
    const { sector, search, sort = '-volume' } = req.query;
    const q = { isActive: true };
    if (sector) q.sector = sector;
    if (search) {
      q.$or = [
        { symbol: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }
    const stocks = await Stock.find(q).sort(sort);
    res.json({ success: true, data: stocks });
  } catch (e) { next(e); }
};

exports.getStock = async (req, res, next) => {
  try {
    const stock = await Stock.findOne({
      $or: [{ _id: req.params.id }, { symbol: req.params.id.toUpperCase() }],
    });
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not found' });
    res.json({ success: true, data: stock });
  } catch (e) { next(e); }
};

exports.createStock = async (req, res, next) => {
  try {
    const stock = await Stock.create(req.body);
    res.status(201).json({ success: true, data: stock });
  } catch (e) { next(e); }
};

exports.updateStock = async (req, res, next) => {
  try {
    const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not found' });
    res.json({ success: true, data: stock });
  } catch (e) { next(e); }
};

exports.getMarketSummary = async (req, res, next) => {
  try {
    const stocks = await Stock.find({ isActive: true });
    const gainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
    const losers = [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
    const mostActive = [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 5);
    const totalVolume = stocks.reduce((s, x) => s + x.volume, 0);
    const advances = stocks.filter((s) => s.change > 0).length;
    const declines = stocks.filter((s) => s.change < 0).length;
    res.json({
      success: true,
      data: { gainers, losers, mostActive, totalVolume, advances, declines, totalStocks: stocks.length },
    });
  } catch (e) { next(e); }
};
