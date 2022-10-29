const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notificationController');
const verifyJWT = require('../../middleware/verifyJWT');
router.get('/all', verifyJWT, notificationController.getNotiByUserId);

module.exports = router;
