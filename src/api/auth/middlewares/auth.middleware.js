const crypto = require('crypto');
const { body } = require('express-validator');

const ValidationMiddleware = require('../../common/middlewares/validation.middleware');
const UserModel = require('../../users/models/users.model');
const secret = require('../../common/config/env.config.js').JWT_SECRET;

isNewUser = body('email').custom(async value => {
    await UserModel.findByEmail(value).then(user => {
        if (user[0]) {
            throw new Error('Email already in use');
        }
        return true;
    });
});

isPasswordAndUserMatch = body().custom(async (body, {req}) => {
    await UserModel.findByEmail(body.email).then(user => {
        if (!user[0]) {
            throw new Error('Invalid email');
        }
        else {
            let passwordFields = user[0].password.split('$');
            let salt = passwordFields[0];
            let hash = crypto.createHmac('sha512', salt).update(body.password).digest("base64");
            if (hash === passwordFields[1]) {
                req.body = {
                    userId: user[0]._id,
                    email: user[0].email,
                    permissionLevel: user[0].permissionLevel,
                    provider: 'email',
                    name: user[0].fullName
                };
                return true;
            }
            else {
                throw new Error('Invalid password');
            }
        }
    });
});

isValidRefreshToken = body('refresh_token').custom(async (value, {req}) => {
    await (() => {
        let b = new Buffer(value, 'base64');
        let refresh_token = b.toString();
        let hash = crypto.createHmac('sha512', req.jwt.refreshKey).update(req.jwt.userId + secret).digest("base64");
        if (hash === refresh_token) {
            req.body = req.jwt;
            return true;
        }
        else {
            throw new Error('Invalid refresh token');
        }
    })();
});

exports.signupValidationRules = [
    body('fullName').not().isEmpty().trim(),
    body('email').isEmail(),
    body('password').isLength({min: 8}),
    isNewUser
];

exports.signinValidationRules = [
    body('email').isEmail(),
    body('password').isLength({min: 8}),
    isPasswordAndUserMatch
];

exports.refreshValidationRules = [
    ValidationMiddleware.isValidJWT,
    isValidRefreshToken
];
