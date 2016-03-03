var _			= require('lodash');

var config = {
	API_PREFIX:'/api/v1',
	LANDING_PREFIX:'/landing',
	APP_PREFIX:'/app',
	SESSION_MONGO:{
		URL:'mongodb://localhost/mcm-sessions'
	},
	USER_MONGO:{
		URL:'mongodb://localhost/mcm-users'
	},

	PUBLIC_ADDRESS:'http://marketcrown.com',
	PYTHON_API:{
		HOST:'162.209.66.60',
		PORT:'80'
	},
	//PUBLIC_ADDRESS:'http://104.239.245.54',
	PORT:3848,
	REDIRECT_URL_AFTER_SUCCESS_SIGNUP:'/app'
};

var config_dev = {
	SESSION_MONGO:{
		URL:'mongodb://mongo/mcm-sessions'
	},
	USER_MONGO:{
		URL:'mongodb://mongo/mcm-users'
	},
	PYTHON_API:{
		HOST:'tracer',
		PORT:'5000'
	},
};

if(process.env.NODE_ENV=='development'){
	config = _.assign(config,config_dev);
}
module.exports = config;