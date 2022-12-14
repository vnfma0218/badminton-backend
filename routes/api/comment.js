const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/commentController');
const verifyJWT = require('../../middleware/verifyJWT');

router.post('/:postId', verifyJWT, commentController.registerComment);
router.delete('/:commentId', verifyJWT, commentController.deleteCommentById);
router.put('/:commentId', verifyJWT, commentController.updateCommentById);
module.exports = router;
