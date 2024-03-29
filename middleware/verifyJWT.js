const jwt = require('jsonwebtoken');
require('dotenv').config();
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('401 에러');
    return res.sendStatus(401);
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //invalid token
    req.userId = decoded.UserInfo.id;
    req.role = decoded.UserInfo.role;
    next();
  });
};

module.exports = verifyJWT;
