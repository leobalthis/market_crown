var _			= require('lodash');

var config = {
	COMMON_PREFIX:'/api/v1',
	SESSION_MONGO:{
		URL:'mongodb://localhost/mcm-sessions'
	},
	USER_MONGO:{
		URL:'mongodb://localhost/mcm-users'
	},
	PUBLIC_ADDRESS:'http://104.239.245.54',
	PORT:3848
};

var config_dev = {
	SESSION_MONGO:{
		URL:'mongodb://mongo/mcm-sessions'
	},
	USER_MONGO:{
		URL:'mongodb://mongo/mcm-users'
	},
};

if(process.env.NODE_ENV=='development'){
	config = _.assign(config,config_dev);
}
module.exports = config;