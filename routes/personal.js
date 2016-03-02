var log4js 				= require('log4js');
var log 				= log4js.getLogger('personal.js');

var express				= require('express');
var router 				= express.Router();

var request				= require('request');
var concat				= require('concat-stream');




router.get('/me',function(req, res){
	log.info('user',req.user);
	res.send(JSON.stringify(req.user));
	//profile/us/jcramer
});

router.all('*', function(req, res) {
	log.info('authed  > [%s] %s    (%s)',req.method,req.url, req.originalUrl);
	var url = 'http://tracer:5000' + req.url;

	var  write = concat(function(completeResponse) {
		// here is where you can modify the resulting response before passing it back to the client.
		try{
			var obj = JSON.parse(completeResponse.toString())
		}catch(e){
			log.error(e);
			return res.json({error:{desc:e}});
		}

		if(obj){
			getUser(req,function(err,user){
				obj.user = user;
				if(err){
					return res.json({error:{desc:err}});
				}else{
					request({url:url,body: obj, json:true}).pipe(res)
				}
			});
		}else{
			//if no body, just send as is
			request({url:url}).pipe(res);
		}
	});
	if(req.method == 'GET'){
		request({url:url}).pipe(res);
	}else{
		req.pipe(write);
	}

});


function getUser(req,done){
	console.log('req.signedCookies.session_id',req.signedCookies.session_id);

	if(!req.signedCookies.session_id){
		return done('')
	}

	done(null,{id:'huemeie',nickname:'awsome'})
}

module.exports = router;