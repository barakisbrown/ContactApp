/**
 * Created by barak on 3/1/2016.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('./bCrypt.js'),
    SALT_WORK_FACTOR = 10,
    // THESE ARE MY VALUES
    // MAX ATTEMPTS = 5, LOCK_TIME = 2HRS
    MAX_LOGIN_ATTEMPTS = 5,
    LOCK_TIME = 2 * 60 * 60 * 1000,
    Contacts = require('./contact-model.js');

var UserSchema = new Schema({
    username: {type:String,required:true,index:{unique: true}},
    password: {type:String,required:true},
    Contacts: {type:mongoose.Schema.Types.ObjectId, ref: 'Contacts'},
    loginAttempts: {type: Number, required: true, defaults: 0},
    lockUntil: {type: Number}
});

UserSchema.virtual('isLocked').get(function() {
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

UserSchema.pre('save', function(next) {
    var user = this;

    // only has the password if it has been modified(or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err,salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the new one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null,isMatch);
  });
};

UserSchema.methods.incLoginAttempts = function(cb) {

    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set:   { loginAttempts: 1},
            $unset: { lockUntil: 1}
        },cb);
    }

    // otherwise increment it
    var updates = { $inc: {loginAttempts: 1}};
    // if loginAttempts == 5 and it is not locked already, lock it
    if (this.loginAttemps + 1 >= MAX_LOGIN_ATTEMPTS && !this.lockUntil) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME};
    }
    return this.update(updates,cb);
};

// expose enum on the model, and provide an internal convince references
var reasons = UserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

UserSchema.statics.getAuthenticated = function(username, password, cb) {

    this.findOne({username: username}, function(err, user) {

        if (err) return cb(err);

        // make sure the user exist
        if (!user) {
            return cb(null, null, reasons.NOT_FOUND);
        }

        // CHECK IF THE ACCOUNT IS LOCKED
        if (user.isLocked) {
            // just increament login attempts if account is already locked
            return user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null,null,reasons.MAX_ATTEMPTS);
            });
        }

        // now lets see if it is the right user after all
        user.comparePassword(password, function(err, isMatch){

            if (err) return cb(err);

            // check to see if it was a match
            if (isMatch) {
                // NO LOCK OR FAILED ATTEMPT .. JUST RETURN USER
                if (!user.loginAttemps && !user.lockUntil) return cb(null,user);

                // RESET ATTEMPT AND LOCK INFO
                var updates = {
                    $set: { loginAttempts: 0},
                    $unset: { lockUntil: 1}
                };

                return user.update(updates, function(err) {
                    if (err) return cb(err);
                    return cb(null,user);
                });
            }

            // password incorrect . up the login attemps
            user.incLoginAttempts(function(err){
                if (err) return cb(err);
                return cb(null,null,reasons.PASSWORD_INCORRECT);
            });
        });


    });

};

module.exports = mongoose.model('User',UserSchema);

