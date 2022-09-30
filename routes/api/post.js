const express = require('express');
const router = express.Router();
const postController = require('../../controllers/postController');
const verifyJWT = require('../../middleware/verifyJWT');
router.get('/all/:userId', postController.getAllPosts);
router.use(verifyJWT);
router.post('/register', postController.registerPost);

module.exports = router;
