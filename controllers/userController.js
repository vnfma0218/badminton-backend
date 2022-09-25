const { User } = require('../model/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registerUser = async (req, res) => {
  console.log(req.body);
  const { name, email, password, passwordConfirm } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (password !== passwordConfirm) {
    return res.status(400).json({ errors: [{ password: 'not same' }] });
  }

  // 중복되는 이메일 찾기
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'already use in email' });
  }

  // 패스워드 변환하기 (bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPw = await bcrypt.hash(password, salt);
  const user = new User({
    name,
    email,
    password: hashedPw,
  });

  await user.save();

  //   // TODO 토큰 생성 후 토큰
  //   const token = jwt.sign({ email }, tokenKey);

  //   // jwt
  //   console.log(token);
  return res.status(200).json({ message: 'success' });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // login process
  // validation 진행
  // email, 비밀번호를 비교함
  const foundUser = await User.findOne({ email });
  if (!foundUser)
    return res.status(401).json({ message: '일치하는 이메일이 없습니다.' });
  const match = await bcrypt.compare(password, foundUser.password);
  console.log('password', password);
  console.log(foundUser);
  console.log(match);
  if (match) {
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser,
          role: 'user',
        },
      },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: '5m' }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    foundUser.refreshToken = refreshToken;
    await foundUser.save();
    // Creates Secure Cookie with refresh token
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
  } else {
    res.status(403).json({ message: 'no authorization' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
