/**
 * Gestiona el envio de envio de errores al frontend
 * @param {*} error Error a enviar
 * @param {object} res Instancia de express para enviar response.
 * @returns
 */
const sendError = (error, res) => {
  console.log(typeof error, error.name);
  // ! Aquí debe ir el codigo para escribir el log.
  console.log(error);

  if (error.name === 'ValidationError') {
    res.status(406).json(error);
    return;
  }

  if (error.name === 'CastError') {
    const { kind, stringValue, message: originalMessage } = error;

    if (kind === 'ObjectId') {
      const message = `El id "${stringValue}" no se puede convertir en ${kind}`;
      res.status(406).json({ message, originalMessage });
      return;
    }
  }

  res.status(500).json(error);
};

module.exports = sendError;
