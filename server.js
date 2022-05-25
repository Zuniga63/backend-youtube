const express = require("express");

const app = express();
const port = 8080;
app.use(express.json());

app.listen(port, () => {
  console.log(`Successfully run in port: http:localhost:${port}`);
});
