const express = require('express');
const router = express.Router();
const tagsController = require('../controllers/tagsController');

router.route('/')
    .get(tagsController.getAllTags);

module.exports = router;