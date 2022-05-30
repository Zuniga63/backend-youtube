const express = require("express");
const cors = require ("cors");
const { connect } = require("./src/db");
const videoRouter = require ("./src/routes/video");
const userRouter = require("./src/routes/user");

const app = express();
const port = 8080;
connect();

app.use(express.json());
app.use(cors());

app.use("/videos", videoRouter);
app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`Successfully run in port: http:localhost:${port}`);
});
