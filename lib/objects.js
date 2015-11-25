/*
*	Spawnable Objects loader
*/

var fs = require('fs');

var object;

exports.load = function() {

	fs.readFile('./spawnable_objects.json', 'utf8', function (err, data) {
		if (err) throw err;
		object = JSON.parse(data);
	});

};

exports.Params = function() {

	return object;

};