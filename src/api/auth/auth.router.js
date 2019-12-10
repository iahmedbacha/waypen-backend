const AuthRouter = require('express').Router();

const AuthMiddleware = require('./middlewares/auth.middleware');
const AuthController = require('./controllers/auth.controller');
const AuthValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const UsersController = require('../users/controllers/users.controller');

AuthRouter.post('/signin', [
    AuthMiddleware.hasSigninValidFields,
    AuthMiddleware.isPasswordAndUserMatch,
    AuthController.signin
]);

AuthRouter.post('/refresh', [
    AuthValidationMiddleware.validJWTNeeded,
    AuthValidationMiddleware.verifyRefreshBodyField,
    AuthValidationMiddleware.validRefreshNeeded,
    AuthController.signin
]);

AuthRouter.post('/signup', [
    AuthMiddleware.hasSignupValidFields,
    AuthMiddleware.userDoesNotExist,
    UsersController.insert
]);

module.exports = AuthRouter;
