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
    body: {
      type: String,
      minlength: 3,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * create a virtual field which links between the field you've just declared
 * and the related collection.
 * localField is the name of the connecting field,
 * foreign field is a corresponding field in the connected collection
 * justOne says that it'll populate a single connected object,
 * set it to false if you need to get an array.
 * https://stackoverflow.com/questions/54429008/populating-mongoose-objects-from-id-to-new-field
 */
commentSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

commentSchema.virtual('video', {
  ref: 'Video',
  localField: 'videoId',
  foreignField: '_id',
  justOne: true,
});

// tell Mongoose to retreive the virtual fields
commentSchema.set('toObject', { virtuals: true });
commentSchema.set('toJSON', { virtuals: true });

const Comment = model('Comment', commentSchema);

module.exports = Comment;
