const busboy = require('busboy');
const cloudinary = require('cloudinary').v2;

const PRESETS = {
  image: 'images_preset',
  video: 'video_preset',
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const formData = (req, res, next) => {
  // Se crea el cuerpo de body y la confg del busboy
  const body = {};
  const bb = busboy({ headers: req.headers });

  // Se crean las variables que van a controlar la subida de los archivos.
  let uploadingFile = false;
  let uploadingCount = 0;

  /**
   * Metodo encargado se salir del midleware cuando
   * todos los archivos han sido cargados.
   * @returns
   */
  const done = () => {
    if (uploadingFile) return;
    if (uploadingCount > 0) return;

    req.body = body;
    next();
  };

  /**
   * Se capturan los campos que no son archivos y se agregan al body.
   */
  bb.on('field', (key, value) => {
    console.log(`Field: ${key}, value:${value}`);
    body[key] = value;
  });

  bb.on('file', (key, file, info) => {
    // Los siguientes parametros se actualizan de forma sincrona por cada archivo subido.
    uploadingFile = true;
    uploadingCount += 1;

    /**
     * mimeType es un string de la forma image/jpg - image/gif - video/mp4
     */
    const { mimeType } = info;
    const fileType = mimeType.split('/')[0];

    // Se crea esto para especificarle a cloudinary que preset usar segun el archivo.
    const preset = PRESETS[fileType];

    const cloud = cloudinary.uploader.upload_stream(
      { upload_preset: preset, resource_type: fileType },
      (cloudErr, cloudRes) => {
        console.log(cloudErr);
        if (cloudErr) throw new Error('Something went wrong!');
        console.log('response cloudinary', cloudRes);

        // Esto se ejecuta cuando los archivos son subidos a cloudinary.
        const {
          width,
          height,
          format,
          resource_type: type,
          secure_url: url,
        } = cloudRes;

        body[key] = { width, height, format, type, url };
        uploadingFile = false;
        uploadingCount -= 1;
        done();
      }
    );

    /**
     * Este evento va cargado los buffers en el cloudinary
     */
    file.on('data', (data) => {
      cloud.write(data);
    });

    file.on('end', () => {
      // Se cierra la conexión con cloudinary.
      cloud.end();
    });
  });

  bb.on('finish', () => {
    done();
  });

  req.pipe(bb);
};

module.exports = formData;
