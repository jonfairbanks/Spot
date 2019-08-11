const router = require('express').Router();
var Spot = require('../controllers/spot');

// Handle spot
router.get('/spots', Spot.get);
router.get('/spots/latest', Spot.getLatest);
router.get('/spots/week', Spot.getAggregateWeek);

module.exports = router;