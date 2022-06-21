const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const sendError = require('../utils/sendError');
const { transporter } = require('../utils/mailer');

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

  async signup(req, res) {
    try {
      const { password, confirmPassword, email, firstName } = req.body;
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

      await transporter.sendMail({
        from: `"${process.env.MAIL_USERNAME}" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Bienvenido al Clon de Youtube',
        html: `
        <div>
        <p>Bienvenido,</p>
        <h2>${firstName}</h2>
        <p> a este proyecto llamado Clone YouTube</p>
        </div>`,
        text: `Bienvenido ${firstName} a este nuevo proyecto, gracias por acompañarnos`,
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
          likes: user.likes,
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

  async changepassword(req, res) {
    try {
      const { password, newpassword, confirmPassword } = req.body;
      const userId = req.user;
      const user = await User.findById(userId);
      console.log(user);
      if (!user) {
        res.status(404).json({ message: 'User not find.' });
        return;
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        res.status(403).json({ message: 'Password do not match' });
        return;
      }
      if (newpassword !== confirmPassword) {
        res.status(403).json({ message: 'Passwords do not match' });
        return;
      }
      const encPassword = await bcrypt.hash(newpassword, 8);

      user.password = encPassword;
      await user.save({ validateBeforeSave: false });

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

      const user = await User.findOne({ email });

      if (!user) {
        res.status(404).json({ message: 'User not find.' });
        return;
      }

      if (password !== confirmPassword) {
        res.status(403).json({ message: 'Passwords do not match' });
        return;
      }

      const encPassword = await bcrypt.hash(password, 8);

      user.password = encPassword;
      await user.save({ validateBeforeSave: false });

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
