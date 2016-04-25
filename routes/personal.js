var log4js 				= require('log4js');
var log 				= log4js.getLogger('personal.js');

var express				= require('express');
var router 				= express.Router();
var _					= require('lodash');
const User 				= require('../db/user.model.js');

var request				= require('request');
var concat				= require('concat-stream');
var CONFIG				= require('../config.js');
var qs 					= require('querystring')

//router.use(usernameReplacement);
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
	if(process.env.NODE_ENV=='development'){
		res.json({
			displayName:'Vasily Petrov',
			mc_username:'jeangrey',
			photos:[{value:'assets/images/thumb.jpg'}]
		});
	}else{
		res.json(req.user);
	}

});

router.get('/avatar/:username',function(req, res){
	if(process.env.NODE_ENV=='development'){
		res.json({avatar:'assets/images/thumb.jpg'});
	}else{
		User.findOne({mc_username:req.params.username}, function(err, user) {
			if(!user){
				res.json({error:'user not found'});
			}else{
				res.json({avatar:(user.photos && user.photos[0])?user.photos[0].value:'/userpics/$default.png'});
			}
		});
	}
});



router.all('*', function(req, res) {
	if(process.env.NODE_ENV=='development'){
		req.user = {mc_username:'rooborn'};
	}else{
		if(!req.user){
			return res.redirect(CONFIG.REDIRECT_AUTH_FAIL)
		}else if(!req.user.mc_username){
			return res.redirect(CONFIG.REDIRECT_AUTH_SUCCESS)
		}
	}


	log.info('authed  > [%s] %s    (%s)',req.method,req.url, req.originalUrl);
	var url = 'http://'+CONFIG.PYTHON_API.HOST+':'+CONFIG.PYTHON_API.PORT + req.url;

	var obj;
	var  write = concat(function(completeResponse) {
		// here is where you can modify the resulting response before passing it back to the client.
		try{
			 obj = JSON.parse(completeResponse.toString())
		}catch(e){
			//log.error(e);
			//return res.json({error:{desc:'responce not json',resp:completeResponse.toString()}});
			obj = qs.parse(completeResponse.toString());
		}
		console.log('python>',obj);
		if(!obj){obj = {}};
		//		obj.user = req.user.mc_username;
		//		request({url:url,body: obj, json:true,method:req.method,headers: {'mc-username':req.user.mc_username}}).pipe(res)
		//}else{
			//if no body, just send as is
		request({url:url,body:obj,json:true,method:req.method,headers: {'mc-username':req.user.mc_username}}).pipe(res);
		//}
	});
	if(req.method == 'GET'){
		request({url:url,headers: {'mc-username':req.user.mc_username}}).pipe(res);
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