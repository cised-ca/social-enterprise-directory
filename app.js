var express = require('express');
var app = express();

var routes = require('./api/routes');

app.set('port', 14000);

app.use('/api/', routes);

var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});
