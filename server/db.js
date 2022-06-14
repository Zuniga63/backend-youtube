const mongoose = require('mongoose');

/**
 * Se habilita el envió de las variables virtuales
 */
mongoose.set('toJSON', { virtuals: true });

function connect() {
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;
  const db = process.env.DB_DATABASE;
  const uri = `${host}:${port}/${db}`;

  mongoose.connect(uri);

  mongoose.connection.once('open', () => {
    console.log(`Connection with mongo in ${host}:${port} with DB:${db}`);
  });

  mongoose.connection.on('error', (err) => {
    console.log('Something went wrong!', err);
  });

  return mongoose.connection;
}

module.exports = { connect };
