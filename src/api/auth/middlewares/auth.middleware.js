const UserModel = require('../../users/models/users.model');
const crypto = require('crypto');

exports.hasSignupValidFields = (req, res, next) => {
    let errors = [];
    if (req.body) {
        if (!req.body.fullName) {
            errors.push('Missing full name field');
        }
        if (!req.body.email) {
            errors.push('Missing email field');
        }
        if (!req.body.password) {
            errors.push('Missing password field');
        }
        if (errors.length) {
            return res.status(400).json({errors: errors.join(',')});
        }
        else {
            return next();
        }
    }
    else {
        return res.status(400).json({errors: 'Missing full name, email and password fields'});
    }
};

exports.isPasswordAndUserMatch = (req, res, next) => {
    UserModel.findByEmail(req.body.email)
        .then((user) => {
            if(!user[0]) {
                res.status(400).json({errors: ['Invalid e-mail']});
            }
            else {
                let passwordFields = user[0].password.split('$');
                let salt = passwordFields[0];
                let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
                if (hash === passwordFields[1]) {
                    req.body = {
                        userId: user[0]._id,
                        email: user[0].email,
                        permissionLevel: user[0].permissionLevel,
                        provider: 'email',
                        name: user[0].firstName + ' ' + user[0].lastName,
                    };
                    return next();
                }
                else {
                    return res.status(400).json({errors: ['Invalid password']});
                }
            }
        });
};

exports.userDoesNotExist = (req, res, next) => {
    UserModel.findByEmail(req.body.email)
        .then((user) => {
            if(user[0]) {
                res.status(400).json({errors: ['Same email exists']});
            }
            else {
                next();
            }
    })
};

exports.hasSigninValidFields = (req, res, next) => {
    let errors = [];
    if (req.body) {
        if (!req.body.email) {
            errors.push('Missing email field');
        }
        if (!req.body.password) {
            errors.push('Missing password field');
        }
        if (errors.length) {
            return res.status(400).json({errors: errors.join(',')});
        }
        else {
            return next();
        }
    }
    else {
        return res.status(400).json({errors: 'Missing email and password fields'});
    }
};
