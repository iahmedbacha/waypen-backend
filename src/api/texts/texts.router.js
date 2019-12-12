const TextsRouter = require('express').Router();

const TextsController = require('./controllers/texts.controller');
const ValidationMiddleware = require('../common/middlewares/validation.middleware');

TextsRouter.get('/', [
    ValidationMiddleware.isValidJWT,
    ValidationMiddleware.validate,
    TextsController.list
]);

TextsRouter.get('/:textId', [
    ValidationMiddleware.isValidJWT,
    ValidationMiddleware.validate,
    TextsController.getById
]);

TextsRouter.post('/', [
    ValidationMiddleware.isValidJWT,
    ValidationMiddleware.validate,
    TextsController.insert
]);

TextsRouter.patch('/:textId', [
    ValidationMiddleware.isValidJWT,
    ValidationMiddleware.validate,
    TextsController.patchById
]);

TextsRouter.delete('/:textId', [
    ValidationMiddleware.isValidJWT,
    ValidationMiddleware.validate,
    TextsController.removeById
]);

module.exports = TextsRouter;
