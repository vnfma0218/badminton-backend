const express = require('express');
const router = express.Router();
const clubController = require('../../controllers/clubController');
const verifyJWT = require('../../middleware/verifyJWT');
router.post('/add-club', verifyJWT, clubController.postClub);

module.exports = router;
