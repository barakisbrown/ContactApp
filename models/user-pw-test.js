/**
 * Created by barak on 3/1/2016.
 */
var mongoose = require('mongoose'),
    User = require('./user-model');

var constr = "mongodb://localhost:27017/test";
mongoose.connect(constr, function(err){
    if (err) throw err;
    console.log("CONNECTED");
});

// create a user
var testUser = new User({
    username: 'Matthew',
    password: 'Password'
});

testUser.save(function(err){
    if (err) throw err;

    // fetch user and test password verification
    User.findOne({username: 'Matthew'}, function(err, user) {

        if (err) throw err;

        user.comparePassword('Password',function(err, isMatch){
            if (err) throw err;
            console.log('Password:', isMatch);
        });

        user.comparePassword('123Password',function(err, isMatch){
            if (err) throw err;
            console.log('123Password:', isMatch);
        });
    });
});