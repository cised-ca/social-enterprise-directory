/*
  Usage:
    node scripts/logoToBase64.js <logoFile> <outputFile>

  This is a simple script mainly to assist until we have the logo upload feature working.
  In the meantime, this lets us convert a logo into a format for importing into Mongo.
*/
var winston = require('winston');
var fs = require('fs');

if (process.argv.length != 4) {
  winston.error('Usage: node scripts/logoToBase64.js <inputFile> <outputFile>');
  return;
}

var inputFile = process.argv[2];
var outputFile = process.argv[3];

fs.readFile(inputFile, function(err, data) {
  if (err) {
    winston.error(err);
    return;
  }
  fs.writeFile(outputFile, new Buffer(data).toString('base64'), function(err) {
    if (err) {
      winston.error(err);
    }
  });
});
