const Video = require("../models/video.model");
const User = require("../models/user.model");
const { request, response } = require("express");
const { createSlug } = require("../utils/labelUtils");
const Label = require("../models/label.model");

module.exports = {
  async list(req, res) {
    try {
      const videos = await Video.find().populate("userId", "name email avatar").populate("labels", "name slug");
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
          populate: { path: "userId", select: "name avatar" },
        });
      res.status(200).json({ message: "Video found", data: video });
    } catch (err) {
      res.status(404).json({ message: "Video not found", data: err });
    }
  },

  /**
   * @param {request} req
   * @param {response} res
   */
  async create(req, res) {
    try {
      const { labels: labelNames } = req.body;
      const labels = [];
      const info = {
        video: null,
        labelsCreated: 0,
      };

      const userId = req.user;
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado." });
        return;
      }

      //Se crean o se recuperan las instancias de labels
      if (labelNames && labelNames.length > 0) {

        for (let index = 0; index < labelNames.length; index++) {
          const name = labelNames[index];
          const slug = createSlug(name);
          let label = await Label.findOne({ slug });

          //Si no encunetra ninguna etiqueta, enconces se procede a crearla.
          if (!label) {
            label = await Label.create({ name, slug });
            if (!label) {
              res.status(502).json({ message: "No se pudieron crear las etiquetas." });
              return;
            }
            info.labelsCreated += 1;
          } //.end if

          labels.push(label);
        }
      }

      const video = await Video.create({ ...req.body, userId, labels });
      info.video = video;
      //Se agrega a cada etiqueta el video
      for (let index = 0; index < labels.length; index++) {
        const label = labels[index];
        label.videos.push(video._id);
        await label.save({ validateBeforeSave: false });
      }
      res.status(201).json(info);
    } catch (err) {
      res.status(502).json(err);
    }
  },

  async update(req, res) {
    try {
      const { videoId } = req.params;
      const userId = req.user;

      const video = await Video.findById(videoId);

      if (video.userId.toString() !== userId) {
        res.status(403).json({ message: "unauthorized user" });
        return;
      }

      const videoUpdated = await Video.findByIdAndUpdate(videoId, req.body, {
        new: true,
      });

      res.status(200).json({ message: "video updated", data: videoUpdated });
    } catch (err) {
      res.status(400).json({ message: "Video could not be updated", data: err });
    }
  },

  /**
   * @param {request} req
   * @param {response} res
   */
  async destroy(req, res) {
    try {
      const { videoId } = req.params;
      const userId = req.user;

      const video = await Video.findById(videoId);
      let labelUpdates = 0;
      if (!video) {
        res.status(404).json({ message: "Video no encontrado." });
        return;
      }

      if (video.userId.toString() !== userId) {
        res.status(403).json({ message: "unauthorized user" });
        return;
      }

      const videoDeleted = await Video.deleteOne({ _id: videoId });

      //Se elimina el video de las etiquetas
      const labels = video.labels;

      //Se busca cada etiqueta y se borra el video
      for (let index = 0; index < labels.length; index++) {
        const labelId = labels[index];
        const label = await Label.findById(labelId);

        label.videos = label.videos.filter((video) => video._id.toString() !== videoId);
        await label.save({ validateBeforeSave: false });
        labelUpdates += 1;
      }

      res.status(200).json({ message: "video Deleted", video, labelUpdates });
    } catch (error) {
      res.status(502).json(error);
    }
  },
};
