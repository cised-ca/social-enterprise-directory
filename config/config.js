var convict = require('convict');

// Define a schema
var conf = convict({
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  ip: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'IP_ADDRESS'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 10010,
    env: 'PORT'
  },
  loglevel: {
    doc: 'The log level',
    format: ['error', 'warn', 'info', 'verbose', 'debug', 'silly' ],
    default: 'warn',
    env: 'LOG_LEVEL'
  },
  dbURL: {
    doc: 'The database connection string',
    format: String,
    default: 'mongodb://localhost:27017/socialEnterpriseDirectory',
    env: 'DB_URL'
  },
  logFile: {
    doc: 'The log file name, if file logging is desired',
    format: String,
    default: ''
  },
  enterpriseCacheControl: {
    doc: 'The max-age value for Cache-Control for enterprises',
    format: Number,
    default: 3600
  }
});

// Load environment dependent configuration
var env = conf.get('env');
conf.loadFile('./config/' + env + '.json');

// Perform validation
conf.validate({strict: true});

module.exports = conf;
