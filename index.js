const express = require("express");

const app = express()
const cors = require('cors'); 
app.use(cors())
// 获取post请求
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// 数据库连接
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/courses_api', { useNewUrlParser: true });
const routerModule = require("./src/routers/index")
// 选课系统
app.use("/api", routerModule)

app.listen(3001);