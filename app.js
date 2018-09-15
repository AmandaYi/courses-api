// require all package
var express = require('express');     // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/courses_api', { useNewUrlParser: true });
// connect to our courses_api database
var Coures = require('./app/models/coures');
var Choose = require('./app/models/choose')
// var Bear = require('./app/models/bear');
var { chooseRegRxp } = require('./app/util/util');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('success res');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({ message: 'success req' });
});
// all courses routes
// get all course
router.route('/coures')
.get((req,res)=>{
    Coures.find({},(err,resultList)=>{
        if(err){
            res.json({
                errmsg:"找不到全部信息",
                errno:-1
            })
            return
        }
        res.json({
            resultList,
            count:resultList.length,
            errno:0
        });
        return
    })
})
    // create one coures
    .post(function (req, res) {
        if (req.body.couresName == undefined) {
            res.json({
                errmsg: "couresName参数错误",
                errno: -1
            })
            return
        }
        // 操作数据库,查询是不是已经存在了
        Coures.find({
            "couresName": req.body.couresName
        }, function (err, coures) {
            if (err) {
                res.send(err);
                return
            }
            console.log(coures)
            if (coures.length > 0) {
                // 存在
                res.json({
                    errmsg: `${req.body.couresName}存在`,
                    errno: -2
                })
                return
                // 如果不存在,则保存
            } else {
                var coures = new Coures();
                coures.couresName = req.body.couresName
                coures.save(function (err) {
                    if (err) {
                        res.send(err);
                        return
                    }
                    res.json({ message: 'coures created success!' });
                    return
                })
            }
            // res.json(coures);
            // return

        });

        // var coures = new Coures();      // create a new instance of the Bear model
        // coures.couresName = req.body.couresName;  // set the bears name (comes from the request)

        // // save the bear and check for errors
        // coures.save(function (err) {
        //     if (err)
        //         res.send(err);
        //     res.json({ message: 'coures created success!' });
        //     return

        // });
    })

// ----------------------------------------------------
// router.route('/coures/:coures_id')

//     .get(function (req, res) {
//         Coures.findById(req.params.coures_id, function (err, coures) {
//             if (err)
//                 res.send(err);
//             res.json(coures);
//         });
//     })

//     .put(function (req, res) {

//         Coures.findById(req.params.coures_id, function (err, coures) {
//             if (err)
//                 res.send(err);
//             coures.name = req.body.name;  // update  
//             // save  
//             coures.save(function (err) {
//                 if (err)
//                     res.send(err);

//                 res.json({ message: 'Coures updated!' });
//             });

//         });
//     })
//     .delete(function (req, res) {
//         Coures.remove({
//             _id: req.params.coures_id
//         }, function (err, bear) {
//             if (err)
//                 res.send(err);
//             res.json({ message: 'Successfully deleted' });
//         });
//     });

// evertone choose course  must one
router.route('/choose')
.get((req,res)=>{
    Choose.find({},(err,resultList)=>{
        if(err){
            res.json({
                errmsg:"找不到全部信息",
                errno:-1
            })
            return
        }
        res.json({
            resultList,
            count:resultList.length,
            errno:0
        });
        return
    })
})
    // create user choose info 
    .post((req, res) => {
        const choose = new Choose()
        let regResult = null
        // 验证姓名
        regResult = chooseRegRxp(req, res, "name", /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/igm)
        if (regResult.reg == true) {
            choose.name = regResult.key;
        } else {
            return false
        }

        // 验证班级
        regResult = chooseRegRxp(req, res, "grade", /[\s\S]{2,50}/igm)
        if (regResult.reg == true) {
            choose.grade = regResult.key;
        } else {
            return false
        }

        // 验证学号
        regResult = chooseRegRxp(req, res, "emulate", /\d{2,20}/igm)
        if (regResult.reg == true) {
            choose.emulate = regResult.key;
        } else {
            return false
        }
        // 验证社团名称编号
        regResult = chooseRegRxp(req, res, "club_id", /\d{2,20}/igm)
        if (regResult.reg == true) {
            choose.club_id = regResult.key;
        } else {
            return false
        }
        // 验证课程编号
        regResult = chooseRegRxp(req, res, "coures_id", /\d{2,20}/igm)
        if (regResult.reg == true) {
            choose.coures_id = regResult.key;
        } else {
            return false
        }

        // 如果全部通过,那么开始执行下面的操作,操作数据库
        // res.json({
        //     errno: 0,
        //     choose
        // })
        // 查询一下这个学号是否已经存在
        let checkUser = new Promise(resolve => {
            Choose.find({ "emulate": req.body.emulate }, function (err, user) {
                if (err) {
                    res.json({
                        errmsg: "错误",
                        errno: -100
                    })
                    return
                }
                if (user.length > 0) {
                    res.json({
                        errmsg: `${req.body.emulate}已经选过课程了`,
                        errno: 101
                    })
                    return
                } else {
                    resolve();
                }
            })
        })
        checkUser.then(v => {
            // 查询一下输入的课程id是否存在于我课程的数据库中

            Coures.findById(req.body.coures_id, function (err, coures) {
                if (err) {
                    res.json({
                        errmsg: "该课程不存在,无法正常选课",
                        errno: -3
                    });
                    return
                }
                //    如果是null,那么直接返回该课程不存在,无法正常选课
                if (coures == null) {
                    res.json({
                        errmsg: "该课程不存在,无法正常选课",
                        errno: -3
                    });
                    return

                } else {
                    // 正常选课,
                    // 查询是不是已经有了200个人了
                    Choose.find({}, function (err, choosees) {
                        if (err) {
                            res.send(err);
                            return
                        }
                        let count = choosees.length;
                        if (count >= 200) {
                            res.send({
                                errmsg: "超出200个人数限制",
                                errno: -1
                            })
                            return
                        } else if (count >= 0 && count <= 200) {
                            choose.save((err) => {
                                if (err) {
                                    res.json({
                                        errmsg: "保存出错",
                                        errno: -1
                                    })
                                    return
                                }
                                res.json({
                                    message: "ok choose is success",
                                    errno: 0,
                                })
                                return
                            })
                        }
                    })
                }
            });
        })
    })
// .get((req, res) => {
//     //   let count =  Choose.countDocuments();
//     // const countQuery = Choose.where().countDocuments();

//     // query.countDocuments({ color: 'black' }).count(callback);

//     // query.countDocuments({ color: 'black' }, callback);

//     // query.where('color', 'black').countDocuments(function(err, count) {
//     //   if (err) return handleError(err);
//     //   console.log('there are %d kittens', count);
//     // });

//     // let count = Choose.find().count()

//     // .count({},function(err,count){
//     //     if(err)res.send(err);
//     //     res.send(count)

//     // })
//     // console.log(countQuery);
//     // res.send(count)
// })





// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('choose system happens on port ' + port);