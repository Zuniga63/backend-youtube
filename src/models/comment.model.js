const { Schema, model } = require("mongoose");

const commentsSchema = new Schema(
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
    commentBody: String,
  },
  {
    timestamps: true,
  }
);

const Comments = model("Comments", commentsSchema);

module.exports = Comments;
