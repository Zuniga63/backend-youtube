require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');

const { connect } = require('./db');
const { transporter, verify } = require('./utils/mailer');

const app = express();
app.use(cors());
app.options('*', cors());

app.set('port', process.env.PORT || process.env.APP_PORT);
app.set('host', process.env.APP_URL);
app.set('env', process.env.APP_ENV || 'local');

connect();
verify(transporter);

app.use(express.json());

app.use(morgan('dev'));
app.use('/', routes);

module.exports = app;
