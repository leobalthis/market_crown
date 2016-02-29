var log4js 				= require('log4js');
var log 				= log4js.getLogger('index.js');

var express 			= require('express');
var app 				= express();
var straight 			= require('./routes/straight.js');

var prefix = '/api/v1';

app.use('/', express.static(__dirname + '/static'));
//app.get('/', function (req, res) {
//	res.send('Hello World!');
//});

log.info(process.env)
app.use(prefix,straight);

var port = process.env.PORT || 3000;
app.listen(port, function () {
	log.info('Example app listening on port [%s]!',port);
});