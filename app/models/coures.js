
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CouresSchema   = new Schema({
    couresName: String
});

module.exports = mongoose.model('coures', CouresSchema);