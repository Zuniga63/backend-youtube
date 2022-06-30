const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const User = require('../models/user.model');
const sendError = require('../utils/sendError');
const { transporter } = require('../utils/mailer');
const NotFoundError = require('../utils/customErrors/NotFound');
const ValidationError = require('../utils/customErrors/ValidationError');
const getUserData = require('../utils/getUserData');
const AuthError = require('../utils/customErrors/AuthError');
const Video = require('../models/video.model');

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
      if (!user) throw new NotFoundError('Usuario no encontrado.');

      res.status(200).json({
        message: 'User found',
        user: getUserData(user),
      });
    } catch (error) {
      sendError(error, res);
    }
  },

  async update(req, res) {
    try {
      const userId = req.user;
      const { firstName, lastName, email } = req.body;

      const user = await User.findById(userId);
      if (!user) throw new AuthError('Usuario no encontrado.');

      user.firstName = firstName;
      user.lastName = lastName;
      if (user.email !== email) user.email = email;

      await user.save({ validateModifiedOnly: true });

      res
        .status(200)
        .json({ message: 'User updated', user: getUserData(user) });
    } catch (error) {
      sendError(error, res);
    }
  },

  async updateAvatar(req, res) {
    const data = req.body;
    const userId = req.user;

    try {
      const user = await User.findById(userId);
      if (!user) throw new NotFoundError('Usuario no encontrado');

      if (user.avatar?.publicId) {
        const cloudRes = await cloudinary.uploader.destroy(
          user.avatar?.publicId
        );

        if (cloudRes.result !== 'ok') throw new Error('No se pudo eliminar.');
      }

      user.avatar = data.image;
      await user.save({ validateModifiedOnly: true });
      res.status(200).json({ user: getUserData(user) });
    } catch (error) {
      sendError(error, res);
    }
  },

  async removeAvatar(req, res) {
    const userId = req.user;

    try {
      const user = await User.findById(userId);
      if (!user) throw new NotFoundError('Usuario no encontrado');

      if (user.avatar?.publicId) {
        const cloudRes = await cloudinary.uploader.destroy(
          user.avatar?.publicId
        );

        if (cloudRes.result !== 'ok') throw new Error('No se pudo eliminar.');
      }

      user.avatar = null;
      await user.save({ validateModifiedOnly: true });
      res.status(200).json({ user: getUserData(user) });
    } catch (error) {
      sendError(error, res);
    }
  },

  async changepassword(req, res) {
    try {
      const { password, newpassword, confirmPassword } = req.body;
      const userId = req.user;

      if (!password || !newpassword || !confirmPassword)
        throw new ValidationError('Todos los campos deben ser ingresados.');

      if (newpassword !== confirmPassword)
        throw new ValidationError('Las constraseñas no coinciden');

      const user = await User.findById(userId);
      if (!user) throw new NotFoundError('Usuario no encontrado.');

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new ValidationError('Constraseña incorrecta.');

      user.password = newpassword;
      await user.save({ validateModifiedOnly: true });

      await transporter.sendMail({
        from: `"${process.env.MAIL_USERNAME}" <${process.env.MAIL_USER}>`,
        to: user.email,
        subject: 'Change Password in Clon of Youtube',
        html: `
        <div>
        <p>Hola,</p>
        <h2>${user.firstName}</h2>
        <p> Has cambiado la contraseña en Clone YouTube</p>
        </div>`,
        text: `Hola ${user.firstName} has cambiado la contraseña`,
      });

      res
        .status(200)
        .json({ message: 'User updated', user: getUserData(user) });
    } catch (error) {
      sendError(error, res);
    }
  },

  async getemail(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        res.status(404).json({ message: 'User not find.' });
        return;
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: 60 * 5,
      });
      console.log(email);

      await transporter.sendMail({
        from: `"${process.env.MAIL_USERNAME}" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Recuperación contraseña de Clon de Youtube',
        html: `
        <div>
        <p>Bienvenido,</p>
        <h2>${user.firstName}</h2>
        <p> estamos complacidos en ayudarte a recuperar tu contraseña de Clone YouTube</p>
        <p>entra al siguiente link</p>
        <a href="${process.env.FRONTEND_URI}:${process.env.FRONTEND_PORT}/recover-password/${token}" >Link de recuperación</a>
        </div>`,
        text: `Recuperando contraseña de ${user.firstName}, gracias por acompañarnos`,
      });
      res.status(201).json({ message: 'Send Mail', user });
    } catch (error) {
      sendError(error, res);
    }
  },

  async recoverpassword(req, res) {
    try {
      const { email, password, confirmPassword } = req.body;

      if (!email || !password || !confirmPassword)
        throw new ValidationError('Todos los campos deben ser ingresados.');

      if (password !== confirmPassword)
        throw new ValidationError('Las constraseñas no coinciden');

      const user = await User.findOne({ email });
      if (!user) throw new NotFoundError('Usuario no encontrado.');

      user.password = password;
      await user.save({ validateModifiedOnly: true });

      await transporter.sendMail({
        from: `"${process.env.MAIL_USERNAME}" <${process.env.MAIL_USER}>`,
        to: user.email,
        subject: 'Change Password in Clon of Youtube',
        html: `
        <div>
        <p>Hola,</p>
        <h2>${user.firstName}</h2>
        <p> Has cambiado la contraseña en YouTube-Top</p>
        </div>`,
        text: `Hola ${user.firstName} has cambiado la contraseña`,
      });

      res.status(201).json({ message: 'Change Password Ok', user });
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
  async getVideos(req, res) {
    try {
      const user = await User.findById(req.user);
      if (!user) throw new NotFoundError('Usuario no encontrado');

      const videos = await Video.find({ userId: user.id })
        .populate('labels', 'id, name')
        .select('id title imageUrl likes comments visits');

      res.status(200).json({ videos });
    } catch (error) {
      sendError(error, res);
    }
  },
};
