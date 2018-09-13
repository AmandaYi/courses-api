// require all package
var express = require('express');     // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/courses_api'); 
// connect to our courses_api database
var Coures=require ('./app/models/coures');
var Bear = require('./app/models/bear');
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
.get(function(req,res){
    Coures.find(function(err,coureses){
        if(err){
            res.send(err);
        }
        res.json(coureses)
    })
})
// create one coures
.post(function(req,res){
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

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function (req, res) {
        Coures.findById(req.params.course_id, function (err, coures) {
            if (err)
                res.send(err);
            res.json(coures);
        });
    })
    // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
    .put(function (req, res) {

        // use our bear model to find the bear we want
        Bear.findById(req.params.bear_id, function (err, bear) {

            if (err)
                res.send(err);

            bear.name = req.body.name;  // update the bears info

            // save the bear
            bear.save(function (err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Bear updated!' });
            });

        });
    })
    .delete(function (req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function (err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


 
// more routes for our API will happen here
router.route('/bears')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function (req, res) {

        var bear = new Bear();      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)

        // save the bear and check for errors
        bear.save(function (err) {
            if (err)
                res.send(err);
            res.json({ message: 'Bear created!' });
        });

    })
    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function (req, res) {
        Bear.find(function (err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    }) 
   

// ----------------------------------------------------
router.route('/bears/:bear_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function (req, res) {
        Bear.findById(req.params.bear_id, function (err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    })
    // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
    .put(function (req, res) {

        // use our bear model to find the bear we want
        Bear.findById(req.params.bear_id, function (err, bear) {

            if (err)
                res.send(err);

            bear.name = req.body.name;  // update the bears info

            // save the bear
            bear.save(function (err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Bear updated!' });
            });

        });
    })
    .delete(function (req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function (err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);