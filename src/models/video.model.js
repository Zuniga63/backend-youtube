const { Schema, model } = require("mongoose");
const Comment = require("../models/comment.model");
const VideoLike = require("./videoLike.model");

const videoSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: String,
    description: String,
    videoUrl: String,
    imageUrl: String,
    visits: Number,
    labels: [{ type: Schema.Types.ObjectId, ref: "Label" }],
    comments: {
      type: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: "VideoLike" }],
    },
  },
  {
    timestamps: true,
  }
);

//middleware to delete comments from the collections comments of the deleted video
videoSchema.pre("deleteOne", async function (next) {
  try {
    const videoId = this.getFilter()["_id"];
    await Comment.deleteMany({ videoId });
    await VideoLike.deleteMany({ videoId });
    next();
  } catch (err) {
    next(err);
  }
});

const Video = model("Video", videoSchema);

module.exports = Video;
