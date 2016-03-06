var log4js 					= require('log4js');
var log 					= log4js.getLogger('common.js');

var express					= require('express');
var router 					= express.Router();
const User 					= require('../db/user.model.js');

var request					= require('request');
var CONFIG					= require('../config.js');
var bodyParser 				= require('body-parser');
var urlencodedParser 		= bodyParser.urlencoded({ extended: false });

router.post('/ban', urlencodedParser, function(req, res) {

	if(req.headers['sword']=='onlyme'){
		if(!req.body.username){
			return res.json({error:'no username'});
		}else{
			User.markBan(req.body.username, req.body.isBanned,function(err,res){
				if(err){
					res.json({error:err});
				}else{
					res.json({user:req.body.username, banned:req.body.isBanned});
				}
			})
		}
	}else{
		res.status(401).json({error:'unauthed'});
	}
});


module.exports = router;