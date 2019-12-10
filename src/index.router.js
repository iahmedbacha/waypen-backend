const IndexRouter = require('express').Router();
const APIRouter = require('./api/api.router');

IndexRouter.use('/api', APIRouter);

module.exports = IndexRouter;