
const { Schema, model } = require("mongoose");

const videoSchema = new Schema(
  {
    title: String,
    userId: Number,
    description: String,
    url: String,
    visits: Number,
    labels: [String],
  },
  {
    timestamps: true,
  }
);

const Video = model("Video", videoSchema);

module.exports = Video;