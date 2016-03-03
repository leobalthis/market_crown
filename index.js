const log4js 			= require('log4js');
const log 				= log4js.getLogger('index.js');

const express 			= require('express');
const app 				= express();
const session 			= require('express-session');
const MongoStore 		= require('connect-mongo')(session);
const passport 			= require('passport');

const common 			= require('./routes/common.js');
const personal			= require('./routes/personal.js');
const auth				= require('./routes/auth.js');
const db				= require('./db/db.js');

const CONFIG			= require('./config.js');


// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
//app.use(bodyParser.json())
// cookieParser('jst rndm scrt lne',{secure:true, maxAge:60*60*24*7})
app.use(session({
	secret:'jst rndm scrt lne',
	cookie : {
		secure: false,
		maxAge: 1000*60*60*24*7 // see below
	},
	store : new MongoStore({
		url: CONFIG.SESSION_MONGO.URL
	})
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(CONFIG.LANDING_PREFIX, express.static(__dirname + '/static/landing'));
app.use(CONFIG.APP_PREFIX, express.static(__dirname + '/static/app'));

app.use(CONFIG.API_PREFIX+'/common',		common);
app.use(CONFIG.API_PREFIX+'/personal',		personal);
app.use(CONFIG.API_PREFIX+'/auth',			auth);
app.get(CONFIG.LANDING_PREFIX, function(req,res){
	res.sendFile(__dirname + '/static/landing/marketcrown.html')
});
app.get(CONFIG.LANDING_PREFIX+'/personalInfo', function(req,res){
	if(req.user && req.user.mc_username){
		log.debug('req.user.mc_username',req.user.mc_username);
		console.log('**')
	}
	res.sendFile(__dirname + '/static/landing/personalinfo.html')
});

db.init(function(err){
	if(err){
		log.error(err)
	}else{
		startServer()
	}
});

function startServer(){
	var port = process.env.PORT || CONFIG.PORT || 3000;
	app.listen(port, function () {
		log.info('Example app listening on port [%s]!',port);
	});
}

