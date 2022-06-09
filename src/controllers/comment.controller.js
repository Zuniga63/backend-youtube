/* eslint-disable no-underscore-dangle */
const Comment = require('../models/comment.model');
const User = require('../models/user.model');
const Video = require('../models/video.model');

module.exports = {
  /**
   * @param {request} req
   * @param {response} res
   */
  async create(req, res) {
    try {
      const { videoId } = req.params;
      const userId = req.user;

      const user = await User.findById(req.user);
      const { commentBody } = req.body;

      if (!user) {
        res.status(404).json({ message: "Don't find the user" });
        return;
      }

      const video = await Video.findById(videoId);

      if (!video) {
        res.status(404).json({ message: "Don't find the video" });
        return;
      }

      const comment = await Comment.create({
        userId,
        videoId,
        commentBody,
      });

      video.comments.push(comment._id);
      await video.save({ validateBeforeSave: false });

      res.status(201).json({ message: "the comment it's created", comment });
    } catch (err) {
      res.status(400).json(err);
      console.log(err);
    }
  },

  async destroy(req, res) {
    try {
      const { commentId, videoId } = req.params;
      const userId = req.user;

      const userIdComment = await Comment.findById(commentId);

      if (userIdComment.userId.toString() !== userId) {
        res.status(403).json({ message: 'User no authorizes' });
        return;
      }
      const comment = await Comment.findByIdAndDelete(commentId);

      const video = await Video.findById(videoId);

      video.comments = video.comments.filter(
        (item) => item._id.toString() !== commentId
      );
      await video.save({ validateBeforeSave: false });

      res.status(200).json({ message: 'comment deleted', data: comment });
    } catch (err) {
      res
        .status(400)
        .json({ message: 'Comment could not be deleted', data: err });
    }
  },
};
