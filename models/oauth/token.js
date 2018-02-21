// Load required packages
var mongoose = require('mongoose');

// Define our client schema
var TokenSchema = new mongoose.Schema({
    accessToken: {type: String, required: true},
    expires: Date,
    clientId: String,
    user: {
        id: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        exchanges: {type: Array, default: []}
    }
});

TokenSchema.index({"expires": 1}, {expireAfterSeconds: 0});

// Export the Mongoose model
module.exports = mongoose.model('token', TokenSchema);