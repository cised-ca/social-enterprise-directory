/*
  1. Export the Google doc provided by CSED in tab-separated format (one file for english, one for french)
  2. Run this script to produce json files from the enterprise data
  3. Import the json files to mongo to populate DB with enterprise data
*/
var logger = require('../lib/logger');
var fs = require('fs');

if (process.argv.length != 4) {
  logger.error('Usage: node scripts/rttoToJson.js <inputFileEnglish> <outputDir>');
  return;
}

var inputFileEn = process.argv[2];
var outputDir = process.argv[3];
var publicOutputFile = outputDir+'/public.json';
var privateOutputFile = outputDir+'/private.json';

var file = fs.readFileSync(inputFileEn, 'utf8');
var enterprisesEn = file.split('\n');
// delete first 2 rows
enterprisesEn.splice(0, 2);

let mappings = {};

let locationMappingsLatLong = {
  'Accelerated Access': [48.384543,-89.245742],
  'Artscape Performance and Event Venues': [43.638147, -79.418215],
  'Birch & Fern Events': [45.310155, -79.242184],
  'Blue Sky Community Healing Centre': [48.384277, -89.246218],
  'Border City Urban Farms': [42.322631, -83.022124],
  'Boreal Journeys': [48.534302, -89.584896],
  'BottleWorks': [45.418425, -75.697295],
  'Bronson Centre': [45.413745, -75.706339],
  'Canadian Hearing Society': [43.677318, -79.407867],
  'caterToronto': [43.650951, -79.396595],
  'Co-opérative Africa Slow Food Inc.': [45.421953, -75.670114],
  'CrueTV': [43.881780, -79.438699],
  'Deprived Magazine': [48.427079, -89.250261],
  'EcoEquitable': [45.433392, -75.648798],
  'Edgar and Joe\'s Café': [42.979685, -81.243464],
  'ENAGB Youth Cedar Basket': [43.668420, -79.404909],
  'Entre Tacos Y Arepas': [48.428870, -89.272926],
  'Eva\'s Print Shop': [43.647125, -79.398663],
  'Fabarnak Cafe and Catering': [43.666745, -79.380997],
  'Field to Table Catering by FoodShare Toronto': [43.694399, -79.493035],
  'For the Love of Laundry': [42.962560, -81.286660],
  'Fresh Gifts by FoodShare Toronto': [43.694399, -79.493035],
  'Friends Catering': [43.653863, -79.372988],
  'Friends of Algoma': [46.300323, -83.790033],
  'Goodwill Industries': [42.979748, -81.243497],
  'Gourmet-Xpress': [45.462878, -75.542386],
  'Groupe Convex Prescott-Russell Inc.': [45.610936, -74.602735],
  'GROW Studios': [45.381794, -75.619278],
  'Growing Chefs! Headquarters/The Beet Cafe': [42.986323, -81.236737],
  'Haween Enterprises': [43.697854, -79.551122],
  'Hawthorne Food & Drink': [43.652640, -79.376215],
  'Heartwood House': [45.433302, -75.648798],
  'HighJinx': [45.414836, -75.699102],
  'Innovation & Creation Lab': [45.474158, -75.455297],
  'Innovation Works': [42.982744, -81.247426],
  'Institut social': [45.409588, -75.727758],
  'Intello-Productions Inc': [45.436090, -75.661965],
  'Interpreter Services Toronto (IST)': [43.655874, -79.409224],
  'Jubilee Designs': [43.658827, -79.381726],
  'KLINK Coffee Inc.': [43.679366, -79.341807],
  'Krackers Katering': [45.406641, -75.723701],
  'La Boite Theatre Box': [45.427881, -75.504618],
  'La Nouvelle Scène Gilles Desjardins': [45.430309, -75.686702],
  'La Passerelle-I.D.É.': [43.661662, -79.382773],
  'Mahtay Cafe': [43.158693, -79.243360],
  'Maker House Co.': [45.405757, -75.723005],
  'Meals on Wheels London': [42.989430, -81.231056],
  'mécènESS inc.': [45.409565, -75.727768],
  'Mes Amis Catering': [43.258937, -79.870227],
  'Muséoparc Vanier Museopark': [45.443794, -75.659493],
  'Museum London': [42.982631, -81.255111],
  'National Capital FreeNet': [45.368251, -75.785660],
  'Options Mississauga Print and Office Services': [43.549678, -79.587581],
  'Out of This World Cafe': [43.643324, -79.419164],
  'Paintbox Catering': [43.659933, -79.362241],
  'PARO Presents': [48.384500, -89.245680],
  'Patro d\'Ottawa': [45.434684, -75.681302],
  'PATCH': [43.641926, -79.371712],
  'People of Motherland-A World of Cultures-Un Monde de Cultures': [43.621726, -79.743160],
  'Playing Nice in the Sandbox with Penny Tremblay': [46.332785, -79.469126],
  'Radio Communautaire Kapnord inc.': [49.415854, -82.402885],
  'Recycle-Action': [45.595420, -74.594014],
  'Regent Park Catering Collective': [43.660201, -79.363293],
  'Seven Shores Community Cafe': [43.466032, -80.521146],
  'ShareBaskets by FoodShare Toronto': [43.694155, -79.493029],
  'Shinnowap Consulting': [53.818871, -89.835175],
  'Shut The Front Door Improv': [42.953014, -81.331336],
  'Southridge Jam Company': [43.153002, -79.399282],
  'Spread the Joy': [45.457462, -75.491149],
  'SuraiTea Inc': [45.429679, -75.688582],
  'Sweet Memories Baskets': [45.345455, -75.797808],
  'Tableworks Catering': [45.337615, -75.903756],
  'The Down Stairs Kitchen': [43.269878, -79.859722],
  'The Old East Village Grocer': [42.989278, -81.230871],
  'The Remix Project Social Enterprise': [43.642772, -79.426513],
  'The Root Cellar': [42.988948, -81.230932],
  'The Skill Centre': [42.983347, -81.250357],
  'Thirteen: A Social Enterprise': [45.401346, -75.726231],
  'Willow Springs Creative Centre': [48.562542, -89.382947],
  'YOU Made It Cafe': [42.981632, -81.248398]
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
  let result = purposes.map(purpose => {
    if (purpose.split('/').length > 1) {
      return purpose.split('/')[1].trim();
    }
    return '';
  });
  result = result.filter(purpose => purpose.length > 0);
  return result;
}

