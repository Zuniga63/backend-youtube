const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger");
require("dotenv").config();

const { connect } = require("./src/db");
const videoRouter = require("./src/routes/video");
const userRouter = require("./src/routes/user");
const comentRouter = require("./src/routes/comment");
const labelRouter = require("./src/routes/label");
const videoLikeRouter = require("./src/routes/videoLike");

const app = express();
const port = process.env.APP_PORT;
const host = process.env.APP_URL;
connect();

app.use(express.json());
app.use(cors());

app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/videos/comments/", comentRouter);
app.use("/label", labelRouter);
app.use("/video", videoLikeRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`App running in ${host}:${port}`);
});
