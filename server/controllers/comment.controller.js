/* eslint-disable no-underscore-dangle */
const Comment = require('../models/comment.model');
const User = require('../models/user.model');
const Video = require('../models/video.model');
const sendError = require('../utils/sendError');

const userNotFound = { message: 'Usuario no encontrado.' };
const commentNotFound = { message: 'Comentario no encontrado.' };
const videoNotFound = { message: 'Video no encontrado.' };

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
        body: commentBody,
      });

      video.comments.push(comment._id);
      await video.save({ validateBeforeSave: false });

      res.status(201).json({ message: 'Ok', comment });
    } catch (err) {
      sendError(err, res);
    }
  },

  /**
   * Recupera los comentarios asociados del video.
   * @param {object} req
   * @param {object} res
   */
  async getVideoComments(req, res) {
    const { videoId } = req.params;

    try {
      const comments = await Comment.find({ videoId })
        .sort('createdAt')
        .populate({ path: 'user', select: 'id firstName lastName avatar' });

      res.status(200).json({
        message: 'Ok',
        comments,
      });
    } catch (error) {
      sendError(error, res);
    }
  },
  async userComments(req, res) {
    const userId = req.user;

    try {
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({
          message: 'Usuario no encontrado.',
        });
      }

      const comments = await Comment.find({ userId }).populate({
        path: 'video',
        select: 'id, title imageUrl',
      });

      res.status(200).json({
        message: 'Ok',
        comments,
      });
    } catch (error) {
      sendError(error, res);
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
      sendError(err, res);
    }
  },
  async update(req, res) {
    const { videoId, commentId } = req.params;
    const { commentBody } = req.body;

    try {
      const user = await User.findById(req.user);
      if (!user) {
        res.status(404).json(userNotFound);
        return;
      }

      const video = await Video.findById(videoId);
      if (!video) {
        res.status(404).json(videoNotFound);
        return;
      }

      // Se recupera el comentario
      const comment = await Comment.findById(commentId).where({
        userId: user.id,
        videoId: video.id,
      });

      if (!comment) {
        res.status(404).json(commentNotFound);
        return;
      }

      comment.body = commentBody;
      await comment.save({ validateBeforeSave: true });

      res.status(200).json({ message: 'Comentario Actualizado.', comment });
    } catch (error) {
      sendError(error, res);
    }
  },
};
