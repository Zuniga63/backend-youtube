require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');

const { connect } = require('./db');
const { transporter, verify } = require('./utils/mailer');

const app = express();
const port = process.env.APP_PORT;
const host = process.env.APP_URL;

connect();
verify(transporter);

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/', routes);

app.listen(port, () => {
  console.log(`App running in ${host}:${port}`);
  console.log(`API Doc: ${host}:${port}/api-docs`);
});
