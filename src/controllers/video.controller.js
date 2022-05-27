const Video = require("../models/video.model");

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
      .then((video) => {
        res.status(200).json({ message: "Video found", data: video });
      })
      .catch((err) => {
        res.status(404).json({ message: "Video not found" });
      });
  },

  create(req, res) {
    const data = req.body;
    const newVideo = {
      ...data,
    };
    Video.create(newVideo)
      .then((video) => {
        res.status(201).json({ message: "Video created", data: video });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ message: "Video could not be created", data: err });
      });
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
