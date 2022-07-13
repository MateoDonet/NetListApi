const express = require('express');
const router = express.Router();
const tiersController = require('../controllers/tiersController');

router.route('/')
    .get(tiersController.getAllTiers);

module.exports = router;