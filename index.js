const log4js 				= require('log4js');
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

const CONFIG				= require('./config.js');
const prefix = '/api/v1';

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
//app.use(bodyParser.json())
// cookieParser('jst rndm scrt lne',{secure:true, maxAge:60*60*24*7})
app.use(session({
	secret:'jst rndm scrt lne',
	cookie : {
		secure: true,
		maxAge: 1000*60*60*24*7 // see below
	},
	store : new MongoStore({
		url: CONFIG.SESSION_MONGO.URL
	})
}));
app.use(passport.session());

app.use('/', express.static(__dirname + '/static'));
app.use(prefix+'/common',		common);
app.use(prefix+'/personal',		personal);
app.use(prefix+'/auth',			auth);


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

