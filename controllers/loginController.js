const jwt = require('jsonwebtoken');
const User = require('../model/user');
const bcrypt = require('bcrypt');

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('login');
  const foundUser = await User.findOne({ email });
  console.log(foundUser);
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
      { algorithm: 'HS256', expiresIn: '1d' }
    );
    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    // Creates Secure Cookie with refresh token
    // {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'None',
    //   maxAge: 24 * 60 * 60 * 1000,
    // }

    // res.cookie('jwt', refreshToken, {
    //   secure: true,
    //   sameSite: 'None',
    //   maxAge: 24 * 60 * 60 * 1000,
    // });
    res.cookie('jwt', refreshToken);
    res.cookie('userId', foundUser._id);
    res.status(200).json({ accessToken, userId: foundUser._id });
    // res.status(200).json({ accessToken, userId: foundUser._id });
  } else {
    res.status(403).json({ message: 'no authorization' });
  }
};

module.exports = { loginUser };
