const UsersRouter = require('express').Router();

const UsersController = require('./controllers/users.controller');
const PermissionMiddleware = require('../common/middlewares/permission.middleware');
const ValidationMiddleware = require('../common/middlewares/validation.middleware');
const PERMISSION_LEVELS = require('../common/config/env.config').PERMISSION_LEVELS;

const ADMIN = PERMISSION_LEVELS.ADMIN;
const PAID_USER = PERMISSION_LEVELS.PAID_USER;
const NORMAL_USER = PERMISSION_LEVELS.NORMAL_USER;

UsersRouter.get('/', [
    ValidationMiddleware.isValidJWT,
    ValidationMiddleware.validate,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    UsersController.list
]);

UsersRouter.get('/:userId', [
    ValidationMiddleware.isValidJWT,
    ValidationMiddleware.validate,
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    UsersController.getById
]);

UsersRouter.patch('/:userId', [
    ValidationMiddleware.isValidJWT,
    ValidationMiddleware.validate,
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    UsersController.patchById
]);

UsersRouter.delete('/:userId', [
    ValidationMiddleware.isValidJWT,
    ValidationMiddleware.validate,
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    UsersController.removeById
]);

module.exports = UsersRouter;
