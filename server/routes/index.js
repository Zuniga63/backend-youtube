const rootRouter = require('express').Router();
const swaggerUi = require('swagger-ui-express');

const authRouter = require('./authRouter');
const videoRouter = require('./video');
const userRouter = require('./user');
const commentRouter = require('./comment');
const labelRouter = require('./label');
const videoLikeRouter = require('./videoLike');
const swaggerDocument = require('../swagger');

rootRouter.use('/auth', authRouter);
rootRouter.use('/videos', videoRouter);
rootRouter.use('/labels', labelRouter);
rootRouter.use('/user', userRouter);
rootRouter.use('/', commentRouter);
rootRouter.use('/video', videoLikeRouter);

rootRouter.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = rootRouter;
