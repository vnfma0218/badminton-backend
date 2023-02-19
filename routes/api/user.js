const express = require('express');
const multer = require('multer');
const uuidv4 = require('uuidv4');
const router = express.Router();
const { body, check } = require('express-validator');
const userController = require('../../controllers/userController');
const verifyJWT = require('../../middleware/verifyJWT');

require('dotenv').config();

const tokenKey = process.env.TOKEN_KEY;

const DIR = './public/';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  }, //file 을 받아와서 DIR 경로에 저장한다.
  filename: (req, file, cb) => {
    // 저장할 파일의 이름을 설정한다.
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, uuidv4() + '-' + fileName);
    // (uuidv4 O) 7c7c98c7-1d46-4305-ba3c-f2dc305e16b0-통지서
    // (uuidv4 X) 통지서
  },
});

let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // 말 그대로 fileFilter
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png .jpg and .jpeg format allowed!'));
    }
  },
});

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

router.put('/user/edit', userController.editUser);

router.get('/users/all', userController.getAllUsers);
router.get('/userInfo', verifyJWT, userController.getUserById);

module.exports = router;
