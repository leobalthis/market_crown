var log4js 				= require('log4js');
var log 				= log4js.getLogger('common.js');

var express				= require('express');
var router 				= express.Router();

var request				= require('request');
var CONFIG				= require('../config.js');

router.all('*', function(req, res) {
	var url = 'http://'+CONFIG.PYTHON_API.HOST+':'+CONFIG.PYTHON_API.PORT + CONFIG.PYTHON_UNSECURE_ENDPOINT + req.url;
	log.info('common [%s] %s > %s   ',req.method, req.url, url);
	req.pipe(request(url)).pipe(res);
});


module.exports = router;