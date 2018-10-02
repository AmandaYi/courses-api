
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CouresSchema   = new Schema({
    // 课程名字,
    couresName: String,
    // 指导老师
    courseTeach:String,
    // 人数上限
    studentMax:String,
    // 已经选课的人数
    studentCount:String
});


module.exports = mongoose.model('coures', CouresSchema);