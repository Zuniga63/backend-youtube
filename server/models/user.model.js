const { Schema, model, models } = require('mongoose');
const bcrypt = require('bcrypt');

const nameRegex = /[a-zA-Z]+/; // Just letters
const emailRegex = /^[^@]+@[^@]+.[^@]+$/; // simply email validation
const strongPass =
  /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;

const userSchema = new Schema(
  {
    firstName: {
      required: true,
      type: String,
      match: [nameRegex, 'Nombre no debe contener numeros'],
    },
    lastName: {
      required: true,
      type: String,
      match: [nameRegex, 'Nombre no debe contener numeros'],
    },
    avatar: Object,
    email: {
      type: String,
      required: true,
      match: [emailRegex, 'Email Invalido'],
      validate: [
        {
          validator(value) {
            return models.User.findOne({ email: value })
              .then((user) => !user)
              .catch(() => false);
          },
          message: 'Ya existe un usuario registrado con ese correo',
        },
      ],
    },
    password: {
      required: [true, 'La contraseña es requerida'],
      match: [strongPass, 'La contraseña no es segura'],
      type: String,
    },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: 'VideoLike' }],
    },
    videos: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
    },
    viewingHistory: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
    },
  },
  {
    timestamps: true,
  }
);

//----------------------------------------------------------
// MIDLEWARES
//----------------------------------------------------------

userSchema.pre('save', function encryptPassword(next) {
  const user = this; // This is the document
  const saltRounds = 10; // number of salt before encryp

  if (this.isModified('password') || this.isNew) {
    // eslint-disable-next-line consistent-return
    bcrypt.genSalt(saltRounds, (saltError, salt) => {
      if (saltError) return next(saltError);

      // eslint-disable-next-line consistent-return
      bcrypt.hash(user.password, salt, (hashError, hash) => {
        if (hashError) return next(hashError);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

//----------------------------------------------------------
// VIRTUALS
//----------------------------------------------------------

userSchema
  .virtual('fullName')
  .get(function get() {
    const { firstName, lastName } = this;
    return `${firstName} ${lastName}`;
  })
  .set(function set(fullName) {
    const [firstName, lastName] = fullName.split(' ');
    this.firstName = firstName;
    this.lastName = lastName;
  });

userSchema.virtual('avatarUrl').get(function get() {
  const { firstName, lastName } = this;
  if (!this.avatar) {
    const uri = 'https://ui-avatars.com/api/?background=random';
    const avatarName = `${firstName}+${lastName}`.replaceAll(' ', '+');
    return `${uri}&name=${avatarName}`;
  }

  return this.avatar.url;
});

const User = model('User', userSchema);

module.exports = User;
