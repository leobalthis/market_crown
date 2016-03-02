const log4js 				= require('log4js');
const log 					= log4js.getLogger('auth.js');

const express				= require('express');
const router 				= express.Router();
const User 					= require('../db/user.model.js');
const CONFIG				= require('../config.js');
//
var passport = require('passport');

var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter');
var GooglePlusStrategy = require('passport-google-plus');



passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});



passport.use(new FacebookStrategy({
		clientID: 1074187149262332,
		clientSecret: "94eed7a7170b0e2b76f4f4cc25240a51",
		callbackURL: CONFIG.PUBLIC_ADDRESS+CONFIG.COMMON_PREFIX+"/auth/facebook/callback"
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
		callbackURL: CONFIG.PUBLIC_ADDRESS+CONFIG.COMMON_PREFIX+"/auth/twitter/callback"
	},
	function(token, tokenSecret, profile, done) {
		User.findOrCreate(profile, function(err, user) {
			if (err) { return done(err); }
			done(null, user);
		});
	}
));

passport.use(new GooglePlusStrategy({
		clientId: '1002436193878-ba0blta375fu9bbvkuv4k883fnpa03gl.apps.googleusercontent.com',
		clientSecret: '8lYRVEfZsQG5pcXtitAIcRUs',
		callbackURL: CONFIG.PUBLIC_ADDRESS+CONFIG.COMMON_PREFIX+"/auth/google/callback"
	},
	function(tokens, profile, done) {
		User.findOrCreate(profile, function(err, user) {
			if (err) { return done(err); }
			done(null, user);
		});
	}
));

router.get('/facebook',
	passport.authenticate('facebook'));
router.get('/facebook/callback',
	passport.authenticate('facebook', { successRedirect: '/',
		failureRedirect: '/' }));

router.get('/twitter',
	passport.authenticate('twitter'));
router.get('/twitter/callback',
	passport.authenticate('twitter', { successRedirect: '/',
			failureRedirect: '/' }));

router.get('/google',
	passport.authenticate('google'));
router.get('/google/callback',
	passport.authenticate('google', { successRedirect: '/',
		failureRedirect: '/' }));


router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

module.exports = router;