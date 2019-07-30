const router = require('express').Router();
var Spot = require('../controllers/spot');

// Handle spot
router.get('/spots', Spot.get);

module.exports = router;