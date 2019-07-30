// Import User model
let Spot = require('../models/spot');

// Create a new goal
exports.get = (req, res) => {
  let reqData = req.body.data

  Spot.find({})
    // limit the information returned (server side) – e.g. no password
    //.select('name email username admin')
    .then(spots => {
        res.json(spots);
    })
    .catch(err => {
        res.status(422).send(err.errors);
    });

};