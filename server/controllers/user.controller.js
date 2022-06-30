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
        subject: 'Change Password in Youtube',
        html: `
        <!DOCTYPE html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <meta name="x-apple-disable-message-reformatting">
          <title></title>
          <!--[if mso]>
          <style>
            table {border-collapse:collapse;border-spacing:0;border:none;margin:0;}
            div, td {padding:0;}
            div {margin:0 !important;}
          </style>
          <noscript>
            <xml>
              <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
          </noscript>
          <![endif]-->
          <style>
            table, td, div, h1, p {
              font-family: Arial, sans-serif;
            }
            @media screen and (max-width: 530px) {
              .unsub {
                display: block;
                padding: 8px;
                margin-top: 14px;
                border-radius: 6px;
                background-color: #555555;
                text-decoration: none !important;
                font-weight: bold;
              }
              .col-lge {
                max-width: 100% !important;
              }
            }
            @media screen and (min-width: 531px) {
              .col-sml {
                max-width: 27% !important;
              }
              .col-lge {
                max-width: 73% !important;
              }
            }
          </style>
        </head>
        <body style="margin:0;padding:0;word-spacing:normal;background-color:#939297;">
          <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#939297;">
            <table role="presentation" style="width:100%;border:none;border-spacing:0;">
              <tr>
                <td align="center" style="padding:0;">
                  <!--[if mso]>
                  <table role="presentation" align="center" style="width:600px;">
                  <tr>
                  <td>
                  <![endif]-->
                  <table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">
                    <tr>
                      <td style="padding:40px 30px 30px 30px;text-align:center;font-size:24px;font-weight:bold;">
                        <a href="https://youtubetopv22.netlify.app/" style="text-decoration:none;"><img src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c548.png" width="165" alt="Logo" style="width:165px;max-width:80%;height:auto;border:none;text-decoration:none;color:#ffffff;"></a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px;background-color:#ffffff;">
                        <h1 style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;">Hola ${user.fullName}</h1>
                        <p style="margin:0;">Estamos comprometidos con tu seguridad por ello te informamos que has realizado un cambio de contraseña, no olvides seguirnos visitando. <a href="https://youtubetopv22.netlify.app/" style="color:#f70606;text-decoration:underline;">YouTube</a></p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0;font-size:24px;line-height:28px;font-weight:bold;">
                        <a href="https://youtubetopv22.netlify.app/" style="text-decoration:none;"><img src="https://brancoala.com/wp-content/uploads/2017/08/views_no_youtube-750x430.jpg" width="600" alt="" style="width:100%;height:auto;display:block;border:none;text-decoration:none;color:#363636;"></a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px;background-color:#ffffff;">
                        <p style="margin:0;">Recuerda que siempre puedes subir tus videos y compartirlos con tus amigos y conocidos, como también puedes ver los videos de tu interés.</p>
                      </td>
                    </tr>
                  </table>
                  <!--[if mso]>
                  </td>
                  </tr>
                  </table>
                  <![endif]-->
                </td>
              </tr>
            </table>
          </div>
        </body>
        </html>`,
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
        subject: 'Recuperación contraseña de Youtube',
        html: `
        <!DOCTYPE html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <meta name="x-apple-disable-message-reformatting">
          <title></title>
          <!--[if mso]>
          <style>
            table {border-collapse:collapse;border-spacing:0;border:none;margin:0;}
            div, td {padding:0;}
            div {margin:0 !important;}
          </style>
          <noscript>
            <xml>
              <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
          </noscript>
          <![endif]-->
          <style>
            table, td, div, h1, p {
              font-family: Arial, sans-serif;
            }
            @media screen and (max-width: 530px) {
              .unsub {
                display: block;
                padding: 8px;
                margin-top: 14px;
                border-radius: 6px;
                background-color: #555555;
                text-decoration: none !important;
                font-weight: bold;
              }
              .col-lge {
                max-width: 100% !important;
              }
            }
            @media screen and (min-width: 531px) {
              .col-sml {
                max-width: 27% !important;
              }
              .col-lge {
                max-width: 73% !important;
              }
            }
          </style>
        </head>
        <body style="margin:0;padding:0;word-spacing:normal;background-color:#939297;">
          <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#939297;">
            <table role="presentation" style="width:100%;border:none;border-spacing:0;">
              <tr>
                <td align="center" style="padding:0;">
                  <!--[if mso]>
                  <table role="presentation" align="center" style="width:600px;">
                  <tr>
                  <td>
                  <![endif]-->
                  <table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">
                    <tr>
                      <td style="padding:40px 30px 30px 30px;text-align:center;font-size:24px;font-weight:bold;">
                        <a href="https://youtubetopv22.netlify.app/" style="text-decoration:none;"><img src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c548.png" width="165" alt="Logo" style="width:165px;max-width:80%;height:auto;border:none;text-decoration:none;color:#ffffff;"></a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px;background-color:#ffffff;">
                        <h1 style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;">Hola ${user.fullName}</h1>
                        <p style="margin:0;">Queremos informarte que a continuación encontraras los pasos para realizar tu recuperación de contraseña.</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0;font-size:24px;line-height:28px;font-weight:bold;">
                        <a href="https://youtubetopv22.netlify.app/" style="text-decoration:none;"><img src="https://qph.fs.quoracdn.net/main-qimg-0ff799fef715cf560821b311ae28eee6" width="600" alt="" style="width:100%;height:auto;display:block;border:none;text-decoration:none;color:#363636;"></a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:35px 30px 11px 30px;font-size:0;background-color:#ffffff;border-bottom:1px solid #f0f0f5;border-color:rgba(201,201,207,.35);">
                        <!--[if mso]>
                        <table role="presentation" width="100%">
                        <tr>
                        <td style="width:145px;" align="left" valign="top">
                        <![endif]-->
                        <div class="col-sml" style="display:inline-block;width:100%;max-width:145px;vertical-align:top;text-align:left;font-family:Arial,sans-serif;font-size:14px;color:#363636;">
                          <img src=${user.avatar} width="115" alt="" style="width:115px;max-width:80%;margin-bottom:20px;">
                        </div>
                        <!--[if mso]>
                        </td>
                        <td style="width:395px;padding-bottom:20px;" valign="top">
                        <![endif]-->
                        <div class="col-lge" style="display:inline-block;width:100%;max-width:395px;vertical-align:top;padding-bottom:20px;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">
                          <p style="margin-top:0;margin-bottom:12px;">Verifica que tu nombre y tu imagen de perfil corresponda con el correo.</p>
                          <p style="margin-top:0;margin-bottom:18px;">Realiza clic en el botón y realiza tu cambio de contraseña en nuestra página.</p>
                          <p style="margin:0;"><a href="https://youtubetopv22.netlify.app/recover-password/${token}" style="background: #f50606; text-decoration: none; padding: 10px 25px; color: #ffffff; border-radius: 4px; display:inline-block; mso-padding-alt:0;text-underline-color:#ff3884"><!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%;mso-text-raise:20pt">&nbsp;</i><![endif]--><span style="mso-text-raise:10pt;font-weight:bold;">Cambio de contraseña</span><!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%">&nbsp;</i><![endif]--></a></p>
                        </div>
                        <!--[if mso]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px;font-size:24px;line-height:28px;font-weight:bold;background-color:#ffffff;border-bottom:1px solid #f0f0f5;border-color:rgba(201,201,207,.35);">
                        <a href="https://youtubetopv22.netlify.app/" style="text-decoration:none;"><img src="https://fundaciontelefonica.com.ec/wp-content/uploads/2016/03/12-canales-de-youtube.png" width="540" alt="" style="width:100%;height:auto;border:none;text-decoration:none;color:#363636;"></a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px;background-color:#ffffff;">
                        <p style="margin:0;">Si no has realizado la solicitud de recuperar contraseña te aconsejamos que realices cambio de tu contraseña, ya que tu correo pudo ser comprometido en otro sitio web.</p>
                      </td>
                    </tr>
                  </table>
                  <!--[if mso]>
                  </td>
                  </tr>
                  </table>
                  <![endif]-->
                </td>
              </tr>
            </table>
          </div>
        </body>
        </html>
        `,
        text: `Recuperando contraseña de ${user.firstName}, gracias por acompañarnos`,
      });
      res.status(201).json({ message: 'Send Mail', user: getUserData(user) });
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
        subject: 'Change Password in Youtube',
        html: `
        <!DOCTYPE html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <meta name="x-apple-disable-message-reformatting">
          <title></title>
          <!--[if mso]>
          <style>
            table {border-collapse:collapse;border-spacing:0;border:none;margin:0;}
            div, td {padding:0;}
            div {margin:0 !important;}
          </style>
          <noscript>
            <xml>
              <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
          </noscript>
          <![endif]-->
          <style>
            table, td, div, h1, p {
              font-family: Arial, sans-serif;
            }
            @media screen and (max-width: 530px) {
              .unsub {
                display: block;
                padding: 8px;
                margin-top: 14px;
                border-radius: 6px;
                background-color: #555555;
                text-decoration: none !important;
                font-weight: bold;
              }
              .col-lge {
                max-width: 100% !important;
              }
            }
            @media screen and (min-width: 531px) {
              .col-sml {
                max-width: 27% !important;
              }
              .col-lge {
                max-width: 73% !important;
              }
            }
          </style>
        </head>
        <body style="margin:0;padding:0;word-spacing:normal;background-color:#939297;">
          <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#939297;">
            <table role="presentation" style="width:100%;border:none;border-spacing:0;">
              <tr>
                <td align="center" style="padding:0;">
                  <!--[if mso]>
                  <table role="presentation" align="center" style="width:600px;">
                  <tr>
                  <td>
                  <![endif]-->
                  <table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">
                    <tr>
                      <td style="padding:40px 30px 30px 30px;text-align:center;font-size:24px;font-weight:bold;">
                        <a href="https://youtubetopv22.netlify.app/" style="text-decoration:none;"><img src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c548.png" width="165" alt="Logo" style="width:165px;max-width:80%;height:auto;border:none;text-decoration:none;color:#ffffff;"></a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px;background-color:#ffffff;">
                        <h1 style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;">Hola ${user.fullName}</h1>
                        <p style="margin:0;">Estamos comprometidos con tu seguridad por ello te informamos que has realizado un cambio de contraseña, no olvides seguirnos visitando. <a href="https://youtubetopv22.netlify.app/" style="color:#f70606;text-decoration:underline;">YouTube</a></p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0;font-size:24px;line-height:28px;font-weight:bold;">
                        <a href="https://youtubetopv22.netlify.app/" style="text-decoration:none;"><img src="https://brancoala.com/wp-content/uploads/2017/08/views_no_youtube-750x430.jpg" width="600" alt="" style="width:100%;height:auto;display:block;border:none;text-decoration:none;color:#363636;"></a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px;background-color:#ffffff;">
                        <p style="margin:0;">Recuerda que siempre puedes subir tus videos y compartirlos con tus amigos y conocidos, como también puedes ver los videos de tu interés.</p>
                      </td>
                    </tr>
                  </table>
                  <!--[if mso]>
                  </td>
                  </tr>
                  </table>
                  <![endif]-->
                </td>
              </tr>
            </table>
          </div>
        </body>
        </html>`,
        text: `Hola ${user.firstName} has cambiado la contraseña`,
      });

      res.status(201).json({ message: 'Change Password Ok', user: getUserData(user) });
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
