// Import Spot model
let Spot = require('../models/spot');

exports.get = (req, res) => {
  let query = req.query || {};

  Spot.apiQuery(query).find({}).sort({createdAt: '-1'}).limit(40)
    .then(spots => {
        res.json(spots);
    })
    .catch(err => {
        res.status(422).send(err.errors);
    });

};