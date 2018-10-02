
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChooseSchema = new Schema({
    // 姓名
    name: String,
    // 班级
    grade: String,
    // 学号
    emulate: String,
    // 选择的课程id
    coures_id: String,
    // // 社团名称编号
    // club_id: String,
    // phone: String,
    // // 选择的课程名字
    coures_name:String
});

module.exports = mongoose.model('choose', ChooseSchema);