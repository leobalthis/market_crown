const log4js 				= require('log4js');
const log 					= log4js.getLogger('auth.js');

const express				= require('express');
const router 				= express.Router();
var request					= require('request');


const User 					= require('../db/user.model.js');
const CONFIG				= require('../config.js');
//
var passport 				= require('passport');
var bodyParser 				= require('body-parser');


var FacebookStrategy 		= require('passport-facebook').Strategy;
var TwitterStrategy 		= require('passport-twitter');
//var GooglePlusStrategy 	= require('passport-google-plus');
var GoogleStrategy 			= require('passport-google-oauth20').Strategy;

var urlencodedParser 		= bodyParser.json({ type: 'application/json'});//bodyParser.urlencoded({ extended: false });

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		if(user.banned){
			done(err,null);
		}else{
			done(err, user);
		}

	});
});



passport.use(new FacebookStrategy({
		clientID: 1074187149262332,
		clientSecret: "94eed7a7170b0e2b76f4f4cc25240a51",
		callbackURL: CONFIG.PUBLIC_ADDRESS+CONFIG.API_PREFIX+"/auth/facebook/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		User.findOrCreate(profile, function(err, user) {
			if (err) { return done(err); }
			done(null, user);
		});
	}
));

passport.use(new TwitterStrategy({
		consumerKey: 'HGsgXjGXU4qsGePQ3RKVLnvBy',
		consumerSecret: '1FyIuFVfRbAogS6yF36yQvBvV5Zndy3e9OT7qjHCKnc1uj35tS',
		callbackURL: CONFIG.PUBLIC_ADDRESS+CONFIG.API_PREFIX+"/auth/twitter/callback"
	},
	function(token, tokenSecret, profile, done) {
		User.findOrCreate(profile, function(err, user) {
			if (err) { return done(err); }
			done(null, user);
		});
	}
));

passport.use(new GoogleStrategy({
		clientID: '1002436193878-ba0blta375fu9bbvkuv4k883fnpa03gl.apps.googleusercontent.com',
		clientSecret: '8lYRVEfZsQG5pcXtitAIcRUs',
		callbackURL: CONFIG.PUBLIC_ADDRESS+CONFIG.API_PREFIX+"/auth/google/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		User.findOrCreate(profile, function(err, user) {
			if (err) { return done(err); }
			done(null, user);
		});
	}
));

router.get('/facebook',
	passport.authenticate('facebook'));
router.get('/facebook/callback',
	passport.authenticate('facebook', { successRedirect: CONFIG.REDIRECT_AUTH_SUCCESS,
		failureRedirect: CONFIG.REDIRECT_AUTH_FAIL }));

router.get('/twitter',
	passport.authenticate('twitter'));
router.get('/twitter/callback',
	passport.authenticate('twitter', { successRedirect: CONFIG.REDIRECT_AUTH_SUCCESS,
			failureRedirect: CONFIG.REDIRECT_AUTH_FAIL }));

router.get('/google',
	passport.authenticate('google', { scope: ['profile'] }));
router.get('/google/callback',
	passport.authenticate('google', { successRedirect: CONFIG.REDIRECT_AUTH_SUCCESS,
		failureRedirect: CONFIG.REDIRECT_AUTH_FAIL }));


router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});


var finish_url = 'http://'+CONFIG.PYTHON_API.HOST+':'+CONFIG.PYTHON_API.PORT;
router.post('/finish',urlencodedParser, function(req,res){
	//console.log('post finish',req.body);
	if(!req.user){
		return res.status(401).send('no cookies');
	}
	var obj = {
		"username": req.body.user_name,
		"email": (req.body.email && req.body.email.length>0)?req.body.email:req.user.getEmail(),
		"location":"San Francisco",
		"sector":["technology","financial"],
		"marketcap":["mega"]
	};
	//console.log(obj)
	request({
		url:finish_url+'/create/user',
		method:'POST',
		body:obj,
		json:true
	},function (error, response, body) {
			//console.log('error',error);
			//console.log('response',response);
			//console.log('body',body);
			if(error){
				return res.json({error:body})
			}

			if(body=="User successfully added"){
				User.deleteAllNonfinished();

				req.user.saveMcUsername(req.body.user_name,req.body.email,function(err){
					return res.json({redirect:CONFIG.REDIRECT_URL_AFTER_SUCCESS_SIGNUP});
					//return res.redirect(CONFIG.REDIRECT_URL_AFTER_SUCCESS_SIGNUP);
				});
			}else{
				return res.json({error:body})
			}

	});
});
module.exports = router;