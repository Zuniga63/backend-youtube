const { Schema, model, models } = require('mongoose');

const validateSlug = async (slug) => {
  try {
    const label = await models.Label.findOne({ slug });
    return !label;
  } catch (error) {
    return false;
  }
};

const labelSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [3, 'Etiqueta demasiado corta.'],
      maxlength: [45, 'Etiqueta demasidado larga.'],
      required: [true, 'El nombre es requerido'],
    },
    slug: {
      type: String,
      minlength: [3, 'Slug demasiado corto.'],
      maxlength: [45, 'Slug demasidado largo.'],
      required: true,
      validate: {
        validator: validateSlug,
        message: 'Etiqueta ya en uso.',
      },
    },
    videos: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
      required: false,
    },
  },
  { timestamps: true }
);

const Label = model('Label', labelSchema);

module.exports = Label;
