//var mongoose = require('mongoose').connect('mongodb://localhost/ds');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var chunk = require('./chunk');

var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/ds';

mongoose.connect(uristring, function(err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  }
  else {
    console.log('connected to database successfully');
  }
});

var chunkSchema = new Schema({
  x: Number,
  y: Number,
  height: Number,
  width: Number,
  tileheight: Number,
  tilewidth: Number,
  orientation: String,
  tilesets: Array,
  texture: String,
  spawn_rate: Number,
  version: Number,
  layers: Array
});

exports.Chunk = mongoose.model('Chunk', chunkSchema);

exports.getChunk = function(x, y, fn) {

  // This will create new chunks everytime you reconnect to the server, useful for testing
  this.deleteChunk(x, y);

  this.Chunk.findOne({ x: x, y: y }, function(err, oldChunk) {
    if (err) {
      //console.log('chunk error: ' + err);
    }
    else {
      if (oldChunk) {
        //console.log('chunk found: ' + oldChunk._id);
        fn(oldChunk);
      }
      else {
        //console.log('no chunk found. generating chunk.');
        chunk.generate(x, y, fn);
      }
    }
  });

};

exports.deleteChunk = function(x, y, fn) {
  this.Chunk.remove({ x: x, y: y }, function(err) {
    if (err) return handleError(err);
    //fn();
  });
};