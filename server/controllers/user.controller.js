const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const sendError = require('../utils/sendError');
const { transporter } = require('../utils/mailer');
const NotFoundError = require('../utils/customErrors/NotFound');
const ValidationError = require('../utils/customErrors/ValidationError');

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
          likes: user.likes,
        },
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

      res.status(200).json({ message: 'User updated', user });
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
};
