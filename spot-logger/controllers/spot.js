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
        {$group: {_id: '$metal',spotPrice: { $last: "$spotPrice" }}}
    ]).then(spots => {
      spotPrices = spots.map(spot => {
        return {
          [spot._id]: spot.spotPrice
        }
      })
      res.json(spotPrices)
    })
    .catch(err => { res.status(422).send(err.errors) })
};
