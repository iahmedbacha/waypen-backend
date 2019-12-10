const jwt = require('jsonwebtoken')
const secret = require('../config/env.config.js').JWT_SECRET
const crypto = require('crypto');

exports.verifyRefreshBodyField = (req, res, next) => {
    if (req.body && req.body.refresh_token) {
        return next();
    }
    else {
        return res.status(400).json({errors: ['need to pass refresh_token field']});
    }
};

exports.validRefreshNeeded = (req, res, next) => {
    let b = new Buffer(req.body.refresh_token, 'base64');
    let refresh_token = b.toString();
    let hash = crypto.createHmac('sha512', req.jwt.refreshKey).update(req.jwt.userId + secret).digest("base64");
    if (hash === refresh_token) {
        req.body = req.jwt;
        return next();
    }
    else {
        return res.status(400).json({errors: ['Invalid refresh token']});
    }
};


exports.validJWTNeeded = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).json({errors: ['token type (Bearer) not mentioned']});
            }
            else {
                req.jwt = jwt.verify(authorization[1], secret);
                return next();
            }

        } catch (err) {
            return res.status(403).json({errors: ['JWT not valid']});
        }
    }
    else {
        return res.status(401).json({errors: ['JWT not valid']});
    }
};