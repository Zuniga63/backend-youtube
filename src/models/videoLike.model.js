const { Schema, model } = require("mongoose");

const videoLikeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
  },
  { timestamps: true }
);

const VideoLike = model("VideoLike", videoLikeSchema);

module.exports = VideoLike;
