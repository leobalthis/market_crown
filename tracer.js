var log4js 				= require('log4js');
var log 				= log4js.getLogger('tracer.js');

var express 			= require('express');
var app 				= express();

app.all('*', function (req, res) {
	log.info(' > [%s] %s',req.method,req.originalUrl)
	res.json({result:'ok'});
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
	log.info('TRACER listening on port [%s]!',port);
});