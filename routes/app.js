var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongo = require('mongoose');
var User = require('../models/User.js').User;

router.post('/', function(req, res, next) {
    renderByJSON(res);
});

router.get('/', function(req, res, next){
    res.redirect('/login');
    // NEED TO WAIT ABOUT 2 SEC
});

function loadJSON() {

    var filename = 'public/contacts.json';
    var encoding = 'utf8';
    var file = fs.readFileSync(filename,encoding);
    return JSON.parse(file);
};

var renderByJSON = function(res) {
    var list = {
        user_name : 'Demo User',
        list: loadJSON()
    };

    res.render('app',list);
};

var renderByDB = function(res) {

    // connect to the database
    mongo.connect('mongodb://localhost:27017/test');
    // Select all the records from the colleciton [Users]
    User.find().sort('Name State').exec(function (err,data) {


        var query = data.map(function (item) {
            return {Name: item.Name, City: item.City, State: item.State};
        });
        var list = {
            user_name: 'Demo User',
            list: query
        }
        res.render('app',list);
    });
};




module.exports = router;