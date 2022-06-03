const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

  async signup(req, res) {
    try {
      const { password, name } = req.body;
      let { avatar } = req.body;
      const encPassword = await bcrypt.hash(password, 8);

      if(!avatar){
        const uri ="https://ui-avatars.com/api/?background=random"
        const avatarName = name.replace(" ", "+");
        avatar = `${uri}&name=${avatarName}`
      }
      const user = await User.create({ ...req.body, password: encPassword, avatar });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: 60 * 60 * 24,
      });
      
      res.status(201).json({
        message: "User created",
        data: {
          token: token,
          user: {
            name: user.name,
            avatar: user.avatar,
            email: user.email,
          },
        },
      });
    } catch (err) {
      res.status(400).json({ message: "User could not be created", data: err });
    }
  },

  async signin(req, res) {
    try {
      const {email,  password } = req.body;

      const user = await User.findOne({email})

      if(!user) {
        throw new Error("Usuario o contraseña invalida");
      }
      
      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid){
        throw new Error("Usuario o contraseña invalida");
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: 60 * 60 * 24,
      });

      res.status(201).json({
        message: "User login",
        data: {
          token: token,
          user: {
            name: user.name,
            avatar: user.avatar,
            email: user.email,
          },
        },
      });
    } catch (err) {
      res.status(400).json({ message: "User could not login", data: err });
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
