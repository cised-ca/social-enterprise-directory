/*
  1. Export the Google doc provided by CSED in tab-separated format (one file for english, one for french)
  2. Run this script to produce json files from the enterprise data
  3. Import the json files to mongo to populate DB with enterprise data
*/
var logger = require('../lib/logger');
var fs = require('fs');

if (process.argv.length != 5) {
  logger.error('Usage: node scripts/rttoToJson.js <inputFileEnglish> <inputFileFrench> <outputDir>');
  return;
}

var inputFileEn = process.argv[2];
var inputFileFr = process.argv[3];
var outputDir = process.argv[4];
var publicOutputFile = outputDir+'/public.json';
var privateOutputFile = outputDir+'/private.json';

var file = fs.readFileSync(inputFileEn, 'utf8');
var enterprisesEn = file.split('\n');
// delete first 2 rows
enterprisesEn.splice(0, 2);


var fileFr = fs.readFileSync(inputFileFr, 'utf8');
var enterprisesFr = fileFr.split('\n');
// delete first 2 rows
enterprisesFr.splice(0, 2);

var mappings = {
  'GROW Studios': '58014c003762820bc88b8000',
  'Heartwood House': '58014c003762820bc88b8001',
  'HighJinx': '58014c003762820bc88b8002',
  'EcoEquitable': '58014c003762820bc88b8003',
  'Spread the Joy': '58014c003762820bc88b8004',
  'BottleWorks': '58014c003762820bc88b8005',
  'Bronson Centre': '58014c003762820bc88b8006',
  'Krackers Katering': '58014c003762820bc88b8007',
  'Thirteen: A Social Enterprise': '58014c003762820bc88b8008',
  'Tableworks Catering': '58014c003762820bc88b8009',
  'SuraiTea Inc': '58014c003762820bc88b8010',
  'National Capital FreeNet': '58014c003762820bc88b8011',
  'Sweet Memories Baskets': '58014c003762820bc88b8012',
  'Institut social': '58014c003762820bc88b8013',
  'mécènESS inc.': '58014c003762820bc88b8014',
  'La Boite Theatre Box': '58014c003762820bc88b8015',
  'Co-opérative Africa Slow Food Inc.': '58014c003762820bc88b8016',
  'La Nouvelle Scène Gilles Desjardins': '58014c003762820bc88b8017',
  'People of Motherland-A World of Cultures-Un Monde de Cultures': '58014c003762820bc88b8018',
  'Gourmet-Xpress': '58014c003762820bc88b8019',
  'Groupe Convex Prescott-Russell Inc.': '58014c003762820bc88b8020',
  'La Passerelle-I.D.É.': '58014c003762820bc88b8021',
  'Friends of Algoma': '58014c003762820bc88b8022',
  'Blue Sky Community Healing Centre': '58014c003762820bc88b8023',
  'The Cherry Side': '58014c003762820bc88b8024',
  'PARO Presents': '58014c003762820bc88b8025',
  'Shinnowap Consulting': '58014c003762820bc88b8026',
  'Deprived Magazine': '58014c003762820bc88b8027',
  'Entre Tacos Y Arepas': '58014c003762820bc88b8028',
  'Accelerated Access': '58014c003762820bc88b8029',
  'Willow Springs Creative Centre': '58014c003762820bc88b8030',
  'Playing Nice in the Sandbox with Penny Tremblay': '58014c003762820bc88b8031',
  'Boreal Journeys': '58014c003762820bc88b8032',
  'Birch & Fern Events': '58014c003762820bc88b8033',
  'Goodwill Industries': '58014c003762820bc88b8034',
  'YOU Made It Cafe': '58014c003762820bc88b8035',
  'Shut The Front Door Improv': '58014c003762820bc88b8036',
  'For the Love of Laundry': '58014c003762820bc88b8037',
  'Meals on Wheels London': '58014c003762820bc88b8038',
  'The Old East Village Grocer': '58014c003762820bc88b8039',
  'Growing Chefs! Headquarters/The Beet Cafe': '58014c003762820bc88b8040',
  'CrueTV': '58014c003762820bc88b8041',
  'Options Mississauga Print and Office Services': '58014c003762820bc88b8042',
  'Artscape Performance and Event Venues': '58014c003762820bc88b8043',
  'Hawthorne Food & Drink': '58014c003762820bc88b8044',
  'Interpreter Services Toronto (IST)': '58014c003762820bc88b8045',
  'Canadian Hearing Society': '58014c003762820bc88b8046',
  'KLINK Coffee Inc.': '58014c003762820bc88b8047',
  'Paintbox Catering': '58014c003762820bc88b8048',
  'Jubilee Designs': '58014c003762820bc88b8049',
  'Eva\'s Print Shop': '58014c003762820bc88b8050',
  'Out of This World Cafe': '58014c003762820bc88b8051',
  'ShareBaskets by FoodShare Toronto': '58014c003762820bc88b8052',
  'Fresh Gifts by FoodShare Toronto': '58014c003762820bc88b8053',
  'Field to Table Catering by FoodShare Toronto': '58014c003762820bc88b8054',
  'PATCH': '58014c003762820bc88b8055',
  'ENAGB Youth Cedar Basket': '58014c003762820bc88b8056',
  'Fabarnak Cafe and Catering': '58014c003762820bc88b8057',
  'The Remix Project Social Enterprise': '58014c003762820bc88b8058',
  'Friends Catering': '58014c003762820bc88b8059',
  'Haween Enterprises': '58014c003762820bc88b8060',
  'Regent Park Catering Collective': '58014c003762820bc88b8061',
  'Edgar and Joe\'s Café': '58014c003762820bc88b8062',
  'caterToronto': '58014c003762820bc88b8063',
  'The Root Cellar': '58014c003762820bc88b8064',
  'Innovation Works': '58014c003762820bc88b8065',
  'The Skill Centre': '58014c003762820bc88b8066',
  'Museum London': '58014c003762820bc88b8067',
  'Addventuresome': '58014c003762820bc88b8068'
};

