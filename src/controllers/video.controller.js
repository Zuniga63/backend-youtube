const Video = require("../models/video.model");
const User = require("../models/user.model");

module.exports = {
  async list(req, res) {
    try {
      const videos = await Video.find().populate("userId", "name email avatar");
      res.status(200).json({ message: "Videos found", data: videos });
    } catch (err) {
      res.status(404).json({ message: "Videos nor found" });
    }
  },

  async show(req, res) {
    try {
      const { videoId } = req.params;
      const video = await Video.findById(videoId)
        .populate("userId", "name email avatar")
        .populate({
          path: "comments",
          select: "commentBody",
          populate: { path: "userId", select:"name avatar" },
        });
      res.status(200).json({ message: "Video found", data: video });
    } catch (err) {
      res.status(404).json({ message: "Video not found", data: err });
    }
  },

  async create(req, res) {
    try {
      const { userId } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Invalid user");
      }
      const video = await Video.create({ ...req.body });
      res.status(201).json(video);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  async update(req, res) {
    try {
      const { videoId } = req.params;

      const video = await Video.findByIdAndUpdate(videoId, req.body, {
        new: true,
      });
      res.status(200).json({ message: "video updated", data: video });
    } catch (err) {
      res
        .status(400)
        .json({ message: "Video could not be updated", data: err });
    }
  },

  async destroy(req, res) {
    try {
      const { videoId } = req.params;
      const video = await Video.deleteOne({_id:videoId});
      res.status(200).json({ message: "video deleted", data: video });
    } catch (err) {
      res
        .status(400)
        .json({ message: "Video could not be deleted", data: err });
    }
  },
};
