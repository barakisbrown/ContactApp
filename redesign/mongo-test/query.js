/**
 * Created by barak on 2/25/2016.
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/test";

var findRestauraunts = function(db, callback) {

    var cursor = db.collection('restaurants').find();
    cursor.each(function(err, doc) {

        assert.equal(null, err);
        if (doc != null) {
            console.dir(doc);
        }else {
            callback();
        }
    });
};

MongoClient.connect(url, function(err, db) {

    assert.equal(null,err);
    var collection = db.collection('restaurants').find({"cuisine":{"$ne":"Italian"}});
    var ndocs = collection.count(function(err, nbDocs) {
        console.log("Number of Resteraunts = ", nbDocs);
        db.close();
    });
});