/**
 * Created by barak on 2/26/2016.
 */
var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/test";
// LETS CONNECT TO OUR DATABASE USING THE DB SERVER URL
mongoose.connect(url);

var User = mongoose.model('User', {name: String, city: String, state: String});

var createUsers = function() {

    var usr1 = new User({name: 'Matthew', city: 'Austin', state:'TX'});
    var usr2 = new User({name: 'MOM', city: 'Holiday Island', state:'AR'});
    var usr3 = new User({name: 'DITTO', city: 'Charlton', state:'MA'});
    var usr4 = new User({name: 'Shelly', city: 'Edmond', state:'OK'});

    // lets add these to the table and display this collection
    usr1.save(function (err, userObj) {
        if (err) {
            console.log(err);
        } else {
            console.log("user saved :", userObj);
        }
    });

    usr2.save(function (err, userObj) {
        if (err) {
            console.log(err);
        } else {
            console.log("user saved :", userObj);
        }
    });

    usr3.save(function (err, userObj) {
        if (err) {
            console.log(err);
        } else {
            console.log("user saved :", userObj);
        }
    });

    usr4.save(function (err, userObj) {
        if (err) {
            console.log(err);
        } else {
            console.log("user saved :", userObj);
        }
    });
};

var countUsers = function () {

  User.count(function(err, count) {

      console.log("Number of Users in the collection = ", count);
  });
};

var orderByState = function () {

    User.find().sort('state').exec(function(err, collectionItems) {
       collectionItems.forEach(function(item) {
          console.log(item.name);
       });
    });
};

var orderByStateAndName = function () {

    User.find().sort('name state').exec(function(err, collectionItems){
        collectionItems.forEach(function(item) {
            console.log(item.name);
        });
    });
};

var dumpUsers = function () {

    User.find().sort('name state').exec(function(err, collectionItems) {

        var rtnArray = collectionItems.map(function (item) {
            return 'Name: ' + item.name + '     City: ' + item.city + '   State:' + item.state;
        });

        console.log(rtnArray);
    });
};

var createSingleUser = function() {

    var usr5 = new User({name: 'Jonathan', city:'Georgetown', state: 'TX'});
    usr5.save(function(err,obj) {
        if (err) {
            console.log(err);
        }else {
            console.log('user added');
        }
    });
};

var removeUser = function(nameToRemove) {

    User.remove({name: nameToRemove},function(err) {
        if (err) {
            console.log(err);
        }
    });
};

dumpUsers();
