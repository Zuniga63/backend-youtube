module.exports = {
  /**
   * Normaliza el texto, cambia los espacios por (_) ademas de eliminar
   * los signos de puntucacion.
   * @param {String} text Texto a normalizar
   * @returns String
   */
  createSlug(text) {
    return text
      ? text
          .replace(/\s/gi, "_")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      : null;
  },
};
