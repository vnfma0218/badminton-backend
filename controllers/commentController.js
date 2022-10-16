const mongoose = require('mongoose');
const { RESULT_CODE } = require('../config/apiCode');

const Post = require('../model/post');
const User = require('../model/user');
const Comment = require('../model/comment');
const registerComment = async (req, res) => {
  console.log('registerComment');
  const { postId } = req.params;
  const { content } = req.body;
  const foundUser = await User.findById(req.userId);
  const foundPost = await Post.findById(postId);
  const comment = new Comment({
    content,
    user: foundUser._id.toString(),
    post: postId,
  });

  console.log('foundPost', foundPost);
  await comment.save();
  foundUser.comments.push(comment);
  foundPost.comments.push(comment);
  await foundUser.save();
  await foundPost.save();
  res
    .status(200)
    .json({ resultCode: RESULT_CODE['success'], message: '등록했어요' });
};

module.exports = {
  registerComment,
};
