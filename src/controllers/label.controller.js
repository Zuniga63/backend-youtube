const Label = require("../models/label.model");
const Video = require("../models/video.model");
const { createSlug } = require("../utils/labelUtils");

module.exports = {
  async list(_, res) {
    try {
      const labels = await Label.find();
      res.status(200).json({ labels });
    } catch (error) {
      res.status(502).json(error);
    }
  },
  async create(req, res) {
    const { name } = req.body;

    if (name === undefined) {
      res.status(400).json({ message: "Nombre de etiqueta faltante." });
      return;
    }

    const slug = createSlug(name);

    try {
      const label = await Label.create({ name, slug });
      res.status(201).json({ message: "Label was create", label });
    } catch (error) {
      console.log(error);
      res.status(502).json(error);
    }
  },
  async show(req, res) {
    try {
      const { slug } = req.params;

      if (!slug) {
        res.status(400).json({ message: "Slug is required." });
        return;
      }

      const label = await Label.findOne({ slug });
      if (!label) {
        res.status(404).json({ message: "Etiqueta no encontrada" });
        return;
      }

      res.status(200).json({ label });
    } catch (error) {
      res.status(502).json(error);
    }
  },
  async update(req, res) {
    const { slug } = req.params;
    const { name } = req.body;

    try {
      if (name === undefined || !slug) {
        res.status(400).json({ message: "Slug or label name missing" });
        return;
      }

      const newSlug = createSlug(name);

      //Se realiza la actualización
      const update = { name };
      if (newSlug !== slug) update.slug = newSlug;
      const label = await Label.findOneAndUpdate({ slug }, update, { new: true, runValidators: true });

      if (!label) {
        res.status(404).json({ message: "Etiqueta no encontrada." });
        return;
      }

      res.status(200).json({ label, message: "Etiqueta actualizada." });
    } catch (error) {
      res.status(502).json(error);
    }
  },
  async destroy(req, res) {
    try {
      const { slug } = req.params;
      if (!slug) {
        res.status(400).json({ message: "Slug is missing" });
        return;
      }

      const label = await Label.findOneAndDelete({ slug });
      if (!label) {
        res.status(404).json({ message: "Etiqueta no encontrada." });
        return;
      }

      console.log(label);

      //Ahora se elimina la realción de los videos
      for (let index = 0; index < label.videos.length; index++) {
        const video = await Video.findById(label.videos[index]);
        const labelId = label._id.toString();
        if (video) {
          video.labels = video.labels.filter((label) => label._id.toString() !== labelId);
          await video.save({ validateBeforeSave: false });
        }
      }

      res.status(200).json({ label, message: "label deleted." });
    } catch (error) {
      res.status(502).json(error);
    }
  },
};
