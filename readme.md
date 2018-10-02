# 启动方法
*  启动 mongo
*  mongod  --storageEngine mmapv1 --dbpath ./
*  安装依赖 npm install 
*  启动 node index.js
=================================
- 127.0.0.1:3001/api/coures
- get 请求 : 获取全部的课程列表
- post 请求: 增加课程
- 请求头:x-www-form-urlencoded
- 请求参数
- couresName 课程名字
- courseTeach 指导老师
- studentMax 该课程最大容量多少学生
=================================
- 127.0.0.1:3001/api/choose
- get 请求: 获取全部的已经选课的学生信息,结果是
- {
-     "result": [
-         {
-             "_id": "5bb32f99a282cb2c947ce506",
-             "name": "小明",
-             "grade": "二年级",
-             "emulate": "77889187",
-             "coures_id": "5bb32f84a282cb2c947ce505",
-             "__v": 0
-         },
-     "count": 6,
-     "errno": 0
- }
- post 请求: 学生进行选课
- 请求头:x-www-form-urlencoded
- 请求参数
- name 学生姓名
- grade 班级
- emulate 学号
- coures_id 选择的课程ID
- 
- 