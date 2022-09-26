const Post = require('../model/post');
const User = require('../model/user');

const getAllPosts = async (req, res) => {
  console.log('all posts');
};

const registerPost = async (req, res) => {
  console.log(req.email);
  const foundUser = await User.findOne({ email: req.email }).exec();
  console.log(foundUser);
  if (foundUser) {
    // content, user 정보와 함께 post를 save하기

    const { content } = req.body;
    console.log(content);
  }

  res.status(200).json({ message: 'success' });
};

module.exports = {
  getAllPosts,
  registerPost,
};
