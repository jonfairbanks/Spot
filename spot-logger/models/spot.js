const mongoose = require('mongoose');

const { Schema } = mongoose;

const spotSchema = new Schema({
  symbol: String,
  spotPrice: Number,
  currency: Number,
  updatedAt: Date,
  fetchedAt: { type: Date, default: Date.now },
}, { versionKey: false });

mongoose.model('spot', spotSchema);
