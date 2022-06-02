const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { connect } = require("./src/db");
const videoRouter = require("./src/routes/video");
const userRouter = require("./src/routes/user");
const comentRouter = require("./src/routes/comment");

const app = express();
const port = process.env.PORT;
connect();

app.use(express.json());
app.use(cors());

app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/comments", comentRouter);

app.listen(port, () => {
  console.log(`Successfully run in port: http:localhost:${port}`);
});
