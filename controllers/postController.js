const mongoose = require('mongoose');
const { RESULT_CODE } = require('../config/apiCode');

const Post = require('../model/post');
const User = require('../model/user');

const getAllPosts = async (req, res) => {
  console.log('get all');
  const { userId } = req.cookies;
  const id = mongoose.Types.ObjectId(userId);
  const foundUser = await User.findById(id);
  const postList = await Post.find().populate(
    'user',
    '-password -refreshToken'
  );
  const transformedPosts = postList.map((post) => {
    console.log(post.id);
    const myPostYn = post.user._id.toString() === foundUser._id.toString();

    return { ...post._doc, myPostYn, id: post.id };
  });

  res.status(200).json({ postList: transformedPosts });
};

const registerPost = async (req, res) => {
  const { userId } = req;
  const foundUser = await User.findOne({ _id: userId }).exec();
  if (foundUser) {
    const { content, title } = req.body;
    if (!content || !title)
      return res.status(200).json({
        resultCode: RESULT_CODE['notValid'],
        message: '유효하지 않은 입력이에요',
      });
    const createdPost = new Post({
      content,
      title,
      user: foundUser._id.toString(),
    });
    await createdPost.save();
    foundUser.posts.push(createdPost);
    await foundUser.save();
    res.status(200).json({ resultCode: RESULT_CODE['success'] });
  } else {
    res.stats(401);
  }
};

const deleteByPostId = async (req, res) => {
  const reqUser = await User.findById(req.userId);
  const { postId } = req.params;
  const foundedPost = await Post.findById(postId).populate('user');
  console.log(foundedPost);
  if (!foundedPost) {
    console.log('hello');
    return res.status(204).json({ message: 'already delete or not existing!' });
  }

  if (foundedPost.user._id.toString() === reqUser.id) {
    await Post.findByIdAndDelete(postId);
    foundedPost.user.posts.pull(foundedPost);
    await foundedPost.user.save();

    return res.status(200).json({ resultCode: RESULT_CODE['success'] });
  } else {
    return res.status(401).json({ resultCode: RESULT_CODE['unAuthorization'] });
  }
};

const updatePostById = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const reqUser = await User.findById(req.userId);
  const foundedPost = await Post.findById(postId);
  if (!foundedPost) {
    return res.status(204).json({ message: 'not existing!' });
  }

  if (foundedPost.user.toString() === reqUser.id) {
    console.log(content);
    await Post.findByIdAndUpdate(postId, { content });
    return res.status(200).json({ message: 'success' });
  } else {
    return res.status(401).json({ message: 'unAuthorization' });
  }
};

const getPostsByUserId = async (req, res) => {
  const { userId } = req.cookies;
};

module.exports = {
  getAllPosts,
  registerPost,
  deleteByPostId,
  updatePostById,
};
