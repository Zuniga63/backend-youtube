/**
 * Gestiona el envio de envio de errores al frontend
 * @param {*} error Error a enviar
 * @param {object} res Instancia de express para enviar response.
 * @returns
 */
const sendError = (error, res) => {
  const { name: errorName, message } = error;
  let code = 500;
  const info = { message, ok: false };

  if (errorName === 'ValidationError') {
    code = 406;
    info.error = error;
  } else if (errorName === 'AuthError') code = 401;
  else if (errorName === 'NotFoundError') code = 404;
  else if (errorName === 'CastError') {
    console.log(error);
    const { kind, stringValue, message: originalMessage } = error;

    code = 406;
    info.message =
      kind === 'ObjectId'
        ? `El id "${stringValue}" no se puede convertir en ${kind}`
        : message;
    info.originalMessage = originalMessage;
  } else {
    console.log(error);
    info.message = 'Internal server Error.';
  }
  res.status(code).json(info);
};

module.exports = sendError;
