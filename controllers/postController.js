const mongoose = require('mongoose');

const Post = require('../model/post');
const User = require('../model/user');

const getAllPosts = async (req, res) => {
  console.log('get all');
  const { userId } = req.cookies;
  const id = mongoose.Types.ObjectId(userId);
  const foundUser = await User.findById(id);
  const postList = await Post.find().populate('user');
  const transformedPosts = postList.map((post) => {
    const myPostYn = post.user._id.toString() === foundUser._id.toString();

    return { ...post._doc, myPostYn };
  });

  console.log(transformedPosts);
  res.status(200).json({ postList: transformedPosts });
};

const registerPost = async (req, res) => {
  const { userId } = req;
  const foundUser = await User.findOne({ _id: userId }).exec();
  if (foundUser) {
    const { content } = req.body;
    const post = new Post({
      content,
      user: foundUser._id.toString(),
    });
    post.save();
  }

  res.status(200).json({ message: 'success' });
};

const deleteByPostId = async (req, res) => {
  const reqUser = await User.findById(req.userId);
  const { postId } = req.params;
  const foundedPost = await Post.findById(postId);

  if (!foundedPost) {
    console.log('hello');
    return res.status(204).json({ message: 'already delete or not existing!' });
  }

  if (foundedPost.user.toString() === reqUser.id) {
    await Post.findByIdAndDelete(postId);
    return res.status(200).json({ message: 'success' });
  } else {
    return res.status(401).json({ message: 'unAuthorization' });
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

module.exports = {
  getAllPosts,
  registerPost,
  deleteByPostId,
  updatePostById,
};
