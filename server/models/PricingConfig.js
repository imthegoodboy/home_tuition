const mongoose = require('mongoose');

const pricingConfigSchema = new mongoose.Schema({
  classBase: {
    // store base monthly price per class as map: { '1': 5000, '6': 6000, ... }
    type: Map,
    of: Number,
    default: {}
  },
  discountPercent: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PricingConfig', pricingConfigSchema);
