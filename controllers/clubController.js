const User = require('../model/user');

const postClub = async (req, res) => {
  console.log(req.body);
  const foundUser = await User.findById(req.userId); // 댓글작성자
  console.log(foundUser);
};

module.exports = { postClub };
