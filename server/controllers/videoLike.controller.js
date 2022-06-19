const User = require('../models/user.model');
const Video = require('../models/video.model');
const VideoLike = require('../models/videoLike.model');
const sendError = require('../utils/sendError');

module.exports = {
  /**
   * @param {request} req
   * @param {response} res
   */
  async list(req, res) {
    try {
      const likes = await VideoLike.find();
      res.status(200).json({ likes });
    } catch (error) {
      sendError(error, res);
    }
  },
  /**
   * @param {request} req
   * @param {response} res
   */
  async create(req, res) {
    const { videoId } = req.params;
    const userId = req.user;
    const userID = await User.findById(userId);
    const video = await Video.findById(videoId);
    try {
      if (!video) {
        res.status(404).json({ message: 'Video no encontrado.' });
        return;
      }

      if (!userID) {
        res.status(404).json({ message: 'Usuario no encontrado.' });
        return;
      }
      if (await VideoLike.exists({ videoId, userId })) {
        const like = await VideoLike.create({ userId: userID, videoId: video });

        video.likes.push(like);
        userID.likes.push(like);

        await video.save({ validateBeforeSave: false });
        await userID.save({ validateBeforeSave: false });
      }

      res.status(201).json({
        user: {
          name: userID.firstName,
          avatar: userID.avatarUrl,
          email: userID.email,
          likes: userID.likes,
        },
      });
    } catch (error) {
      sendError(error, res);
    }
  },
  /**
   * @param {request} req
   * @param {response} res
   */
  async destroy(req, res) {
    const { videoId } = req.params;
    const userId = req.user;
    const userID = await User.findById(userId);
    try {
      if (await VideoLike.exists({ videoId, userId })) {
        const likeId = await VideoLike.exists({ videoId, userId });
        await VideoLike.deleteOne({ videoId, userId });
        const extractId = likeId._id;
        const string = extractId.toString();

        const video = await Video.findById(videoId);
        video.likes = video.likes.filter(
          (item) => item._id.toString() !== string
        );
        await video.save({ validateBeforeSave: false });

        const user = await User.findById(userId);
        user.likes = user.likes.filter(
          (item) => item._id.toString() !== string
        );
        await user.save({ validateBeforeSave: false });
      }

      res.status(201).json({
        user: {
          name: userID.firstName,
          avatar: userID.avatarUrl,
          email: userID.email,
          likes: userID.likes,
        },
      });
    } catch (error) {
      sendError(error, res);
    }
  },
};
