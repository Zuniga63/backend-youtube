const Label = require('../models/label.model');
const Video = require('../models/video.model');
const { createSlug, normalizeLabelName } = require('../utils/labelUtils');
const sendError = require('../utils/sendError');

module.exports = {
  async list(_, res) {
    try {
      const labels = await Label.find();
      res.status(200).json({ labels });
    } catch (error) {
      sendError(error, res);
    }
  },
  async create(req, res) {
    const { name } = req.body;

    if (name === undefined) {
      res.status(400).json({ message: 'Nombre de etiqueta faltante.' });
      return;
    }

    const slug = createSlug(name);

    try {
      const label = await Label.create({
        name: normalizeLabelName(name),
        slug,
      });
      res.status(201).json({ message: 'Label was create', label });
    } catch (error) {
      sendError(error, res);
    }
  },
  async show(req, res) {
    try {
      const { slug } = req.params;

      if (!slug) {
        res.status(400).json({ message: 'Slug is required.' });
        return;
      }

      const label = await Label.findOne({ slug });
      if (!label) {
        res.status(404).json({ message: 'Etiqueta no encontrada' });
        return;
      }

      res.status(200).json({ label });
    } catch (error) {
      sendError(error, res);
    }
  },
  async update(req, res) {
    const { slug } = req.params;
    const { name } = req.body;

    try {
      if (name === undefined || !slug) {
        res.status(400).json({ message: 'Slug or label name missing' });
        return;
      }

      const newSlug = createSlug(name);

      // Se realiza la actualización
      const update = { name: normalizeLabelName(name) };
      if (newSlug !== slug) update.slug = newSlug;

      const label = await Label.findOneAndUpdate({ slug }, update, {
        new: true,
        runValidators: true,
      });

      if (!label) {
        res.status(404).json({ message: 'Etiqueta no encontrada.' });
        return;
      }

      res.status(200).json({ label, message: 'Etiqueta actualizada.' });
    } catch (error) {
      sendError(error, res);
    }
  },
  async destroy(req, res) {
    try {
      const { slug } = req.params;
      if (!slug) {
        res.status(400).json({ message: 'Slug is missing' });
        return;
      }

      const labelDeleted = await Label.findOneAndDelete({ slug });

      if (!labelDeleted) {
        res.status(404).json({ message: 'Etiqueta no encontrada.' });
        return;
      }

      // Se elimina la etiqueta de los video
      await Promise.all(
        labelDeleted.videos.map(async (videoId) => {
          const video = await Video.findById(videoId);
          if (video) {
            video.labels = video.labels.filter(
              (label) => label._id.toString() !== labelDeleted._id.toString()
            );

            await video.save({ validateBeforeSave: false });
          }
        }) // .end map
      );

      res.status(200).json({ label: labelDeleted, message: 'label deleted.' });
    } catch (error) {
      sendError(error, res);
    }
  },
};
