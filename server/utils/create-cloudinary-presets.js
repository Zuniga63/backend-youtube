require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.api
  .create_upload_preset({
    name: 'images_preset',
    folder: 'images',
    resource_type: 'image',
    allowed_formats: 'jpg, png, gif, webp, bmp, jpe, jpeg',
    access_mode: 'public',
    unique_filename: true,
    auto_tagging: 0.7,
    overwrite: true,
    transformation: [
      { aspect_ratio: '16:9', crop: 'fill' },
      { width: 480, crop: 'scale' },
      { dpr: 'auto' },
    ],
  })
  .then((uploadResult) => console.log(uploadResult))
  .catch((error) => console.error(error));

cloudinary.api
  .create_upload_preset({
    name: 'avatar_preset',
    folder: 'avatars',
    resource_type: 'image',
    allowed_formats: 'jpg, png, gif, webp, bmp, jpe, jpeg',
    access_mode: 'public',
    unique_filename: true,
    auto_tagging: 0.7,
    overwrite: true,

    transformation: [
      {
        width: 200,
        height: 200,
        crop: 'thumb',
        gravity: 'face',
      },
    ],
  })
  .then((uploadResult) => console.log(uploadResult))
  .catch((error) => console.error(error));

cloudinary.api
  .create_upload_preset({
    name: 'video_preset',
    folder: 'videos',
    resource_type: 'video',
    allowed_formats: 'mp4, avi, 3gp,',
    access_mode: 'public',
    unique_filename: true,
    auto_tagging: 0.7,
    overwrite: true,
  })
  .then((uploadResult) => console.log(uploadResult))
  .catch((error) => console.error(error));
