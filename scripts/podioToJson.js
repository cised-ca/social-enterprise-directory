var logger = require('../lib/logger');
var fs = require('fs');

if (process.argv.length != 4) {
  logger.error('Usage: node scripts/podioToJson.js <inputFile> <outputDir>');
  return;
}

var inputFile = process.argv[2];
var outputDir = process.argv[3];
var publicOutputFile = outputDir+'/public.json';
var privateOutputFile = outputDir+'/private.json';

var file = fs.readFileSync(inputFile, 'utf8');
var enterprises = file.split('\n');
enterprises.splice(0, 1);

var publicArray = [];
var privateArray = [];

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var  i = 0;
var  j = 0;

enterprises.forEach(function(enterprise) {
  var genPubId = '58014c003762820bc88b8' + pad(i++, 3);
  var genPrivId = '66778c003762820bc88b8' + pad(j++, 3);
  var fields = enterprise.split('\t');
  if (!fields[1]) {
    return;
  }
  if (!fields[1].toLowerCase().includes('approved')) {
    return;
  }

  var public = {
    _id: {'$oid': genPubId},
    name: fields[2],
    parent_organization: fields[4],
    postal_code: fields[6],
    website: fields[9],
    short_description: fields[11],
    description: fields[12],
    year_started: parseInt(fields[13]),
    offering: fields[14],
    purposes: [fields[18]],
    facebook: fields[21].replace(/^.*facebook.com\//, '').replace(/^.*fb.me\//, '').replace(/\//, ''),
    instagram: fields[22],
    twitter: fields[23].replace(/^.*twitter.com\//, '').replace(/\//, '').replace(/@/,''),
    private_info: {'$oid': genPrivId}
  };

  if (fields[19]) {
    public.purposes.push(fields[19]);
  }

  var private = {
    _id: {'$oid': genPrivId},
    contact_person: fields[5],
    emails : [
      {
        email: fields[7],
        public: true,
        tags: ['work']
      }
    ],
    phones : [
      {
        phone: fields[8],
        public: true,
        tags: ['work']
      }
    ],
    annual_revenue_range: fields[15],
    cluster: [fields[16]],
    segments: fields[20].split(';')
  };

  if (fields[17]) {
    private.cluster.push(fields[17]);
  }

  publicArray.push(public);
  privateArray.push(private);

});


fs.writeFileSync(publicOutputFile,JSON.stringify(publicArray, null, 2), 'utf8');
fs.writeFileSync(privateOutputFile,JSON.stringify(privateArray, null, 2), 'utf8');
