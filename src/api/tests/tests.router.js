const TestsRouter = require('express').Router();

const TestsController = require('./controllers/tests.controller');
const PersmissionnMiddleware = require('../common/middlewares/permission.middleware');
const ValidationMiddleware = require('../common/middlewares/validation.middleware');

TestsRouter.get('/', [
    ValidationMiddleware.isValidJWT,
    ValidationMiddleware.validate,
    PersmissionnMiddleware.onlySameUserOrAdminCanDoThisAction,
    TestsController.list
]);

TestsRouter.get('/:testId', [
    ValidationMiddleware.isValidJWT,
    ValidationMiddleware.validate,
    TestsController.getById
]);

TestsRouter.post('/', [
    ValidationMiddleware.isValidJWT,
    ValidationMiddleware.validate,
    TestsController.insert
]);

TestsRouter.patch('/:testId', [
    ValidationMiddleware.isValidJWT,
    ValidationMiddleware.validate,
    TestsController.patchById
]);

TestsRouter.delete('/:testId', [
    ValidationMiddleware.isValidJWT,
    ValidationMiddleware.validate,
    TestsController.removeById
]);

module.exports = TestsRouter;
