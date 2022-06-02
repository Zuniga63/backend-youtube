const Comment = require("../models/comment.model");
const User = require("../models/user.model");
const Video = require("../models/video.model");

module.exports = {
  async create(req, res) {
    try {
      const { userId, videoId } = req.body;
      const comment = await Comment.create({ ...req.body });

      const user = await User.findById(userId);
      user.comments.push(comment);

      const video = await Video.findById(videoId);
      video.comments.push(comment);

      video.save({ validateBeforeSave: false });
      user.save({ validateBeforeSave: false });

      res.status(201).json(comment);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  async destroy(req, res) {
    try {
      const { commentId } = req.params;
      const comment = await Comment.findById(commentId).remove();
      res.status(200).json({ message: "comment deleted", data: comment });
    } catch (err) {
      res
        .status(400)
        .json({ message: "Comment could not be deleted", data: err });
    }
  },
};
