var log4js 				= require('log4js');
var log 				= log4js.getLogger('personal.js');

var express				= require('express');
var router 				= express.Router();
var _					= require('lodash');
const User 				= require('../db/user.model.js');

var request				= require('request');
var concat				= require('concat-stream');
var CONFIG				= require('../config.js');
var qs 					= require('querystring');
var path				= require('path');
var tempDir 			= path.join('.', 'static');
var s3 = require('./aws');
var aws = require('aws-sdk');
var multiparty = require('multiparty');
var uuid = require('uuid');

//router.use(usernameReplacement);
var pattern = '$$username$$';
//function replacer(req,field){
//	req[field] = req[field].replace(pattern,req.user.mc_username);
//}
//
//function usernameReplacement(req,res, next){
//
//	if(req.user){
//		replacer(req,'baseUrl');
//		replacer(req,'originalUrl');
//		replacer(req,'path');
//		replacer(req,'url');
//		next();
//	}else{
//		log.warn('No user in /personal');
//		next();
//	}
//}



router.get('/me',function(req, res){
		//res.json(req.user);
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
	//if(process.env.NODE_ENV=='development'){
	//	res.json({avatar:'assets/images/thumb.jpg'});
	//}else{
		var username = String(req.params.username).toLowerCase();
		var regex = new RegExp('^'+username+'$','i');
		console.log('ava',username,regex);
		User.findOne({mc_username:regex}, function(err, user) {
			if(!user){
				res.json({avatar:'/userpics/$default.png',reason:'no user found'});
			}else{
				res.json({avatar:(user.photos && user.photos[0])?user.photos[0].value:'/userpics/$default.png'});
			}
		});
	//}
});

router.post('/avatar/:username', function(req, res){

	var username = String(req.params.username).toLowerCase();
	var s3Client = s3.createClient({
		  maxAsyncS3: 20,     // this is the default
		  s3RetryCount: 3,    // this is the default
		  s3RetryDelay: 1000, // this is the default
		  multipartUploadThreshold: 20971520, // this is the default (20 MB)
		  multipartUploadSize: 15728640, // this is the default (15 MB)
		  s3Options: {
		    accessKeyId: "AKIAIAHSPCV7HDQHZQAA",
		    secretAccessKey: "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",
		    region: "us-west-2",
		  },
		});
	var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      var file = files.file[0];
      var contentType = file.headers['content-type'];
      var extension = file.path.substring(file.path.lastIndexOf('.'));

      var headers = {
        'x-amz-acl': 'public-read',
        'Content-Length': file.size,
        'Content-Type': contentType
      };

		var params = {
		  localFile: file.path,

		  s3Params: {
		    Bucket: "marketcrown-avatars",
		    Key: username,
		  },
		};
		var uploader = s3Client.uploadFile(params);

		uploader.on('error', function(err) {
			//TODO handle this
			res.json({error:err});
		});

		uploader.on('end', function(url) {
			var s3s = new aws.S3();
			var sparams = {Bucket: 'marketcrown-avatars', Key: username};
			var url = s3s.getSignedUrl('getObject', sparams);
			res.json({success:url});
		});

    });

});

router.all('*',proxy);

function proxy(req, res) {
	if(process.env.NODE_ENV=='development'){
		req.user = {mc_username:'rooborn'};
	}
	console.log('*',req.user)
	if(!req.user){
		console.log('* no user')
		return res.redirect(CONFIG.REDIRECT_AUTH_FAIL)
	}else if(!req.user.mc_username){
		console.log('* no username')
		return res.redirect(CONFIG.REDIRECT_AUTH_SUCCESS)
	}
	//}



	var url = 'http://'+CONFIG.PYTHON_API.HOST+':'+_.sample(CONFIG.PYTHON_API.PORTS) + _.replace(req.url,'fe2ed','feed');
	// ***
	//IMPORTANT we have to change "feed" bacouse problem with desorialization if url contains "feed"  (!)
	log.info('request  > [%s] %s(%s)   payload:(%s)',req.method,req.url, req.originalUrl,req.body);
	log.info('request goes to endpoint: %s ',url);
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

}

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