// Load required packages
var mongoose = require('mongoose');

// Define our client schema
var ClientSchema = new mongoose.Schema({
    clientId: {type: String, unique: true, required: true},
    clientSecret: {type: String, unique: true, required: true}
});

// Export the Mongoose model
module.exports = mongoose.model('Client', ClientSchema);