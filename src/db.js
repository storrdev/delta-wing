var mongoose = require('mongoose').connect('mongodb://localhost/ds');
var Schema = mongoose.Schema;
var chunk = require('./chunk');

var _db = mongoose.connection;
_db.on('error', console.error.bind(console, 'connection error:'));
_db.once('open', function callback () {
  console.log('connected to database successfully');
});

var chunkHeight = 10;
var chunkWidth = 10;
var tileHeight = 10;
var tileWidth = 10;
var orientation = 'orthogonal';

var chunkSchema = new Schema({
  x: Number,
  y: Number,
  height: Number,
  width: Number,
  tileheight: Number,
  tilewidth: Number,
  orientation: String,
  tilesets: Array,
  properties: Schema.Types.Mixed,
  version: Number,
  layers: Array
});

exports.Chunk = mongoose.model('Chunk', chunkSchema);

exports.getChunk = function(x, y, fn) {

  this.Chunk.findOne({ x: x, y: y }, function(err, oldChunk) {
    if (err) {
      console.log('chunk error: ' + err);
    }
    else {
      if (oldChunk) {
        console.log('chunk found: ' + oldChunk);
        fn(oldChunk);
      }
      else {
        chunk.generate(x, y, fn);
      }
    }
  });

};
