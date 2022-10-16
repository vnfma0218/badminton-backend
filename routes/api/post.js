const express = require('express');
const router = express.Router();
const postController = require('../../controllers/postController');
const verifyJWT = require('../../middleware/verifyJWT');
router.get('/all', postController.getAllPosts);
router.get('/:postId', postController.getPostById);
router.post('/register', verifyJWT, postController.registerPost);
router.delete('/:postId', verifyJWT, postController.deleteByPostId);
router.put('/:postId', verifyJWT, postController.updatePostById);

module.exports = router;
