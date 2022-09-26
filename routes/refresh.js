const refreshController = require('../controllers/refreshController');

const express = require('express');
const router = express.Router();

router.get(refreshController.refreshToken);

module.exports = router;
