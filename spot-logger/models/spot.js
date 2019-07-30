const mongoose = require('mongoose');
let mongooseStringQuery = require('mongoose-string-query');
const { Schema } = mongoose;

const spotSchema = new Schema({
  metal: String,
  spotPrice: Number,
  updatedAt: Date,
  createdAt: Date,
}, { versionKey: false });

spotSchema.plugin(mongooseStringQuery); // Enables query capabilities (e.g. ?foo=bar)

module.exports = mongoose.model('spot', spotSchema);
