var express = require('express');
var app = express();

var routes = require('./api/routes');

app.set('port', 14000);

app.use('/api/', routes);

app.listen(app.get('port'), function() {
});
