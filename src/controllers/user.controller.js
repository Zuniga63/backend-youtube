const User = require("../models/user.model");

module.exports = {
  list(req, res) {
    User.find()
      .then((user) => {
        res.status(200).json({ message: "Users found", data: user });
      })
      .catch((err) => {
        res.status(404).json({ message: "Users not found" });
      });
  },

  show(req, res) {
    const { userId } = req.params;

    User.findById(userId)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(404).json({ message: "User not found" });
      });
  },

  create(req, res) {
    const data = req.body;
    const newUser = {
      ...data,
    };
    User.create(newUser)
      .then((user) => {
        res.status(201).json({ message: "User created", data: user });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ message: "User could not be created", data: err });
      });
  },

  update(req, res) {
    const { userId } = req.params;

    User.findByIdAndUpdate(userId, req.body, { new: true })
      .then((user) => {
        res.status(200).json({ message: "User updated", data: user });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ message: "User could not be updated", data: err });
      });
  },

  destroy(req, res) {
    const { userId } = req.params;

    User.findByIdAndDelete(userId)
      .then((user) => {
        res.status(200).json({ message: "User deleted", data: user });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ message: "User could not be deleted", data: err });
      });
  },
};
