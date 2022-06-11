const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');

const mongoose = require('mongoose');
const { connect } = require('./src/db');

const swaggerDocument = require('./swagger');

const videoRouter = require('./src/routes/video');
const userRouter = require('./src/routes/user');
const commentRouter = require('./src/routes/comment');
const labelRouter = require('./src/routes/label');
const videoLikeRouter = require('./src/routes/videoLike');

const app = express();
const port = process.env.APP_PORT;
const host = process.env.APP_URL;

mongoose.set('toJSON', { virtuals: true });
connect();

app.use(express.json());
app.use(cors());

app.use('/videos', videoRouter);
app.use('/labels', labelRouter);
app.use('/user', userRouter);
app.use('/', commentRouter);
app.use('/video', videoLikeRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`App running in ${host}:${port}`);
});
