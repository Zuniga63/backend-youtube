const app = require('./server/app');

app.listen(app.get('port'), () => {
  const port = app.get('port');
  const host = app.get('host');
  const env = app.get('env');

  console.log(`App running in port:${port}`);
  if (env === 'local') {
    console.log(`API Doc: ${host}:${port}/api-docs`);
  } else {
    console.log(`API Doc: ${host}/api-docs`);
  }
});
