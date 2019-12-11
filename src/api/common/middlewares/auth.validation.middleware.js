const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, header, validationResult } = require('express-validator');

const secret = require('../config/env.config.js').JWT_SECRET;

isValidJWT = header('authorization').custom(async (value, {req}) => {
    await (() => {
        let authorization = value.split(' ');
        if (authorization[0] !== 'Bearer') {
            throw new Error('Token type (Bearer) not mentioned');
        }
        else {
            try {
                req.jwt = jwt.verify(authorization[1], secret);
                return true;
            }
            catch (err) {
                throw new Error('Invalid JWT')
            }
        }
    })();
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

exports.refreshValidationRules = [
    isValidJWT,
    isValidRefreshToken
];

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    else {
        return next();
    }
};
