const express = require("express")
var { chooseRegRxp } = require("./../util/util");
// 配置路由
const routerModule = express.Router();
const Choose = require('./../models/choose');
const Coures = require("./../models/coures")
routerModule.use((req, res, next) => {
    // console.log(`拿到路径${req.url}`);
    next()
})
// 选课系统
routerModule.route("/choose")
    .get((req, res, next) => {
        Choose.find({}, (err, result) => {
            if (err) {
                res.json({
                    errmsg: "找不到全部信息",
                    errno: -1
                })
                return
            }
            res.json({
                result,
                count: result.length,
                errno: 0
            });
            return
        })

    })
    .post((req, res, next) => {
        const choose = new Choose()
        choose.coures_name = "1234567789"
        // 这里写一大堆判断
        // 验证请求的数据
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
        // 验证课程编号
        regResult = chooseRegRxp(req, res, "coures_id", /\d{2,20}/igm)
        if (regResult.reg == true) {
            choose.coures_id = regResult.key;

        } else {
            return false
        }

        // 验证请求的数据
        // 如果全部通过,那么开始执行下面的操作,操作数据库
        // 查询一下这个学号是否已经存在 
        let checkUser = new Promise((resolve) => {
            Choose.find({ "emulate": req.body.emulate }, (err, user) => {
                if (err) {
                    res.json({
                        errmsg: "服务器错误",
                        errno: 505
                    })
                    return
                }
                if (user.length > 0) {
                    res.json({
                        errmsg: `${req.body.emulate}已经选过课程了`,
                        errno: -100
                    })
                    return
                } else {
                    resolve();
                }
            })
        })


        checkUser.then(value => {
            // 检查数据库中是否存在这个课程,
            Coures.findById(req.body.coures_id, function (err, coures) {
                if (err) {
                    res.json({
                        errmsg: "课程查询错误,无法正常选课",
                        errno: 503
                    });
                    return
                }
                // 这里如果查到是空,那么是非法的
                if (coures == null) {
                    res.json({
                        errmsg: "该课程不存在,无法正常选课",
                        errno: -1
                    });
                    return
                } else {
                    // 这里是如果查看到了该课程了,
                    //  然后再次判断,判断是否已经达到了最大的能力
                    let studentCount = Number(coures.studentCount);
                    let studentMax = Number(coures.studentMax);
                    // 如果课程已选人数是小于该课程的总数的话,那么可以进行增加数据
                    if (studentCount < studentMax) {
                        choose.coures_name = coures.couresName
                        choose.save((err) => {
                            if (err) {
                                res.json({
                                    errmsg: "学生信息保存出错,具体信息服务器内部问题",
                                    errno: 505
                                })
                                return

                            }
                            let tmpCount = 1 + studentCount;
                            coures.update({ $set: { studentCount: tmpCount } }, (err) => {
                                if (err) {
                                    res.json({
                                        errmsg: "课程增加错误,服务器内部问题",
                                        errno: 500
                                    })
                                    return
                                }
                                res.json({
                                    errmsg: "正常",
                                    errno: 0
                                })
                                return
                            })
                        })
                    } else {
                        res.json({
                            errmsg: "该课程存在可以选课,但是容量不足",
                            errno: 0
                        })
                        return
                    }
                }
            })
        })
            .catch(err => {
                if (err) {
                    res.json({
                        errmsg: "服务器内部问题",
                        errno: 504
                    })
                }
            })
    })
routerModule.route('/coures')
    .get((req, res) => {
        Coures.find({}, (err, result) => {
            if (err) {
                res.json({
                    errmsg: "找不到全部信息",
                    errno: -1
                })
                return
            }
            res.json({
                result,
                count: result.length,
                errno: 0
            });
            return
        })
    })
    // create one coures
    .post((req, res) => {
        // console.log(req.body)
        if (req.body.couresName == undefined && req.body.couresName !== "") {
            res.json({
                errmsg: "couresName参数错误",
                errno: -1
            })
            return
        }
        if (req.body.courseTeach == undefined && req.body.couresName !== "") {
            res.json({
                errmsg: "courseTeach参数错误",
                errno: -1
            })
            return
        }
        if (req.body.studentMax == undefined && req.body.couresName !== "") {
            res.json({
                errmsg: "studentMax参数错误",
                errno: -1
            })
            return
        }
        Coures.find({
            "couresName": req.body.couresName
        }, (err, coures) => {
            if (err) {
                res.send(err);
                return
            }
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
                // 课程名字,
                coures.courseTeach = req.body.courseTeach
                coures.studentMax = req.body.studentMax
                coures.studentCount = 0
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
        })
    })
// .post(function (req, res) {
//     if (req.body.couresName == undefined) {
//         res.json({
//             errmsg: "couresName参数错误",
//             errno: -1
//         })
//         return
//     }
//     // 操作数据库,查询是不是已经存在了
//     Coures.find({
//         "couresName": req.body.couresName
//     }, function (err, coures) {
//         if (err) {
//             res.send(err);
//             return
//         }
//         console.log(coures)
//         if (coures.length > 0) {
//             // 存在
//             res.json({
//                 errmsg: `${req.body.couresName}存在`,
//                 errno: -2
//             })
//             return
//             // 如果不存在,则保存
//         } else {
//             var coures = new Coures();
//             coures.couresName = req.body.couresName
//             coures.save(function (err) {
//                 if (err) {
//                     res.send(err);
//                     return
//                 }
//                 res.json({ message: 'coures created success!' });
//                 return
//             })
//         }
//         // res.json(coures);
//         // return

//     });
// }
// ============================================================
routerModule.get("/", (req, res, next) => {
    res.json({
        errmsg: `您请求的是${req.url},路径正常`,
        errno: 0
    })
    next()
    return
})
routerModule.use("*", (req, res, next) => {
    res.json({
        errmsg: "错误路径",
        errno: 0
    })
    next()
    return
})
module.exports = routerModule
// module.exports.allRouter = (req,res,next)=>{

// console.log(`拿到路径${req.url}`);
// next()

// }