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


var mappings = {
  '13 Muesli': '58014c003762820bc88b8000',
  'African Bronze Honey': '58014c003762820bc88b8004',
  'Beads of Awareness': '58014c003762820bc88b8007',
  'Canada Corporate Sports': '58014c003762820bc88b8012',
  'CigBins': '58014c003762820bc88b8014',
  'Community Forward Fund': '58014c003762820bc88b8017',
  'Cycle Salvation': '58014c003762820bc88b8026',
  'EcoEquitable Boutique': '58014c003762820bc88b8029',
  'Family Services Employment Assistance Program': '58014c003762820bc88b8031',
  'Gallery 101': '58014c003762820bc88b8034',
  'Good Food Box': '58014c003762820bc88b8036',
  'Good Nature Groundskeeping': '58014c003762820bc88b8037',
  'Gourmet Xpress': '58014c003762820bc88b8038',
  'Hidden Harvest': '58014c003762820bc88b8042',
  'HighJinx': '58014c003762820bc88b8043',
  'Impress': '58014c003762820bc88b8046',
  'Krackers Katering': '58014c003762820bc88b8049',
  'Laundry Matters': '58014c003762820bc88b8051',
  'MakerHouse Co': '58014c003762820bc88b8052',
  'MarketMobile': '58014c003762820bc88b8053',
  'mécènESS inc.': '58014c003762820bc88b8054',
  'Ottawa Renewable Energy Cooperative': '58014c003762820bc88b8058',
  'Ottawa Tool Library': '58014c003762820bc88b8059',
  'Restore': '58014c003762820bc88b8064',
  'Right Bike': '58014c003762820bc88b8066',
  'SuraiTea': '58014c003762820bc88b8073',
  'Tetra Society of North America - Ottawa Chapter': '58014c003762820bc88b8076',
  'Ottawa Inuit Children\'s Centre': '58014c003762820bc88b8077',
  'Tucker House Renewal Centre': '58014c003762820bc88b8080',
  'FoodWorks': '58014c003762820bc88b8081',
  'Propeller Dance': '58014c003762820bc88b8082',
  'RePurpose': '58014c003762820bc88b8083',
  'Savour Ottawa Online': '58014c003762820bc88b8084',
  'Ottawa Incubator Kitchen': '58014c003762820bc88b8085',
  'Just Food Start-Up Farm Program': '58014c003762820bc88b8086',
  'CompuCorps': '58014c003762820bc88b8087'

};

var publicArray = [];
var privateArray = [];

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var  i = 500;
var  j = 500;

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

  if (mappings[fields[2]]) {
    genPubId = mappings[fields[2]];
    genPrivId = mappings[fields[2]].replace('58014', '66778');
  }

  var public = {
    _id: {'$oid': genPubId},
    name: fields[2],
    lowercase_name: fields[2].toLowerCase(),
    parent_organization: fields[4],
    postal_code: fields[6],
    website: fields[9],
    short_description: fields[11],
    description: fields[12],
    year_started: parseInt(fields[13]),
    offering: fields[14],
    purposes: [fields[18]],
    facebook: fields[21].replace(/^.*facebook.com\//, '').replace(/^.*fb.me\//, '').replace(/\//, '').split('?')[0],
    instagram: fields[22].split('?')[0],
    twitter: fields[23].replace(/^.*twitter.com\//, '').replace(/\//, '').replace(/@/,'').split('?')[0],
    private_info: {'$oid': genPrivId}
  };

  if (!public['year_started']) {
    delete public['year_started'];
  }

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
