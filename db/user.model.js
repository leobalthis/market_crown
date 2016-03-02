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
	photos:[String],
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
	User.findOne({'$and':[{'provider.id':profile.id,'provider.name':profile.name}]},function(err,user){
		if(err){
			log.info('findOrCreate - error');
			done(err);
		}else if(!user){
			log.info('findOrCreate - create');
			profile.provider = {id:profile.id,name:profile.provider}
			var newUser = new User(profile)
			newUser.save(done);
		}else{
			log.info('findOrCreate - exists',user);
			done(null, user);
		}
	})
};



var User = mongoose.model('User', userSchema);
module.exports = User;