const jwt = require('jsonwebtoken');
const secret = require('../config/env.config')['JWT_SECRET'];

const ADMIN_PERMISSION = require('../../common/config/env.config').PERMISSION_LEVELS.ADMIN;

exports.minimumPermissionLevelRequired = (required_permission_level) => {
    return (req, res, next) => {
        let user_permission_level = parseInt(req.jwt.permissionLevel);
        if (user_permission_level & required_permission_level) {
            return next();
        }
        else {
            return res.status(403).json({errors: ['Permission not granted']});
        }
    };
};

exports.onlySameUserOrAdminCanDoThisAction = (req, res, next) => {
    let user_permission_level = parseInt(req.jwt.permissionLevel);
    let userId = req.jwt.userId;
    if (req.params && req.params.userId && userId === req.params.userId) {
        return next();
    }
    else {
        if (user_permission_level & ADMIN_PERMISSION) {
            return next();
        }
        else {
            return res.status(403).json({errors: ['Action not permitted']});
        }
    }
};

exports.sameUserCantDoThisAction = (req, res, next) => {
    let userId = req.jwt.userId;
    if (req.params.userId !== userId) {
        return next();
    }
    else {
        return res.status(400).json({errors: ['action not permitted']});
    }
};
