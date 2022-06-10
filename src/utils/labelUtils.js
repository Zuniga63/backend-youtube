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
          .trim()
          .toLocaleLowerCase()
          .replace(/\s/gi, '-')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
      : '';
  },
  /**
   * @param {string} name Nombre de la etiqueta a normalizar
   */
  normalizeLabelName(name) {
    if (typeof name === 'string' && name.length > 0) {
      let firsrWord = true;
      const words = name
        .trim()
        .split(' ')
        .map((item) => {
          let firstChar = item[0];

          /**
           * * Si es una palabra de un solo caracter
           * * este codigo retorna un ('');
           */
          const rest = item.substring(1).toLocaleLowerCase();

          // * Solo si es la primera palabra entonces se capitaliza.
          if (firsrWord) {
            firstChar = firstChar.toUpperCase();
            firsrWord = false;
          }

          return [firstChar, rest].join('');
        });

      return words.join(' ');
    }

    return '';
  },
};
