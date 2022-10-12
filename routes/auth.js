const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const verifyJWT = require('../middleware/verifyJWT');
router.post('/login', authController.loginUser);

router.get('/logout', verifyJWT, authController.logoutUser);

module.exports = router;
