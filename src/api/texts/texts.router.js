const TextsRouter = require('express').Router();

const TextsController = require('./controllers/texts.controller');
const PersmissionnMiddleware = require('../common/middlewares/permission.middleware');
const ValidationMiddleware = require('../common/middlewares/validation.middleware');

TextsRouter.get('/', [
    ValidationMiddleware.isValidJWT,
    ValidationMiddleware.validate,
    PersmissionnMiddleware.onlySameUserOrAdminCanDoThisAction,
    TextsController.list
]);

TextsRouter.get('/:textId', [
    ValidationMiddleware.isValidJWT,
    ValidationMiddleware.validate,
    PersmissionnMiddleware.onlySameUserOrAdminCanDoThisAction,
    TextsController.getById
]);

TextsRouter.post('/', [
    ValidationMiddleware.isValidJWT,
    ValidationMiddleware.validate,
    PersmissionnMiddleware.onlySameUserOrAdminCanDoThisAction,
    TextsController.insert
]);

TextsRouter.patch('/:textId', [
    ValidationMiddleware.isValidJWT,
    ValidationMiddleware.validate,
    PersmissionnMiddleware.onlySameUserOrAdminCanDoThisAction,
    TextsController.patchById
]);

TextsRouter.delete('/:textId', [
    ValidationMiddleware.isValidJWT,
    ValidationMiddleware.validate,
    PersmissionnMiddleware.onlySameUserOrAdminCanDoThisAction,
    TextsController.removeById
]);

module.exports = TextsRouter;
