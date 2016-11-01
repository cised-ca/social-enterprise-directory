/*
  Usage:
    node scripts/logosToJson.js <logoDirectory> <outputDirectory>

  This is a simple script mainly to assist until we have the logo upload feature working.
  In the meantime, if we save all the logos in the same directory, this script will
  translate into base64 and create a json file that can be imported into mongo.

  It assumes that the name of the file is the ID of the enterprise.
*/
var logger = require('../lib/logger');
var fs = require('fs');

if (process.argv.length != 3) {
  logger.error('Usage: node scripts/logosToJson.js <logoDirectory>');
  return;
}

var directory = process.argv[2];
var logoOutputFile = directory+'/logos.json';

var logoArray = [];

var files = fs.readdirSync(directory);
files.forEach(function(filename) {

  var extension = filename.split('.').pop();
  var enterpriseId = filename.split('.')[0];
  var contentType;
  if (extension.toLowerCase() === 'png') {
    contentType = 'image/png';
  } else if (extension.toLowerCase() === 'jpg') {
    contentType = 'image/jpeg';
  } else if (extension.toLowerCase() === 'jpeg') {
    contentType = 'image/jpeg';
  } else {
    console.log('skipping file with extension: ' + extension);
    return;
  }

  var data = fs.readFileSync(directory + "/" + filename);
  var outputData = new Buffer(data).toString('base64');

  var logo = {
    'enterpriseId' : {'$oid' : enterpriseId},
    'contentType': contentType,
    'image' : {
      '$binary' :  outputData,
      '$type': '00'
    }
  };

  logoArray.push(logo);
});

console.log('Writing ' + logoArray.length + " logos");
fs.writeFileSync(logoOutputFile,JSON.stringify(logoArray, null, 2), 'utf8');
