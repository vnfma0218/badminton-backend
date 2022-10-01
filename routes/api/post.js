const express = require('express');
const router = express.Router();
const postController = require('../../controllers/postController');
const verifyJWT = require('../../middleware/verifyJWT');
router.get('/all', postController.getAllPosts);
router.use(verifyJWT);
router.post('/register', postController.registerPost);
router.delete('/delete/:postId', postController.deleteByPostId);
router.put('/update/:postId', postController.updatePostById);

module.exports = router;
