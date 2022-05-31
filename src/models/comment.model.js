const { Schema, model } = require("mongoose");

const commentsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoId: String,
    body: String,
    likes: Array,
    replies: Array,
  },
  {
    timestamps: true,
  }
);

const Comments = model("Comments", commentsSchema);

module.exports = Comments;
