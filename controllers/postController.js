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
    const { content } = req.body;
    const post = new Post({
      content,
      user: foundUser._id.toString(),
    });

    post.save((err, document) => {
      foundUser.posts.push(document.id);
      if (err) return res.status(500).json({ message: '500 error' });
    });
  }

  res.status(200).json({ message: 'success' });
};

module.exports = {
  getAllPosts,
  registerPost,
};
