const { Schema, model } = require("mongoose");

const videoSchema = new Schema(
  {
    title: String,
    description: String,
    url: String,
    visits: Number,
    labels: [String],
    coments: {
      type: Schema.Types.ObjectId,
      ref: "Coment",
    },
  },
  {
    timestamps: true,
  }
);

const Video = model("Video", videoSchema);

module.exports = Video;
