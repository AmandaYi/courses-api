// require all package
var express = require('express');     // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/courses_api',{useNewUrlParser:true});
// connect to our courses_api database
var Coures = require('./app/models/coures');
var Choose = require('./app/models/choose')
// var Bear = require('./app/models/bear');
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
router.route('/course')
    .get(function (req, res) {
        Coures.find(function (err, coureses) {
            if (err) {
                res.send(err);
            }
            res.json(coureses)
        })
    })
    // create one coures
    .post(function (req, res) {
        var coures = new Coures();      // create a new instance of the Bear model
        coures.couresName = req.body.couresName;  // set the bears name (comes from the request)

        // save the bear and check for errors
        coures.save(function (err) {
            if (err)
                res.send(err);
            res.json({ message: 'coures created success!' });
        });
    })

// ----------------------------------------------------
router.route('/course/:course_id')

    .get(function (req, res) {
        Coures.findById(req.params.course_id, function (err, coures) {
            if (err)
                res.send(err);
            res.json(coures);
        });
    })

    .put(function (req, res) {

        Coures.findById(req.params.course_id, function (err, coures) {
            if (err)
                res.send(err);
            coures.name = req.body.name;  // update  
            // save  
            coures.save(function (err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Coures updated!' });
            });

        });
    })
    .delete(function (req, res) {
        Coures.remove({
            _id: req.params.course_id
        }, function (err, bear) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });

// evertone chooose course  must one
router.route('/choose')
    // create user choose info 
    .post((req, res) => {
        const choose = new Choose()
        // 姓名
        choose.name = req.body.name
        // 班级
        choose.grade = req.body.grade
        // 学号
        choose.emulate = req.body.emulate
        // 社团名称编号
        choose.club_id = req.body.club_id
        choose.phone = req.body.phone
        // 选择的课程id
        choose.coures_id = req.body.coures_id
        // 选择的课程名字
        choose.coures_name = req.body.coures_name
        choose.save((err) => {
            if (err) res.send(err)
            res.json({
                message: "ok choose is success",
                errno: 0,
            })
        })
    })



 

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('choose system happens on port ' + port);