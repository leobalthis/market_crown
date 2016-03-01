var log4js 				= require('log4js');
var log 				= log4js.getLogger('common.js');

var express				= require('express');
var router 				= express.Router();

var request				= require('request');

router.all('*', function(req, res) {
	log.info('naked > [%s] %s    (%s)',req.method,req.url, req.originalUrl);
	var url = 'http://tracer:5000' + req.url;
	req.pipe(request(url)).pipe(res);
});


module.exports = router;