const Video = require("../models/video.model");
const User = require ("../models/user.model");

module.exports = {

  list(req, res) {
    Video.find()
      .then((videos) => {
        res.status(200).json({ message: "Videos found", data: videos });
      })
      .catch((err) => {
        res.status(404).json({ message: "Videos nor found" });
      });
  },

  show(req, res) {
    const { videoId } = req.params;

    Video.findById(videoId)
      .populate("userId", "name email")
      .then((video) => {
        res.status(200).json({ message: "Video found", data: video });
      })
      .catch((err) => {
        res.status(404).json({ message: "Video not found" });
      });
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

    }catch (err){
      res.status(400).json(err);
    }
  },

  update(req, res) {
    const { videoId } = req.params;

    Video.findByIdAndUpdate(videoId, req.body, { new: true })
      .then((video) => {
        res.status(200).json({ message: "video updated", data: video });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ message: "Video could not be updated", data: err });
      });
  },

  destroy(req, res) {
    const { videoId } = req.params;

    Video.findByIdAndDelete(videoId)
      .then((video) => {
        res.status(200).json({ message: "video deleted", data: video });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ message: "Video could not be deleted", data: err });
      });
  },
};
