const User = require('../model/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const refreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); //Forbidden

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.id !== decoded.id) return res.sendStatus(403);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser.id,
          role: 'user',
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ userId: foundUser._id, accessToken });
  });
};

module.exports = { refreshToken };
