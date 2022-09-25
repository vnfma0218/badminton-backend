const express = require('express');
const router = express.Router();
const { body, check } = require('express-validator');

require('dotenv').config();

const userController = require('../../controllers/userController');

const tokenKey = process.env.TOKEN_KEY;
// TODO 라우터 사용하여 api 분리하기
router.get('/home', (req, res) => {
  console.log('home');
  res.send({ name: 'pooreum' });
});

router.post('/login', userController.loginUser);

router.post(
  '/signup',
  check('email').isEmail().withMessage('올바른 이메일 형식을 입력해주세요'),
  body('password')
    .matches(
      /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/
    )
    .withMessage('password regex'),

  userController.registerUser
);

module.exports = router;
