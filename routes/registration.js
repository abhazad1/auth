const User = require('../models/user');
const EMAIL_REGEXP = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]+)$/i;

exports.register = function (req, res) {
    if (req.body.password.length > 7) {
        if (EMAIL_REGEXP.test(req.body.email)) {
            User.findOne({
                email_id: req.body.email
            }, function (err, user) {
                if (err) {
                    res.status(500).json({
                        message: 'Registration failed due to a System Error. - ' + JSON.stringify(err),
                        code: 500
                    });
                }
                if (user) {
                    res.status(409).json({
                        message: 'You are already registered. Please login with your credentials.',
                        code: 409
                    });
                } else if (!user) {
                    var newUser = new User({
                        email_id: req.body.email,
                        password: req.body.password,
                        first_name: req.body.first_name,
                        last_name: req.body.last_name
                    });

                    newUser.save(function (err, user) {
                        if (err) {
                            res.status(500).json({
                                message: 'Registration failed due to a System Error. - ' + JSON.stringify(err),
                                code: 500
                            });
                        } else {
                            res.status(201).json({
                                message: 'Registration Successful!',
                                code: 201
                            });
                        }
                    });
                }
            });
        } else {
            res.status(500).json({
                message: 'Please Enter a Valid Email!',
                code: 500
            });
        }
    } else {
        if (!EMAIL_REGEXP.test(req.body.email)) {
            res.status(500).json({
                message: 'Please Enter a Valid Email and Password!',
                code: 500
            });
        } else {
            res.status(500).json({
                message: 'Please Enter a Password longer than 8 characters!',
                code: 500
            });
        }
    }
};

exports.updateProfile = function (req, res) {
    User.findOne({
        _id: req.user
    }, function (err, user) {
        if (err) {
            res.status(500).json({
                message: 'User Details Update failed due to a System Error. - ' + JSON.stringify(err),
                code: 500
            });
        }
        if (!user) {
            res.status(404).json({
                message: 'User Not Found',
                code: 404
            });
        } else if (user) {
            User.findOneAndUpdate({_id: req.user},
                {$set: req.body}, {new: true}, function (err, userData) {
                    if (err) {
                        res.status(500).json({
                            message: 'User Details Update failed due to a System Error. - ' + JSON.stringify(err),
                            code: 500
                        });
                    }
                    res.status(202).json({
                        message: 'User Details Updated Successful!',
                        code: 202
                    });
                });
        }
    });
};

exports.getUserData = function (req, res) {
    console.log(req.user);
    User.findOne({
        _id: req.user
    }, function (err, user) {
        if (err) {
            res.status(500).json({
                message: 'User Details Failed failed due to a System Error. - ' + JSON.stringify(err),
                code: 500
            });
        }
        if (!user) {
            res.status(404).json({
                message: 'User Not Found',
                code: 404
            });
        } else if (user) {
            res.status(200).json({
                data: user,
                code: 200
            });
        }
    });
};
