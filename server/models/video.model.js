const { Schema, model } = require('mongoose');
const Comment = require('./comment.model');
const VideoLike = require('./videoLike.model');

const videoSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      minlength: 3,
      maxlength: 90,
      required: true,
    },
    description: String,
    videoUrl: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    visits: Number,
    labels: [{ type: Schema.Types.ObjectId, ref: 'Label' }],
    comments: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: 'VideoLike' }],
    },
  },
  {
    timestamps: true,
  }
);

videoSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

videoSchema.set('toObject', { virtuals: true });
videoSchema.set('toJSON', { virtuals: true });

// middleware to delete comments from the collections comments of the deleted video
videoSchema.pre('deleteOne', async function cascadeOnDelete(next) {
  try {
    const { _id: videoId } = this.getFilter();
    await Comment.deleteMany({ videoId });
    await VideoLike.deleteMany({ videoId });
    next();
  } catch (err) {
    next(err);
  }
});

const Video = model('Video', videoSchema);

module.exports = Video;
