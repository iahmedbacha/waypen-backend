const UsersRouter = require('express').Router();

const UsersController = require('./controllers/users.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');

const config = require('../common/config/env.config');

const ADMIN = config.PERMISSION_LEVELS.ADMIN;
const PAID = config.PERMISSION_LEVELS.PAID_USER;
const FREE = config.PERMISSION_LEVELS.NORMAL_USER;

UsersRouter.get('/', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    UsersController.list
]);

UsersRouter.get('/:userId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    UsersController.getById
]);

UsersRouter.patch('/:userId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    UsersController.patchById
]);

UsersRouter.delete('/:userId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    UsersController.removeById
]);

module.exports = UsersRouter;
