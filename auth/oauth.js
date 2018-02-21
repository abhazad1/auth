const User = require('../models/user');
const Client = require('../models/oauth/clients');
const Token = require('../models/oauth/token');
const APIKeySchema = require('../models/api-keys');
var bCrypt = require('bcrypt-nodejs');

getAccessToken = function (bearerToken, callback) {
    Token.findOne({
        accessToken: bearerToken
    }, callback);
};

getClient = function (clientId, clientSecret, callback) {
    Client.findOne({
        clientId: clientId,
        clientSecret: clientSecret
    }, callback);
};

grantTypeAllowed = function (clientId, grantType, callback) {
    callback(false, grantType === "password");
};

saveAccessToken = function (accessToken, clientId, expires, user, callback) {
    var tokenModel = new Token({
        accessToken: accessToken,
        expires: expires,
        clientId: clientId,
        user: user
    });

    tokenModel.save(callback);
};

getUser = function (username, password, callback) {
    User.findOne({
        email_id: username
    }, function (err, user) {
        if (err) {
            callback();
        }
        if (user) {
            if (bCrypt.compareSync(password, user.password)) {
                APIKeySchema.find({
                    user_id: user._id
                }, function (err, exchange) {
                    var userData = {
                        id: user,
                        exchanges: exchange
                    };
                    callback(false, userData);
                });
            }
        } else {
            callback();
        }
    });
};

module.exports = {
    getAccessToken: getAccessToken,
    getClient: getClient,
    grantTypeAllowed: grantTypeAllowed,
    saveAccessToken: saveAccessToken,
    getUser: getUser
};