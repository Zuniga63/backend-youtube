const { Schema, model, models } = require("mongoose");

const nameRegex = new RegExp("[a-zA-Z]+"); //Just letters
const emailRegex = new RegExp("^[^@]+@[^@]+.[^@]+$"); // simply email validation
const passwordRegex = new RegExp(
  "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$"
); // Minimum 8 characters, has to be Alphanumeric and at least 1 special character
const userSchema = new Schema(
  {
    name: {
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
      match: [
        passwordRegex,
        "Debe ser de minimo 8 caracteres, alphanumerico y tener un caracter especial",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
