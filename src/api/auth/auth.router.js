const AuthRouter = require('express').Router();

const AuthMiddleware = require('./middlewares/auth.middleware');
const AuthController = require('./controllers/auth.controller');
const AuthValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const UsersController = require('../users/controllers/users.controller');

AuthRouter.post('/signin', [
    AuthMiddleware.signinValidationRules,
    AuthValidationMiddleware.validate,
    AuthController.signin
]);

AuthRouter.post('/refresh', [
    AuthValidationMiddleware.refreshValidationRules,
    AuthValidationMiddleware.validate,
    AuthController.signin
]);

AuthRouter.post('/signup', [
    AuthMiddleware.signupValidationRules,
    AuthValidationMiddleware.validate,
    UsersController.insert
]);

module.exports = AuthRouter;
