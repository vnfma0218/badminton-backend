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
          email: foundUser.email,
          role: 'user',
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { algorithm: 'HS256', expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
      {
        email: foundUser.email,
        role: 'user',
      },
      process.env.REFRESH_TOKEN_SECRET,
      { algorithm: 'HS256', expiresIn: '1d' }
    );
    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    // Creates Secure Cookie with refresh token
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    // {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'None',
    //   maxAge: 24 * 60 * 60 * 1000,
    // }

    res.status(200).json({ accessToken });
  } else {
    res.status(403).json({ message: 'no authorization' });
  }
};

module.exports = { loginUser };
