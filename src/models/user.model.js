const { Schema, model, models } = require("mongoose");

const nameRegex = new RegExp("[a-zA-Z]+"); //Just letters
const emailRegex = new RegExp("^[^@]+@[^@]+.[^@]+$"); // simply email validation

const userSchema = new Schema(
  {
    firstName: {
      required: true,
      type: String,
      match: [nameRegex, "Nombre no debe contener numeros"],
    },
    lastName: {
      required: true,
      type: String,
      match: [nameRegex, "Nombre no debe contener numeros"],
    },
    avatar: String,
    email: {
      type: String,
      required: true,
      match: [emailRegex, "Email Invalido"],
      validate: [
        {
          validator(value) {
            return models.User.findOne({ email: value })
              .then((user) => !user)
              .catch(() => false);
          },
          message: "Ya existe un usuario registrado con ese correo",
        },
      ],
    },
    password: {
      required: true,
      type: String,
    },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: "VideoLike" }],
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
