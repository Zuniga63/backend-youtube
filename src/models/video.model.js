const { Schema, model } = require("mongoose");
const Comment = require ("../models/comment.model")

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
    imageUrl:String,
    visits: Number,
    labels: [String],
    comments: {
      type: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    },
  },
  {
    timestamps: true,
  }
);

//middleware to delete comments from the collections comments of the deleted video
videoSchema.pre("deleteOne", async function (next) {
  try {
    await Comment.deleteMany({videoId:this.getFilter()["_id"]})
    next()
  }catch (err){
    next(err)
  }
} )

const Video = model("Video", videoSchema);



module.exports = Video;
