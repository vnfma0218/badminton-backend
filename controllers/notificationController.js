const { RESULT_CODE } = require('../config/apiCode');

const Notification = require('../model/notification');

const getNotiByUserId = async (req, res) => {
  const notiList = await Notification.find({ from: req.userId });
  console.log(notiList);
  return res
    .status(200)
    .json({ resultCode: RESULT_CODE['success'], dataList: { notiList } });
};

module.exports = {
  getNotiByUserId,
};
