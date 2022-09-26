const express = require('express');
const router = express.Router();
const { body, check } = require('express-validator');
const postController = require('../../controllers/postController');
router.get('/all', postController.getAllPosts);
router.post('/register', postController.registerPost);

module.exports = router;
