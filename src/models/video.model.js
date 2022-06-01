const { Schema, model } = require("mongoose");

const videoSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: String,
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
