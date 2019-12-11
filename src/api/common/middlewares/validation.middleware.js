const jwt = require('jsonwebtoken');
const { header, validationResult } = require('express-validator');

const secret = require('../config/env.config').JWT_SECRET;

exports.isValidJWT = header('authorization').custom(async (value, {req}) => {
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

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    else {
        return next();
    }
};