var publicMap = {};
var privateMap = {};

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function parsePurposesEn(purposesStr) {
  let purposes = purposesStr.split(',');
  let result = purposes.map(purpose => purpose.split('/')[0].trim());
  return result;
}

function parsePurposesFr(purposesStr) {
  let purposes = purposesStr.split(',');
  let result = purposes.map(purpose => purpose.split('/')[1].trim());
  return result;
}

var  i = 100;
var  j = 100;

enterprisesEn.forEach(function(enterprise) {
  var genPubId = '58014c003762820bc88b8' + pad(i++, 3);
  var genPrivId = '66778c003762820bc88b8' + pad(j++, 3);
  var fields = enterprise.split('\t');
  if (!fields[0]) {
    return;
  }
  if (!fields[0].toLowerCase().includes('yes')) {
    return;
  }

  let enterpriseName = fields[1].trim();
  if (mappings[enterpriseName]) {
    genPubId = mappings[enterpriseName];
    genPrivId = mappings[enterpriseName].replace('58014', '66778');
  }

  var publicEn = {
    name: enterpriseName,
    lowercase_name: enterpriseName.toLowerCase(),
    short_description: fields[2],
    description: fields[3],
    offering: fields[4],

    // location fields[5]

    purposes: parsePurposesEn(fields[6]),

    //address fields[7],
    postal_code: fields[8],

    website: fields[10],
    twitter: fields[11].replace(/^.*twitter.com\//, '').replace(/\//, '').replace(/@/,'').split('?')[0],
    facebook: fields[12].replace(/^.*facebook.com\//, '').replace(/^.*fb.me\//, '').replace(/\//, '').split('?')[0],
    instagram: fields[13].replace(/^.*instagram.com\//, '').replace(/\//, '').replace(/@/,'').split('?')[0]

  };

  let jsonPublicEnterprise = {
    _id: {'$oid': genPubId},
    private_info: {'$oid': genPrivId},
    'en': publicEn,
    'fr': {}
  };

  let jsonPrivateEnterprise = {
    _id: {'$oid': genPrivId},
    'admin_emails': [fields[9]]
  };

  publicMap[genPubId] = jsonPublicEnterprise;
  privateMap[genPubId] = jsonPrivateEnterprise;
});


enterprisesFr.forEach(function(enterprise) {
  var fields = enterprise.split('\t');
  if (!fields[0]) {
    return;
  }
  if (!fields[0].toLowerCase().includes('yes')) {
    return;
  }

  let enterpriseName = fields[1].trim();

  var publicFr = {
    name: enterpriseName,
    lowercase_name: enterpriseName.toLowerCase(),
    short_description: fields[2],
    description: fields[3],
    offering: fields[4],

    // location fields[5]

    purposes: parsePurposesFr(fields[6]),

    //address fields[7],
    postal_code: fields[8],

    website: fields[10],
    twitter: fields[11].replace(/^.*twitter.com\//, '').replace(/\//, '').replace(/@/,'').split('?')[0],
    facebook: fields[12].replace(/^.*facebook.com\//, '').replace(/^.*fb.me\//, '').replace(/\//, '').split('?')[0],
    instagram: fields[13].replace(/^.*instagram.com\//, '').replace(/\//, '').replace(/@/,'').split('?')[0]
  };

  let pubId = mappings[enterpriseName];
  if (!pubId) {
    /* eslint-disable no-console */
    console.log('WARNING.... No enterprise found in mappings for french name ' + enterpriseName);
  } else {
    publicMap[pubId]['fr'] = publicFr;
  }
});


fs.writeFileSync(publicOutputFile,JSON.stringify(Object.keys(publicMap).map((k) => publicMap[k]), null, 2), 'utf8');
fs.writeFileSync(privateOutputFile,JSON.stringify(Object.keys(privateMap).map((k) => privateMap[k]), null, 2), 'utf8');
