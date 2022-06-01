const User = require("../models/user.model");

module.exports = {
  async list(req, res) {
    try {
      const users = await User.find();
      res.status(200).json({ message: "Users found", data: users });
    } catch (err) {
      res.status(404).json({ message: "Users not found" });
    }
  },

  async show(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      res.status(200).json({ message: "User found", data: user });
    } catch (err) {
      res.status(404).json({ message: "User not found", data: err });
    }
  },

  async create(req, res) {
    try {
      const data = req.body;
      const newUser = {
        ...data,
      };
      const user = await User.create(newUser);
      res.status(201).json({ message: "User created", data: user });
    } catch (err) {
      res.status(400).json({ message: "User could not be created", data: err });
    }
  },

  async update(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
      });
      res.status(200).json({ message: "User updated", data: user });
    } catch (err) {
      res.status(400).json({ message: "User could not be updated", data: err });
    }
  },

  async destroy(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findByIdAndDelete(userId);
      res.status(200).json({ message: "User deleted", data: user });
    } catch (err) {
      res.status(400).json({ message: "User could not be deleted", data: err });
    }
  },
};
