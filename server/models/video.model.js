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
    video: {
      type: Object,
      required: true,
    },
    image: {
      type: Object,
      required: true,
    },
    visits: {
      type: Number,
      require: false,
      default: 0,
    },
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

videoSchema.virtual('videoUrl').get(function get() {
  return this?.video?.url;
});

videoSchema.virtual('imageUrl').get(function get() {
  return this?.image?.url;
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
