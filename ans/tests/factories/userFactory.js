const mongoose = require('mongoose');

const User = mongoose.model('User');
// 몽구스 초기화 안되어서 오류남... Jest 시작 시 index.js 를 거치는게 아녀라 ㅎㅎ

module.exports = () => {
  return new User({

  })
    .save();
};