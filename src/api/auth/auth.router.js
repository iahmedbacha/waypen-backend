const AuthRouter = require('express').Router();

const AuthMiddleware = require('./middlewares/auth.middleware');
const ValidationMiddleware = require('../common/middlewares/validation.middleware');
const AuthController = require('./controllers/auth.controller');
const UsersController = require('../users/controllers/users.controller');

AuthRouter.post('/signup', [
    AuthMiddleware.signupValidationRules,
    ValidationMiddleware.validate,
    UsersController.insert,
    AuthController.signin
]);

AuthRouter.post('/signin', [
    AuthMiddleware.signinValidationRules,
    ValidationMiddleware.validate,
    AuthController.signin
]);

AuthRouter.post('/refresh', [
    AuthMiddleware.refreshValidationRules,
    ValidationMiddleware.validate,
    AuthController.signin
]);

module.exports = AuthRouter;
