const { Schema, model, models } = require('mongoose');

const nameRegex = /[a-zA-Z]+/; // Just letters
const emailRegex = /^[^@]+@[^@]+.[^@]+$/; // simply email validation

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
    avatar: String,
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
      required: true,
      type: String,
    },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: 'VideoLike' }],
    },
  },
  {
    timestamps: true,
  }
);

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

  return this.avatar;
});

const User = model('User', userSchema);

module.exports = User;
