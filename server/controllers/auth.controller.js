const bcrypt = require('bcrypt');
const createToken = require('../utils/createToken');
const User = require('../models/user.model');
const sendError = require('../utils/sendError');
const { transporter } = require('../utils/mailer');
const AuthError = require('../utils/customErrors/AuthError');
const ValidationError = require('../utils/customErrors/ValidationError');

const sendMail = async (user) => {
  await transporter.sendMail({
    from: `"${process.env.MAIL_USERNAME}" <${process.env.MAIL_USER}>`,
    to: user.email,
    subject: 'Bienvenido al Clon de Youtube',
    html: `
    <div>
    <p>Bienvenido,</p>
    <h2>${user.firstName}</h2>
    <p> a este proyecto llamado YouTube-Top22</p>
    </div>`,
    text: `Bienvenido ${user.fullName} a este nuevo proyecto, gracias por acompañarnos`,
  });
};

const getUserData = (user) => ({
  name: user.firstName,
  avatar: user.avatarUrl,
  email: user.email,
  likes: user.likes,
});

module.exports = {
  async signup(req, res) {
    try {
      const { password, confirmPassword } = req.body;

      if (password !== confirmPassword)
        throw new ValidationError('Las contraseñas no coinciden.');

      const user = await User.create({ ...req.body });

      sendMail(user);

      const token = createToken(user._id);

      res.status(201).json({
        message: 'User created',
        token,
        user: getUserData(user),
      });
    } catch (error) {
      sendError(error, res);
    }
  },

  async signin(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) throw new AuthError('Usuario o contraseña invalida');

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new AuthError('Usuario o contraseña invalida');

      const token = createToken(user._id);

      res.status(201).json({
        message: 'User login',
        token,
        user: getUserData(user),
      });
    } catch (error) {
      sendError(error, res);
    }
  },
};
