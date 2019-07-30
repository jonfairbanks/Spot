// Import User model
let Spot = require('../models/spot');

// Create a new goal
exports.get = (req, res) => {
  query = req.query || {};

  Spot.apiQuery(query).find({})
    // limit the information returned (server side) – e.g. no password
    //.select('name email username admin')
    .then(spots => {
        res.json(spots);
    })
    .catch(err => {
        res.status(422).send(err.errors);
    });

};