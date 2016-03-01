/**
 * Created by barak on 3/1/2016.
 */
"use strict";
var mongo = require('mongoose');
var User = (function () {
    function User(data) {
        this.Name = data.Name;
        this.City = data.City;
        this.State = data.State;
    }

    User.prototype.nameUpperCase = function () {
        return this.Name.toUpperCase();
    };
}());
exports.User = User;

var schema = new mongo.Schema({
    Name: String,
    City: String,
    State: String
});

exports.User = mongo.model('User',schema);