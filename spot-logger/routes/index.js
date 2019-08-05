const router = require('express').Router();
var Spot = require('../controllers/spot');

// Handle spot
router.get('/spots', Spot.get);
router.get('/spots/latest', Spot.getLatest);

module.exports = router;