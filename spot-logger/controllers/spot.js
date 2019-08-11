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

exports.getAggregateWeek = (req, res) => {
  Spot.aggregate([
    {
      "$match": {
          "dateDay": { "$exists": true, "$ne": null }
      }
    },
    { $group : {
      "_id": {
        "day": "$dateDay",
        "metal": "$metal"
      },
      "day": {"$last": "$dateDay"},
      "metal": {"$last": "$metal"},
      "spotPrice": {"$last": "$spotPrice"}
    }},
    { $sort: { day: 1 } },
    {$project: {
      day: {$toString: "$day"}, metal: 1, spotPrice: 1
    }},
    { $group : {
      "_id" : {
        "metal": "$metal"
      },
      "metal": {"$last" : "$metal"},
      "data": {"$push": {"day": "$day", "spotPrice": "$spotPrice"}}     
    }},
    { $project : {
      _id : 0,
    }},
    {
      $replaceRoot: {
        newRoot: {
          $arrayToObject: [
            [
              {
                k: "$metal",
                v: "$data"
              }
            ]
          ]
        }
      }
    }


  ]).then(spots => {
    let combinedSpots = {}
    spots.map(spot => {
      Object.assign(combinedSpots, spot)
    })
    //console.log(combinedSpots)
    res.json(combinedSpots)
  })
  .catch(err => { console.log(err); res.status(422).send(err.errors) })
};
