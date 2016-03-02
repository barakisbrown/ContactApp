/**
 * Created by barak on 3/1/2016.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ContactSchema = new Schema({
    full_name: {type: String, required: true, index: {index: unique}},
    address:   {type: String},
    city:      {type: String},
    state:     {type: String},
    zip:       {type: String},
    phone:     {type: String},
    email:     {type: String}
});

/// METHODS OR STATICS FOR THIS MODEL





// EXPORT THE MODEL
module.exports = mongoose.model('Contacts',ContactSchema);