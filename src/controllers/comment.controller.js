const Comment = require("../models/comment.model");
const User = require("../models/user.model");
const Video = require("../models/video.model");

module.exports = {
  async create(req, res) {
    try {
      const { videoId } = req.body;
      const comment = await Comment.create({ ...req.body });

      const video = await Video.findById(videoId);
      video.comments.push(comment);
      video.save({ validateBeforeSave: false });

      res.status(201).json(comment);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  async destroy(req, res) {
    try {
      const { commentId } = req.params;
      const {videoId, userId} =req.body;

      const userIdComment = await Comment.findById(commentId)

      if (userIdComment.userId.toString() !== userId){
        res.status(403).json({message:"User no authorizes"})
        return
      }
      const comment = await Comment.findByIdAndDelete(commentId);

      const video = await Video.findById(videoId);

      video.comments = video.comments.filter ((item) => item._id.toString() !== commentId)
      video.save({ validateBeforeSave: false });

      res.status(200).json({ message: "comment deleted", data: comment });
    } catch (err) {
      res
        .status(400)
        .json({ message: "Comment could not be deleted", data: err });
    }
  },
};
