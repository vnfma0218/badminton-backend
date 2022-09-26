const User = require('../model/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const refreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log('cookies', cookies);
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); //Forbidden

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '5m' }
    );
    res.json({ roles, accessToken });
  });
};

module.exports = { refreshToken };
