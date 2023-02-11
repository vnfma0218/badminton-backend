const jwt = require('jsonwebtoken');
const User = require('../model/user');
const bcrypt = require('bcrypt');
const { RESULT_CODE } = require('../config/apiCode');

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('login');
  const foundUser = await User.findOne({ email });
  // console.log(foundUser);
  if (!foundUser)
    return res.status(401).json({ message: '일치하는 이메일이 없습니다.' });
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser.id,
          role: 'user',
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { algorithm: 'HS256', expiresIn: '1d' }
    );
    const refreshToken = jwt.sign(
      {
        id: foundUser.id,
        role: 'user',
      },
      process.env.REFRESH_TOKEN_SECRET,
      { algorithm: 'HS256', expiresIn: '7d' }
    );
    foundUser.refreshToken = refreshToken;
    await foundUser.save();
    res.cookie('jwt', refreshToken);
    res.cookie('userId', foundUser._id);
    res.status(200).json({
      resultCode: RESULT_CODE['success'],
      accessToken,
      userId: foundUser._id,
      nickname: foundUser.name,
    });

    // Creates Secure Cookie with refresh token
    // {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'None',
    //   maxAge: 24 * 60 * 60 * 1000,
    // }
  } else {
    res.status(403).json({ message: 'no authorization' });
  }
};

const logoutUser = async (req, res) => {
  const foundUser = await User.findOne({ _id: req.userId });
  const result = await foundUser.update({ refreshToken: '' });
  // user의 토큰 없애고gkjf

  res.clearCookie('jwt');
  res.clearCookie('userId');

  // cookie 유저정보, 토큰 없앤다.

  return res
    .status(200)
    .json({ message: 'success', resultCode: RESULT_CODE['success'] });
};

module.exports = { loginUser, logoutUser };
