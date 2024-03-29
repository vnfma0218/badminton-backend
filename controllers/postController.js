const mongoose = require('mongoose');
const { RESULT_CODE } = require('../config/apiCode');
const ObjectId = require('mongodb').ObjectId;
const Post = require('../model/post');
const User = require('../model/user');
const Comment = require('../model/comment');

const getAllPosts = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const { userId } = req.cookies;

  const id = mongoose.Types.ObjectId(userId);
  const foundUser = await User.findById(id);
  const postList = await Post.find()
    .populate('user', 'name')
    .populate('comments', 'content')
    .limit(limit)
    .skip(startIndex)
    .exec();
  const postTotalCnt = await Post.count();
  const transformedPosts = postList.map((post) => {
    const myPostYn = !foundUser
      ? false
      : post.user._id.toString() === foundUser._id.toString();

    return { ...post._doc, myPostYn, id: post.id };
  });

  res.status(200).json({
    resultCode: RESULT_CODE['success'],
    dataList: { postList: transformedPosts, totalCnt: postTotalCnt },
  });
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
      comments: [],
    });
    await createdPost.save();
    foundUser.posts.push(createdPost);
    await foundUser.save();
    res
      .status(200)
      .json({ resultCode: RESULT_CODE['success'], message: '글을 등록했어요' });
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
  const { content, title } = req.body;
  const reqUser = await User.findById(req.userId);
  const foundedPost = await Post.findById(postId);
  if (!foundedPost) {
    return res.status(204).json({ message: 'not existing!' });
  }

  if (foundedPost.user.toString() === reqUser.id) {
    console.log(content);
    await Post.findByIdAndUpdate(postId, { content, title });
    return res
      .status(200)
      .json({ message: 'success', resultCode: RESULT_CODE['success'] });
  } else {
    return res.status(401).json({ message: 'unAuthorization' });
  }
};

const getPostsByUserId = async (req, res) => {
  const { userId } = req.cookies;
};

const getPostById = async (req, res) => {
  console.log('getPostById');
  const { postId } = req.params;
  const post = await Post.findById(postId).populate('comments');
  const comments = await Comment.find({
    post: mongoose.Types.ObjectId(postId),
  }).populate('user', 'name');

  const { userId } = req.cookies;
  const foundUser = await User.findById(mongoose.Types.ObjectId(userId));

  const newComments = comments.map((c) => {
    return {
      ...c._doc,
      id: c._doc._id,
      isMine: c.user._id.toString() === foundUser?.id,
    };
  });

  console.log(comments);
  if (post) {
    res.status(200).json({
      post: {
        ...post._doc,
        comments: newComments,
        myPostYn: post.user._id.toString() === foundUser?.id,
      },
      // comments: trannformedComment,
    });
  }
};

module.exports = {
  getAllPosts,
  registerPost,
  deleteByPostId,
  updatePostById,
  getPostById,
};
