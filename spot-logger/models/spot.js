const mongoose = require('mongoose');

const { Schema } = mongoose;

const spotSchema = new Schema({
  metal: String,
  spotPrice: Number,
  updatedAt: Date,
  createdAt: Date,
}, { versionKey: false });

mongoose.model('spot', spotSchema);
