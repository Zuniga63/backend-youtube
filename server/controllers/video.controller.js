/* eslint-disable prefer-arrow-callback */
const Video = require('../models/video.model');
const User = require('../models/user.model');
const { createSlug, normalizeLabelName } = require('../utils/labelUtils');
const Label = require('../models/label.model');
const VideoLike = require('../models/videoLike.model');
const sendError = require('../utils/sendError');

/**
 * @param {Array} labelNames -  Arreglo con los nombres de las etiquetas a crear o buscar.
 * @returns
 */

// function to implement fuzzy search
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const findOrCreateLabels = async (labelNames = []) => {
  let labels = [];
  let errors = [];

  try {
    if (labelNames && labelNames.length > 0) {
      await Promise.all(
        labelNames.map(async (name) => {
          const slug = createSlug(name.trim());

          const label = await Label.findOne({ slug });

          if (label) {
            labels.push(label);
          } else {
            const newLabel = await Label.create({
              name: normalizeLabelName(name),
              slug: createSlug(name),
            });
            if (newLabel) {
              labels.push(newLabel);
            } else {
              errors.push(name);
            }
          }
        })
      );
    }
  } catch (error) {
    console.group('findOrCreate');
    console.log(error);
    console.groupEnd();
  } finally {
    labels = [];
    errors = [];
  }
  return { labels, errors };
};

module.exports = {
  async list(req, res) {
    try {
      const videos = await Video.find()
        .populate('user', 'firstName lastName email avatar')
        .populate('labels', 'name slug');
      res.status(200).json({ message: 'Videos found', videos });
    } catch (error) {
      sendError(error, res);
    }
  },

  /**
   * ! Se necesita agregar un midleware para recuperar el id
   * @param {request} req
   * @param {response} res
   */
  async show(req, res) {
    try {
      const { videoId } = req.params;
      const userId = req.user;
      let userLikeVideo = false;

      // Se recupera el video
      const video = await Video.findById(videoId)
        .populate('labels', 'name slug')
        .populate('user', 'firstName lastName email avatar');

      if (!video) {
        res.status(404).json({ message: 'video not found.' });
        return;
      }

      /**
       * ! Se necesita agregar un midleware para recuperar el id
       * ! del usuario sin tener que estar validando.
       * ! Este codigo no funciona de momento.
       */
      if (userId) {
        if (await VideoLike.exists({ userId, videoId: video._id })) {
          userLikeVideo = true;
        }
      }

      /**
       * * Unica forma que encontre para gregar esas dos proiedades.
       */
      const videoData = {
        ...video.toObject(),
        likes: video.likes.length,
        userLikeVideo,
      };

      res.status(200).json({ message: 'Video found', video: videoData });
    } catch (error) {
      sendError(error, res);
    }
  },

  async search(req, res) {
    const { search, page = 1, limit = 10 } = req.query;
    // const { search } = req.query;
    const fuzzySearch = new RegExp(escapeRegex(search), 'gi');
    Video.aggregate([
      {
        $lookup: {
          from: 'labels',
          localField: 'labels',
          foreignField: '_id',
          as: 'labels',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $match: {
          $or: [
            { title: { $regex: fuzzySearch } },
            { 'labels.name': { $regex: fuzzySearch } },
          ],
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit * 1 },
    ]).exec(function (error, results) {
      if (error) {
        sendError(error);
        return;
      }
      res.status(200).json({ message: 'Video found', results });
    });
  },
  /**
   * @param {request} req
   * @param {response} res
   */
  async create(req, res) {
    try {
      const {
        title,
        description,
        image: imageInfo,
        video: videoInfo,
        labels: labelNames,
      } = req.body;

      const userId = req.user;
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado.' });
        return;
      }

      const { labels, errors: labelErrors } = await findOrCreateLabels(
        JSON.parse(labelNames)
      );

      const video = await Video.create({
        title,
        description,
        imageUrl: imageInfo.url,
        videoUrl: videoInfo.url,
        userId,
        labels,
      });

      // Se agrega a cada etiqueta el video
      const labelUpdates = [];
      const updateOptions = { validateBeforeSave: false };
      for (let index = 0; index < labels.length; index += 1) {
        const label = labels[index];
        label.videos.push(video._id);
        labelUpdates.push(label.save(updateOptions));
      }

      await Promise.all(labelUpdates);

      res.status(201).json({
        message: 'Video creado exitosamente',
        video,
        labelErrors,
      });
    } catch (error) {
      sendError(error, res);
    }
  },

  async update(req, res) {
    try {
      const { videoId } = req.params;
      const userId = req.user;

      const video = await Video.findById(videoId);

      if (video.userId.toString() !== userId) {
        res.status(403).json({ message: 'unauthorized user' });
        return;
      }

      const videoUpdated = await Video.findByIdAndUpdate(videoId, req.body, {
        new: true,
      });

      res.status(200).json({ message: 'video updated', data: videoUpdated });
    } catch (error) {
      sendError(error, res);
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
      if (!video) {
        res.status(404).json({ message: 'Video no encontrado.' });
        return;
      }

      if (video.userId.toString() !== userId) {
        res.status(403).json({ message: 'unauthorized user' });
        return;
      }

      await Video.deleteOne({ _id: videoId });

      /**
       * * Esta es una forma de hacer peticiones asincronas en bucles
       * ! Ojo que el async esta dentro del map.
       */
      const labels = [];
      await Promise.all(
        video.labels.map(async (labelId) => {
          const label = await Label.findById(labelId);
          labels.push(label);
        })
      );

      // Se actualizan las etiquetas
      const labelUpdates = [];
      for (let index = 0; index < labels.length; index += 1) {
        const label = labels[index];
        label.videos = label.videos.filter(
          (item) => item._id.toString() !== videoId
        );

        /**
         * El metodo label.save() es asincrono y retorna una promesa.
         */
        labelUpdates.push(label.save({ validateBeforeSave: false }));
      }
      await Promise.all(labelUpdates);

      res.status(200).json({
        message: 'video Deleted',
        video,
        labelUpdates: labelUpdates.length,
      });
    } catch (error) {
      sendError(error, res);
    }
  },
};
