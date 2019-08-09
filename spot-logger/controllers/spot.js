// Import Spot model
let Spot = require('../models/spot');

exports.get = (req, res) => {
    let query = req.query || {};
    Spot.apiQuery(query).find({}).sort({createdAt: '-1'})
    .then(spots => { res.json(spots) })
    .catch(err => { res.status(422).send(err.errors) })
};

exports.getLatest = (req, res) => {
    Spot.aggregate([
        {$match: {}},
        {$group: {
          _id: '$metal',
          spotPrice: { $last: "$spotPrice" }
        }}
    ]).then(spots => {
      
      spotPrices = spots.map(spot => {
        return {
          [spot._id]: spot.spotPrice
        }
      }).reduce(function(result, current) {
        return Object.assign(result, current);
      }, {})
      responseData = {prices: spotPrices, timestamp: Date.now()}
      res.json(responseData)
    })
    .catch(err => { console.log(err); res.status(422).send(err.errors) })
};
