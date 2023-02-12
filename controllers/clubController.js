const User = require('../model/user');
const Club = require('../model/club');
const { RESULT_CODE } = require('../config/apiCode');

const postClub = async (req, res) => {
  const { loadAddress, jibun, lat, lng, name } = req.body;

  const club = new Club({
    name,
    address: { jibun, loadAddress },
    location: { coordinates: [lng, lat], type: 'Point' },
  });
  const result = await club.save();
  res.status(200).json({
    resultCode: RESULT_CODE['success'],
    message: '등록했어요',
    resultData: result,
  });
  // const foundUser = await User.findById(req.userId); // 댓글작성자
  // console.log(foundUser);
};

const getNearClubs = async (req, res) => {
  const { lat, lng } = req.query;
  try {
    const foundedList = await Club.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: 2000,
        },
      },
    });

    res.json(foundedList);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { postClub, getNearClubs };
