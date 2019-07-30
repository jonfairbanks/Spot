// Setup Dependencies
const express = require('express');
const mongoose = require('mongoose');
const logger = require('./services/logger');
const cron = require('node-cron');
const axios = require('axios');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const stoppable = require('stoppable');

require('dotenv').config();

// Setup Express
const port = process.env.PORT || 7000;
const app = express();
app.set('trust proxy', true);
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(cors());

// Setup Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGO_URI || 'mongodb://localhost/spot',
  {
    keepAlive: true,
    reconnectTries: 5,
    useNewUrlParser: true,
    useFindAndModify: false,
  },
);
require('./models/spot');
const Spot = mongoose.model('spot');

// Poll for new spot price data every 1 minute
cron.schedule('* * * * *', () => {
  logger.info("\nSpot prices as of " + Date.now() + "...");
  let metals = ['gold', 'silver', 'platinum', 'palladium'];
  metals.forEach(metal => {
    let endpoint = 'https://www.apmex.com/spotprice/gethistoricalchart?metalname=' + metal + '&_=' + Date.now();
    axios.get(endpoint)
    .then(resp => {
      // Log current prices
      let price_data = resp.data['chartdata'].slice(-1)[0];
      let updatedAt = price_data[0];
      let createdAt = Date.now();
      let spotPrice = price_data[1];
      logger.info(metal.toUpperCase() + ': $' + spotPrice + " USD");

      // Save current prices to database
      const itemToBeSaved = { metal, spotPrice, updatedAt, createdAt };
      const item = new Spot(itemToBeSaved);
      item.save()
      .then(console.log(metal.toUpperCase() + " price saved to DB @ " + Date.now()))
      .catch((err) => console.log("Failed to save " + metal + " to the database: " + err));
    })
    .catch(err => console.log("There was an error getting Spot prices: " + err));
  });
});

// Health check endpoint
app.get('/status', (req, res) => {
  return res.status(200).send('OK');
});

// Launch the app with stoppable
stoppable(app.listen(port, () =>
  console.log(`spot-logger is running on port ${port}!\n`),
), 10000);
