var log4js 				= require('log4js');
var log 				= log4js.getLogger('user.model.js');

var mongoose 			= require('mongoose');
var Schema 				= mongoose.Schema;


var userSchema = new Schema({
	provider: {name:String, id:String},
	displayName: String,
	name:{
		familyName:String,
		givenName:String,
		middleName:String
	},
	emails: [
		Schema.Types.Mixed 										//value, type (home,work, etc)
		],
	photos:[Schema.Types.Mixed ],								// value
	createdAt: {type:Date, default: Date.now()},
	modifiedAt: {type:Date, default: Date.now()}
});


userSchema.pre('save', function (next) {
	this.modifiedAt =  Date.now();
	next();
});

userSchema.pre('update', function (next) {
	this.modifiedAt =  Date.now();
	next();
});

userSchema.statics.findOrCreate = function (profile,done) {
	log.info('findOrCreate');
	log.info('findOrCreate - create');
	//log.info('provider',profile.provider);
	//log.info('profile',profile);
	User.findOne({'$and':[{'provider.id':profile.id,'provider.name':profile.provider}]},function(err,user){
		if(err){
			log.info('findOrCreate - error');
			done(err);
		}else if(!user){

			profile.provider = {id:profile.id,name:profile.provider}
			var newUser = new User(profile)
			log.debug('profile',profile);
			log.debug('user',newUser)
			newUser.save(function(err,nu){
				log.debug('cb ',err,nu);
				done(err,nu);
			});
		}else{
			log.info('findOrCreate - exists',user);
			done(null, user);
		}
	})
};



var User = mongoose.model('User', userSchema);
module.exports = User;