const { Schema, model } = require('mongoose');

const commentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
    commentBody: String,
  },
  {
    timestamps: true,
  }
);

const Comment = model('Comment', commentSchema);

module.exports = Comment;
