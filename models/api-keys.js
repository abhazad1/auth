const mongoose = require('mongoose');

const APIKeySchema = new mongoose.Schema({
    Key: {
        type: String,
        required: true
    },
    Secret: {
        type: String,
        required: true
    },
    exchange: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = mongoose.model('api_keys', APIKeySchema);