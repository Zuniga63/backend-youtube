const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const sendError = require('../utils/sendError');

module.exports = {
  async list(req, res) {
    try {
      const users = await User.find();
      res.status(200).json({ message: 'Users found', data: users });
    } catch (error) {
      sendError(error, res);
    }
  },

  async show(req, res) {
    try {
      const userId = req.user;
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json({
        message: 'User found',
        user: {
          name: user.firstName,
          avatar: user.avatarUrl,
          email: user.email,
        },
      });
    } catch (error) {
      sendError(error, res);
    }
  },

  async signup(req, res) {
    try {
      const { password, confirmPassword } = req.body;
      const { avatar } = req.body;

      if (password !== confirmPassword) {
        res.status(403).json({ message: 'Contraseñas no coinciden' });
        return;
      }
      const encPassword = await bcrypt.hash(password, 8);

      const user = await User.create({
        ...req.body,
        password: encPassword,
        avatar,
      });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: 60 * 60 * 24,
      });

      res.status(201).json({
        message: 'User created',
        token,
        user: {
          name: user.firstName,
          avatar: user.avatarUrl,
          email: user.email,
        },
      });
    } catch (error) {
      sendError(error, res);
    }
  },

  async signin(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('Usuario o contraseña invalida');
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        throw new Error('Usuario o contraseña invalida');
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: 60 * 60 * 24,
      });

      res.status(201).json({
        message: 'User login',
        token,
        user: {
          name: user.firstName,
          avatar: user.avatarUrl,
          email: user.email,
        },
        other: user,
      });
    } catch (error) {
      sendError(error, res);
    }
  },

  async update(req, res) {
    try {
      const userId = req.user;
      // ! Ojo que se puede cambiar el password aquí
      const user = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
      });
      res.status(200).json({ message: 'User updated', user });
    } catch (error) {
      sendError(error, res);
    }
  },

  async destroy(req, res) {
    try {
      const userId = req.user;

      await User.findByIdAndDelete(userId);
      res.status(200).json({ message: 'User deleted' });
    } catch (error) {
      sendError(error, res);
    }
  },
};
