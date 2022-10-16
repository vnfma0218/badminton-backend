const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/commentController');
const verifyJWT = require('../../middleware/verifyJWT');

router.post('/:postId', verifyJWT, commentController.registerComment);
module.exports = router;
