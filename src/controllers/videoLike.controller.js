const { request, response } = require("express");
const User = require("../models/user.model");
const Video = require("../models/video.model");
const VideoLike = require("../models/videoLike.model");

module.exports = {
  /**
   * @param {request} req
   * @param {response} res
   */
  async list(req, res) {
    const likes = await VideoLike.find();
    res.status(200).json({ likes });
  },
  /**
   * @param {request} req
   * @param {response} res
   */
  async create(req, res) {
    const { videoId } = req.params;
    const userId = req.user;

    try {
      if (await VideoLike.exists({ videoId, userId })) {
        res.status(200).json({ message: "Ok" });
        return;
      }

      const video = await Video.findById(videoId);
      if (!video) {
        res.status(404).json({ message: "Video no encontrado." });
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado." });
        return;
      }

      const like = await VideoLike.create({ userId: user, videoId: video });

      //Se agrega los likes a las instancias
      video.likes.push(like);
      user.likes.push(like);

      await video.save({ validateBeforeSave: false });
      await user.save({ validateBeforeSave: false });
      res.status(201).json({ message: "OK" });
    } catch (error) {
      console.log(error);
      res.status(502).json(error);
    }
  },
  /**
   * @param {request} req
   * @param {response} res
   */
  async destroy(req, res) {
    const { videoId } = req.params;
    const userId = req.user;

    try {
      if (await VideoLike.exists({ videoId, userId })) {
        await VideoLike.deleteOne({ videoId, userId });
      }

      res.status(200).json({ message: "Like remove" });
    } catch (error) {
      console.log(error);
      res.status(502).end();
    }
  },
};
