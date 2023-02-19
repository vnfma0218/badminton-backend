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
};

const getNearClubs = async (req, res) => {
  /**
   * 
const total = await Post.countDocument({}); // 총 게시글 수 세기
const posts = await Post.find({}) 
    .sort({ createdAt: -1 }) // createdAt는 timestamps로 생성한 시간을 역순으로 정렬 === 데이터를 최근 순으로 정렬 
    .skip(perPage * (page - 1)) // 아래 설명 보기
    .limit(perPage);
const totalPage = Math.ceil(total / perPage); // 만약 전체 게시글 99개고 perPage가 10개면 값은 9.9 그래서 총 페이지수는 10개가 되어야 한다. 그래서 올림을 해준다.
   * 
   */
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

const findByName = async (req, res) => {
  const { name } = req.query;

  const regex = (pattern) => new RegExp(`.*${pattern}.*`);
  const nameRegex = regex(name); // .*토끼.*
  const result = await Club.find({ name: { $regex: nameRegex } });
  res.json({ resultCode: RESULT_CODE['success'], dataList: result });
};

module.exports = { postClub, getNearClubs, findByName };
