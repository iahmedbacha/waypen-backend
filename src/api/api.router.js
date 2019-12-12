const APIRouter = require('express').Router();
const AuthRouter = require('./auth/auth.router');
const UsersRouter = require('./users/users.router');
const TextsRouter = require('./texts/texts.router');

APIRouter.use('/auth', AuthRouter);
APIRouter.use('/users', UsersRouter);
APIRouter.use('/texts', TextsRouter);

module.exports = APIRouter;
