const mongoose = require('mongoose');

const Post = require('../model/post');
const User = require('../model/user');

const getAllPosts = async (req, res) => {
  console.log('get all');
  const id = mongoose.Types.ObjectId(req.params.userId);
  const foundUser = await User.findById(id);
  const postList = await Post.find().populate('user');
  const transformedPosts = postList.map((post) => {
    const myPostYn = post.user._id.toString() === foundUser._id.toString();

    return { ...post._doc, myPostYn };
  });
  // const query = User.find({name:"Lalit"}).map(res => {

  //   console.log("loadedAt property set on the doc "
  //        + "to tell the time doc was loaded.")
  //   return res == null ? res : Object.assign(res,
  //        { loadedAt: new Date() });
  // });
  console.log(transformedPosts);
  res.status(200).json({ postList: transformedPosts });
};

const registerPost = async (req, res) => {
  const { userId } = req;
  console.log('userId', userId);
  const foundUser = await User.findOne({ _id: userId }).exec();
  console.log(foundUser);
  if (foundUser) {
    const { content } = req.body;
    const post = new Post({
      content,
      user: foundUser._id.toString(),
    });
    post.save();

    // post.save((err, document) => {
    //   foundUser.posts.push(document.id);
    //   if (err) return res.status(500).json({ message: '500 error' });
    // });
  }

  res.status(200).json({ message: 'success' });
};

module.exports = {
  getAllPosts,
  registerPost,
};
