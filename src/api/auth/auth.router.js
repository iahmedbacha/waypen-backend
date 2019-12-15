const AuthRouter = require('express').Router();

const AuthMiddleware = require('./middlewares/auth.middleware');
const ValidationMiddleware = require('../common/middlewares/validation.middleware');
const AuthController = require('./controllers/auth.controller');
const UsersController = require('../users/controllers/users.controller');
const TextsController = require('../texts/controllers/texts.controller');

AuthRouter.post('/signup', [
    AuthMiddleware.signupValidationRules,
    ValidationMiddleware.validate,
    UsersController.insert,
    TextsController.insertDefault
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
