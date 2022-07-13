const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.route('/authentificate')
    .post(usersController.isUser);

module.exports = router;