const APIRouter = require('express').Router();
const AuthRouter = require('./auth/auth.router');
const UsersRouter = require('./users/users.router');

APIRouter.use('/auth', AuthRouter);
APIRouter.use('/users', UsersRouter);

module.exports = APIRouter;