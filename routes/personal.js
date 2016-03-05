var log4js 				= require('log4js');
var log 				= log4js.getLogger('personal.js');

var express				= require('express');
var router 				= express.Router();

var request				= require('request');
var concat				= require('concat-stream');
var CONFIG				= require('../config.js')

router.use(usernameReplacement);
var pattern = '$$username$$';
function replacer(req,field){
	req[field] = req[field].replace(pattern,req.user.mc_username);
}

function usernameReplacement(req,res, next){

	if(req.user){
		replacer(req,'baseUrl');
		replacer(req,'originalUrl');
		replacer(req,'path');
		replacer(req,'url');
		next();
	}else{
		log.warn('No user in /personal');
		next();
	}
}



router.get('/me',function(req, res){
	log.info('user',req.user);
	res.send(JSON.stringify(req.user));
});

router.all('*', function(req, res) {
	if(!req.user){
		return res.redirect(CONFIG.REDIRECT_AUTH_FAIL)
	}else if(!req.user.mc_username){
		return res.redirect(CONFIG.REDIRECT_AUTH_SUCCESS)
	}

	log.info('authed  > [%s] %s    (%s)',req.method,req.url, req.originalUrl);
	var url = 'http://'+CONFIG.PYTHON_API.HOST+':'+CONFIG.PYTHON_API.PORT + req.url;

	var  write = concat(function(completeResponse) {
		// here is where you can modify the resulting response before passing it back to the client.
		try{
			var obj = JSON.parse(completeResponse.toString())
		}catch(e){
			log.error(e);
			return res.json({error:{desc:e}});
		}

		if(obj){

				obj.user = req.user.mc_username;
				if(err){
					return res.json({error:{desc:err}});
				}else{
					request({url:url,body: obj, json:true}).pipe(res)
				}

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
//
//
//function getUser(req,done){
//	console.log('req.signedCookies.session_id',req.signedCookies.session_id);
//
//	//if(!req.signedCookies.session_id){
//	//	return done('')
//	//}
//
//	done(null,req,user.mc_username)
//}

module.exports = router;