function parseOffering(offeringStr) {
  console.log(offeringStr)
  let offering = offeringStr.split('\r');
  let off = [];
  offering.forEach(s => {
    let arr = s.split('  ');
    arr.forEach(o => {
      o = o.trim();
      if (o.length > 0) {
        off.push(o.trim());
      }
    });
  });
  return off;
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
  if (enterpriseName == 'The Down Stairs Kichen') {
    enterpriseName = 'The Down Stairs Kitchen';
  }
  if (mappings[enterpriseName]) {
    genPubId = mappings[enterpriseName];
    genPrivId = mappings[enterpriseName].replace('58014', '66778');
  }

  let city = fields[8].replace(', Ontario', '')
          .replace(', ON', '')
          .replace(', On', '')
          .replace(' and Surrounding Communities', '');
  let streetAddress = fields[10].replace(', ON', '')
                                .replace(' '+ city, '')
                                .replace(','+ city, '')
                                .replace(city, '');

  let publicEn = {
    name: enterpriseName,
    lowercase_name: enterpriseName.toLowerCase(),
    short_description: fields[4],
    description: fields[5],
    offering: parseOffering(fields[7]),

    purposes: parsePurposesEn(fields[9]),

    addresses: [
      {
        'address': streetAddress + ', ' + city + ', ON, ' + fields[10],
        'public': true,
        'tags': ['main']
      }
    ],
    postal_code: fields[11],

    website: fields[13],
    twitter: fields[14].replace(/^.*twitter.com\//, '').replace(/\//, '').replace(/@/,'').split('?')[0],
    facebook: fields[15].replace(/^.*facebook.com\//, '').replace(/^.*fb.me\//, '').replace(/\//, '').split('?')[0],
    instagram: fields[16].replace(/^.*instagram.com\//, '').replace(/\//, '').replace(/@/,'').split('?')[0]

  };

  let publicFr = {
    name: enterpriseName,
    lowercase_name: enterpriseName.toLowerCase(),
    short_description: fields[2],
    description: fields[3],

    offering: parseOffering(fields[6]),
    purposes: parsePurposesFr(fields[9]),

    addresses: [
      {
        'address': streetAddress + ', ' + city + ', ON, ' + fields[11],
        'public': true,
        'tags': ['main']
      }
    ],
    postal_code: fields[12],

    website: fields[13],
    twitter: fields[14].replace(/^.*twitter.com\//, '').replace(/\//, '').replace(/@/,'').split('?')[0],
    facebook: fields[15].replace(/^.*facebook.com\//, '').replace(/^.*fb.me\//, '').replace(/\//, '').split('?')[0],
    instagram: fields[16].replace(/^.*instagram.com\//, '').replace(/\//, '').replace(/@/,'').split('?')[0]

  };

  let jsonPublicEnterprise = {
    _id: {'$oid': genPubId},
    private_info: {'$oid': genPrivId},
    'en': publicEn,
    'fr': publicFr
  };
  if (locationMappingsLatLong[enterpriseName]) {
    jsonPublicEnterprise['locations'] = {
      'type': 'MultiPoint',
      'coordinates': [
        [locationMappingsLatLong[enterpriseName][1], locationMappingsLatLong[enterpriseName][0]]
      ]
    };
  } else {
    /* eslint-disable no-console*/
    console.log('WARNING: no location found for enterprise ' + enterpriseName);
  }

  let jsonPrivateEnterprise = {
    _id: {'$oid': genPrivId},
    'admin_emails': [fields[11]]
  };

  publicMap[genPubId] = jsonPublicEnterprise;
  privateMap[genPubId] = jsonPrivateEnterprise;
  console.log(genPubId + ' ' + publicEn['name']);
});


fs.writeFileSync(publicOutputFile,JSON.stringify(Object.keys(publicMap).map((k) => publicMap[k]), null, 2), 'utf8');
fs.writeFileSync(privateOutputFile,JSON.stringify(Object.keys(privateMap).map((k) => privateMap[k]), null, 2), 'utf8');
