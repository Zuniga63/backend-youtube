module.exports = {
  swagger: '2.0',
  info: {
    description:
      'Esta API se encarga de manejar la infomación de la base de datos del proyecto `YouTube Clone`',
    version: '1.0.0',
    title: 'API Youtube Clone',
    contact: {
      email: 'apiteam@swagger.io',
    },
  },
  server: {
    url: 'http://localhost:8080',
  },
  tags: [
    {
      name: 'label',
      description:
        'Este endpoint maneja toda la informacion relacionada con las etiquetas usadas en los videos.',
    },
    {
      name: 'video',
      description:
        'Endpoint encargado de la información relacionada con los videos en la base de datos.',
    },
    {
      name: 'user',
      description: '',
    },
    {
      name: 'comments',
      description: 'Endpoint para administrar los comentarios',
    },
    {
      name: 'Auth',
      description: 'End point para el registro y la autenticación de usuarios.',
    },
  ],
  paths: {
    '/labels': {
      get: {
        tags: ['label'],
        summary:
          'Recupera el listado con todas las etiquetas de la base de datos.',
        produces: ['application/json'],
        responses: {
          200: {
            description: 'OK',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/LabelLite',
              },
            },
          },
        },
      },
      post: {
        tags: ['label'],
        summary:
          'Inserta la información de una nueva etiqueta en la base de datos.',
        produces: ['application/json'],
        parameters: [
          {
            name: 'body',
            in: 'body',
            description: 'Nombre de la etiqueta a ingresar',
            required: true,
            schema: {
              $ref: '#/definitions/labelPost',
            },
          },
        ],
        responses: {
          201: {
            description: 'Etiqueta Creada.',
            schema: { $ref: '#/definitions/LabelLite' },
          },
          405: {
            description: 'Nombre de etiqueta faltante.',
          },
        },
      },
    },
    '/labels/{slug}': {
      get: {
        tags: ['label'],
        summary: 'Recupera la instancia de la etiqueta.',
        produces: ['application/json'],
        parameters: [
          {
            name: 'slug',
            in: 'path',
            description: 'Slug de la etiqueta a recuperar.',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          200: {
            description: 'OK',
            schema: {
              $ref: '#/definitions/Label',
            },
          },
          404: {
            description: 'Etiqueta no encontrada.',
          },
        },
      },
      put: {
        tags: ['label'],
        summary: 'Actualiza el nombre y el slug de la etiqueta.',
        produces: ['application/json'],
        parameters: [
          {
            name: 'slug',
            in: 'path',
            description: 'Slug de la etiqueta a actualizar.',
            required: true,
            type: 'string',
          },
          {
            name: 'body',
            in: 'body',
            description: 'El nuevo nombre de la etiqueta.',
            required: true,
            schema: {
              $ref: '#/definitions/labelPost',
            },
          },
        ],
        responses: {
          200: {
            description: 'Etiqueta actualizada.',
            schema: { $ref: '#/definitions/LabelLite' },
          },
          404: {
            description: 'Etiqueta no encontrada.',
          },
          405: {
            description: 'Slug o nombre de etiqueta faltante.',
          },
        },
      },
      delete: {
        tags: ['label'],
        summary: 'Elimina la etiqueta de la DB.',
        produces: ['application/json'],
        parameters: [
          {
            name: 'slug',
            in: 'path',
            description: 'Slug de la etiqueta a eliminar.',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          200: {
            description: 'OK',
            schema: {
              $ref: '#/definitions/LabelLite',
            },
          },
          404: {
            description: 'Etiqueta no encontrada.',
          },
        },
      },
    },
    '/videos': {
      get: {
        tags: ['video'],
        summary: 'Recupera todos los video de la BD',
        produces: ['application/json'],
        parameters: [
          {
            name: 'Authentication',
            in: 'header',
            description: 'Token de autorización.',
            required: true,
            schema: {
              type: 'string',
              example:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOWI2NWQ1YjZkMGFmYmU0YWU1YzhjZSIsImlhdCI6MTY1NDM1MTMxNywiZXhwIjoxNjU0NDM3NzE3fQ.pG0El3BK-m3AZcKH77H9rT7pQ4F5HnQa7uvGhSWuFJY',
            },
          },
          {
            name: 'body',
            in: 'body',
            description: 'Cuerpo de los datos para crear un nuevo video.',
            required: true,
            schema: {
              $ref: '#/definitions/VideoCreateRequest',
            },
          },
        ],
        responses: {
          200: {
            description: 'OK',
            schema: {
              type: 'array',
              items: { $ref: '#/definitions/Video' },
            },
          },
        },
      },
      post: {
        tags: ['video'],
        summary: 'Guarda la información de un nuevo video en la BD.',
        produces: ['application/json'],
        parameters: [
          {
            name: 'Authentication',
            in: 'header',
            description: 'Token de autorización.',
            required: true,
            schema: {
              type: 'string',
              example:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOWI2NWQ1YjZkMGFmYmU0YWU1YzhjZSIsImlhdCI6MTY1NDM1MTMxNywiZXhwIjoxNjU0NDM3NzE3fQ.pG0El3BK-m3AZcKH77H9rT7pQ4F5HnQa7uvGhSWuFJY',
            },
          },
          {
            name: 'body',
            in: 'body',
            description: 'Cuerpo de los datos para crear un nuevo video.',
            required: true,
            schema: {
              $ref: '#/definitions/VideoCreateRequest',
            },
          },
        ],
        responses: {
          200: {
            description: 'OK',
            schema: {
              $ref: '#/definitions/Video',
            },
          },
        },
      },
    },
    '/videos/{videoId}': {
      get: {
        tags: ['video'],
        summary: 'Recuepera la informacion de un video de la BD.',
        produces: ['application/json'],
        parameters: [
          {
            name: 'Authentication',
            in: 'header',
            description:
              'Token de autorización pasado a la ruta pero no obligatorio.',
            required: false,
            schema: {
              type: 'string',
              example:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOWI2NWQ1YjZkMGFmYmU0YWU1YzhjZSIsImlhdCI6MTY1NDM1MTMxNywiZXhwIjoxNjU0NDM3NzE3fQ.pG0El3BK-m3AZcKH77H9rT7pQ4F5HnQa7uvGhSWuFJY',
            },
          },
          {
            name: 'videoId',
            in: 'path',
            description: 'ID del video a agregar el like.',
            required: true,
          },
        ],
        responses: {
          200: {
            description:
              'El video existe y no hubo problemas al recuperar la información.',
            schema: {
              $ref: '#/definitions/showVideoResponse',
            },
          },
          404: {
            description: 'EL video no fue encontrado.',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Video no encontrado.',
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['video'],
        summary: 'Actualiza la información de un video.',
        produces: ['application/json'],
      },
      delete: {
        tags: ['video'],
        summary: 'Elimina toda la información del video de la BD y recursos.',
        produces: ['application/json'],
      },
    },
    '/videos/{videoId}/update-image': {
      put: {
        tags: ['video'],
        summary: 'Actualiza unicamente la imagen del video.',
        produces: ['application/json'],
        parameters: [
          {
            name: 'Authentication',
            in: 'header',
            description: 'Token de autorización.',
            required: true,
            schema: {
              type: 'string',
              example:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOWI2NWQ1YjZkMGFmYmU0YWU1YzhjZSIsImlhdCI6MTY1NDM1MTMxNywiZXhwIjoxNjU0NDM3NzE3fQ.pG0El3BK-m3AZcKH77H9rT7pQ4F5HnQa7uvGhSWuFJY',
            },
          },
          {
            name: 'videoId',
            in: 'path',
            description: 'ID del video a agregar el like.',
            required: true,
          },
        ],
        responses: {
          200: {
            description:
              'El like ya existe y no se realiza ninguna acción adicional.',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'OK',
                },
              },
            },
          },
          404: {
            description: 'Si no se encuentra el usuario o el video',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Usuario no encontrado',
                },
              },
            },
          },
        },
      },
    },
    '/videos/{videoId}/update-video': {
      put: {
        tags: ['video'],
        summary: 'Actualiza unicamente el archivo del video.',
        produces: ['application/json'],
        parameters: [
          {
            name: 'Authentication',
            in: 'header',
            description: 'Token de autorización.',
            required: true,
            schema: {
              type: 'string',
              example:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOWI2NWQ1YjZkMGFmYmU0YWU1YzhjZSIsImlhdCI6MTY1NDM1MTMxNywiZXhwIjoxNjU0NDM3NzE3fQ.pG0El3BK-m3AZcKH77H9rT7pQ4F5HnQa7uvGhSWuFJY',
            },
          },
          {
            name: 'videoId',
            in: 'path',
            description: 'ID del video a agregar el like.',
            required: true,
          },
        ],
        responses: {
          200: {
            description:
              'El like ya existe y no se realiza ninguna acción adicional.',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'OK',
                },
              },
            },
          },
          404: {
            description: 'Si no se encuentra el usuario o el video',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Usuario no encontrado',
                },
              },
            },
          },
        },
      },
    },
    '/videos/{videoId}/new-like': {
      post: {
        tags: ['video'],
        summary: 'Crea un nuevo documento de videoLike si no existe en la BD',
        produces: ['application/json'],
        parameters: [
          {
            name: 'Authentication',
            in: 'header',
            description: 'Token de autorización.',
            required: true,
            schema: {
              type: 'string',
              example:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOWI2NWQ1YjZkMGFmYmU0YWU1YzhjZSIsImlhdCI6MTY1NDM1MTMxNywiZXhwIjoxNjU0NDM3NzE3fQ.pG0El3BK-m3AZcKH77H9rT7pQ4F5HnQa7uvGhSWuFJY',
            },
          },
          {
            name: 'videoId',
            in: 'path',
            description: 'ID del video a agregar el like.',
            required: true,
          },
        ],
        responses: {
          200: {
            description:
              'El like ya existe y no se realiza ninguna acción adicional.',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'OK',
                },
              },
            },
          },
          404: {
            description: 'Si no se encuentra el usuario o el video',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Usuario no encontrado',
                },
              },
            },
          },
        },
      },
    },
    '/videos/{videoId}/remove-like': {
      delete: {
        tags: ['video'],
        summary: 'Elimina el registro con el like del usuario.',
        produces: ['application/json'],
        parameters: [
          {
            name: 'Authentication',
            in: 'header',
            description: 'Token de autorización.',
            required: true,
            schema: {
              type: 'string',
              example:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOWI2NWQ1YjZkMGFmYmU0YWU1YzhjZSIsImlhdCI6MTY1NDM1MTMxNywiZXhwIjoxNjU0NDM3NzE3fQ.pG0El3BK-m3AZcKH77H9rT7pQ4F5HnQa7uvGhSWuFJY',
            },
          },
          {
            name: 'videoId',
            in: 'path',
            description: 'ID del video a agregar el like.',
            required: true,
          },
        ],
        responses: {
          200: {
            description: 'Cuando se elimina correctamente el documento.',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'OK',
                },
              },
            }, // .end schema
          },
        }, // .end responses
      }, // .end delete
    }, // .end route path
    '/videos/{videoId}/comments': {
      get: {
        tags: ['comments'],
        summary: 'Recupera todos los comentarios del video.',
        produces: ['application/json'],
        parameters: [
          {
            name: 'autentication',
            in: 'headers',
            description: 'token de autenticación',
            required: false,
            schema: {
              type: 'string',
              example:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOWI2NWQ1YjZkMGFmYmU0YWU1YzhjZSIsImlhdCI6MTY1NDM1MTMxNywiZXhwIjoxNjU0NDM3NzE3fQ.pG0El3BK-m3AZcKH77H9rT7pQ4F5HnQa7uvGhSWuFJY',
            },
          },
          {
            name: 'videoId',
            in: 'path',
            description: 'ID del video.',
            required: true,
          },
        ],
        responses: {
          200: {
            description: 'Arreglo con los comentarios del video.',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Ok',
                },
                comments: {
                  type: 'array',
                  items: {
                    $ref: '#/definitions/videoComment',
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['comments'],
        summary: 'Agrega un nuevo comentario al video',
        produces: ['application/json'],
        parameters: [
          {
            name: 'autentication',
            in: 'headers',
            description: 'token de autenticación',
            required: true,
            schema: {
              type: 'string',
              example:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOWI2NWQ1YjZkMGFmYmU0YWU1YzhjZSIsImlhdCI6MTY1NDM1MTMxNywiZXhwIjoxNjU0NDM3NzE3fQ.pG0El3BK-m3AZcKH77H9rT7pQ4F5HnQa7uvGhSWuFJY',
            },
          },
          {
            name: 'videoId',
            in: 'path',
            description: 'ID del video a agregar el comment.',
            required: true,
          },
          {
            name: 'body',
            in: 'body',
            description: 'los datos del comentario relacionado al video',
            required: true,
            schema: {
              type: 'object',
              properties: {
                commentBody: {
                  type: 'string',
                  required: true,
                  example:
                    'este video me parecio muy gracioso y lo recomendare',
                },
              },
            },
          },
        ],
        responses: {
          404: {
            description: 'el usuario o el video no fueron encontrados',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'usuario no encontrado',
                },
              },
            },
          },
          201: {
            description:
              'el comentario fue creado y agregado correctamente al usuario y al video',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Ok',
                },
                comment: {
                  $ref: '#/definitions/comment',
                },
              },
            },
          },
        },
      },
    },
    '/videos/{videoId}/comments/{commentId}': {
      put: {
        tags: ['comments'],
        summary: 'Actualiza el cuerpo de un comentario.',
        produces: ['application/json'],
        parameters: [
          // Token
          {
            name: 'autentication',
            in: 'headers',
            description: 'token de autenticación',
            required: true,
            schema: {
              type: 'string',
              example:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOWI2NWQ1YjZkMGFmYmU0YWU1YzhjZSIsImlhdCI6MTY1NDM1MTMxNywiZXhwIjoxNjU0NDM3NzE3fQ.pG0El3BK-m3AZcKH77H9rT7pQ4F5HnQa7uvGhSWuFJY',
            },
          },
          // Video ID
          {
            name: 'videoId',
            in: 'path',
            description: 'ID del video al cual le eliminaremos el comment.',
            required: true,
          },
          // Comment Id
          {
            name: 'commentId',
            in: 'path',
            description: 'ID del comment el cual eliminaremos.',
            required: true,
          },
          // body
          {
            name: 'body',
            in: 'body',
            description: 'los datos del comentario relacionado al video',
            required: true,
            schema: {
              type: 'object',
              properties: {
                commentBody: {
                  type: 'string',
                  required: true,
                  example:
                    'este video me parecio muy gracioso y lo recomendare',
                },
              },
            },
          },
        ],
        responses: {
          200: {
            description: 'El comentario fue actualizado correctamente.',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'OK',
                },
                comment: {
                  $ref: '#definitions/comment',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['comments'],
        summary: 'Elimina un comentario existente en el video',
        produces: ['application/json'],
        parameters: [
          {
            name: 'autentication',
            in: 'headers',
            description: 'token de autenticación',
            required: true,
            schema: {
              type: 'string',
              example:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOWI2NWQ1YjZkMGFmYmU0YWU1YzhjZSIsImlhdCI6MTY1NDM1MTMxNywiZXhwIjoxNjU0NDM3NzE3fQ.pG0El3BK-m3AZcKH77H9rT7pQ4F5HnQa7uvGhSWuFJY',
            },
          },
          {
            name: 'videoId',
            in: 'path',
            description: 'ID del video al cual le eliminaremos el comment.',
            required: true,
          },
          {
            name: 'commentId',
            in: 'path',
            description: 'ID del comment el cual eliminaremos.',
            required: true,
          },
        ],
        responses: {
          200: {
            description:
              'el comentario fue eliminado correctamente al usuario y al video',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'OK',
                },
              },
            },
          },
        },
      },
    },
    '/users': {
      get: {
        tags: ['user'],
        summary: '',
        produces: ['application/json'],
      }, // .end get
    }, // .end /users
    '/user/channel': {
      get: {
        tags: ['user'],
        summary: '',
        produces: ['application/json'],
        parameters: [
          {
            name: 'nickname',
            in: 'query',
            description: 'Nick del usuario',
            required: true,
            type: 'string',
          },
        ],
      }, // .end get
    },
    '/user/logout': {
      post: {
        tags: ['user'],
        summary: '',
        produces: ['application/json'],
        deprecated: true,
      }, // .end get
    }, // .end /users/logout
    '/user': {
      get: {
        tags: ['user'],
        summary: '',
        produces: ['application/json'],
      }, // .end get
    },
    '/user/comments': {
      get: {
        tags: ['comments'],
        summary: 'Recupera todos los comentarios realizados por el usuario.',
        produces: ['application/json'],
        parameters: [
          {
            name: 'autentication',
            in: 'headers',
            description: 'token de autenticación',
            required: true,
            schema: {
              type: 'string',
              example:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOWI2NWQ1YjZkMGFmYmU0YWU1YzhjZSIsImlhdCI6MTY1NDM1MTMxNywiZXhwIjoxNjU0NDM3NzE3fQ.pG0El3BK-m3AZcKH77H9rT7pQ4F5HnQa7uvGhSWuFJY',
            },
          },
        ],
        responses: {
          200: {
            description: 'Arreglo con los comentarios del video.',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Ok',
                },
                comments: {
                  type: 'array',
                  items: {
                    $ref: '#/definitions/userComment',
                  },
                },
              },
            },
          },
        },
      }, // .end get
    },
    '/user/profile': {
      get: {
        tags: ['user'],
        summary: '',
        produces: ['application/json'],
      }, // .end get
      put: {
        tags: ['user'],
        summary: '',
        produces: ['application/json'],
      }, // .end post
      delete: {
        tags: ['user'],
        summary: '',
        produces: ['application/json'],
      }, // .end delete
    },
    '/auth/local/signup': {
      post: {
        tags: ['Auth'],
        summary: 'End point for register new user.',
        produces: ['application/json'],
      }, // .end get
    }, // .end /users/signin
    '/auth/local/login': {
      post: {
        tags: ['Auth'],
        summary: 'End point for login user.',
        produces: ['application/json'],
      }, // .end get
    }, // .end /users/logout
  }, // .end path
  definitions: {
    userInComment: {
      type: 'object',
      required: ['name'],
      properties: {
        id: {
          type: 'string',
          example: '629b65d5b6d0afbe4ae5c8ce',
        },
        firstName: {
          type: 'string',
          example: 'Jonh',
        },
        lastName: {
          type: 'string',
          example: 'Doe',
        },
        fullName: {
          type: 'string',
          example: 'John Doe',
        },
        avatar: {
          type: 'string',
          example:
            'https://ui-avatars.com/api/?background=random&name=John+Doe',
        },
        avatarUrl: {
          type: 'string',
          example:
            'https://ui-avatars.com/api/?background=random&name=John+Doe',
        },
      },
    },
    labelPost: {
      type: 'object',
      required: ['name'],
      properties: {
        name: {
          type: 'string',
          example: 'Autos Deportivos',
        },
      },
    },
    Label: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '629b82eb8fe398f547c03c24',
        },
        name: {
          type: 'string',
          example: 'Autos Deportivos',
        },
        slug: {
          type: 'string',
          example: 'autos_deportivos',
        },
        videos: {
          type: 'array',
          items: {
            $ref: '#/definitions/Video',
          },
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
        updateAt: {
          type: 'string',
          format: 'date-time',
        },
      }, // .end properties
    }, // .end Label
    LabelLite: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '629b82eb8fe398f547c03c24',
        },
        name: {
          type: 'string',
          example: 'Autos Deportivos',
        },
        slug: {
          type: 'string',
          example: 'autos_deportivos',
        },
        videos: {
          type: 'array',
          items: [],
          example: [],
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
        updateAt: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
    Video: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '629b82eb8fe398f547c03c24',
        },
        title: {
          type: 'string',
          example: 'Manual para dormir',
        },
        description: {
          type: 'string',
          example:
            'La forma correcta de dormir cada noche, no se olviden mirar antes el video de como despertarse.',
        },
        videoUrl: {
          type: 'string',
          example: 'https://www.youtube.com/watch?v=SdsaZ-t1QwA',
        },
        imageUrl: {
          type: 'string',
          example: 'https://www.youtube.com/watch?v=SdsaZ-t1QwA',
        },
        visits: {
          type: 'number',
          example: 1230,
        },
        labels: {
          type: 'array',
          items: {
            $ref: '#/definitions/Label',
          },
        },
        comments: {
          type: 'array',
          items: [],
          example: [],
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
        updateAt: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
    videoInComment: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '629b82eb8fe398f547c03c24',
        },
        title: {
          type: 'string',
          example: 'Manual para dormir',
        },
        imageUrl: {
          type: 'string',
          example: 'https://www.youtube.com/watch?v=SdsaZ-t1QwA',
        },
      },
    },
    VideoCreateRequest: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Manual para dormir',
          required: true,
        },
        description: {
          type: 'string',
          example:
            'La forma correcta de dormir cada noche, no se olviden mirar antes el video de como despertarse.',
        },
        video: {
          type: 'string',
          format: 'binary',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
        labels: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: ['Etiqueta 1', 'Etiqueta 2'],
        },
      },
      required: ['title', 'description', 'video', 'image'],
    },
    showVideoResponse: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '629b82eb8fe398f547c03c24',
        },
        title: {
          type: 'string',
          example: 'Manual para dormir',
        },
        description: {
          type: 'string',
          example:
            'La forma correcta de dormir cada noche, no se olviden mirar antes el video de como despertarse.',
        },
        videoUrl: {
          type: 'string',
          example: 'https://www.youtube.com/watch?v=SdsaZ-t1QwA',
        },
        imageUrl: {
          type: 'string',
          example: 'https://www.youtube.com/watch?v=SdsaZ-t1QwA',
        },
        visits: {
          type: 'number',
          example: 1230,
        },
        comments: {
          type: 'array',
          items: [],
          example: [],
        },
        likes: {
          type: 'number',
          example: 123,
        },
        userLikeVideo: {
          type: 'boolean',
          example: false,
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
        updateAt: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
    comment: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '62a534aaeb6b3615c506c5b5',
        },
        userId: {
          type: 'string',
          example: 'Id.del.usuario',
        },
        videoId: {
          type: 'string',
          example: 'Id.del.video',
        },
        body: {
          type: 'string',
          example: 'este video me parecio muy gracioso y lo recomendare',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
        updateAt: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
    videoComment: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '62a534aaeb6b3615c506c5b5',
        },
        userId: {
          type: 'string',
          example: 'Id.del.usuario',
        },
        videoId: {
          type: 'string',
          example: 'Id.del.video',
        },
        body: {
          type: 'string',
          example: 'este video me parecio muy gracioso y lo recomendare',
        },
        user: {
          $ref: '#definitions/userInComment',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
        updateAt: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
    userComment: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '62a534aaeb6b3615c506c5b5',
        },
        userId: {
          type: 'string',
          example: 'Id.del.usuario',
        },
        videoId: {
          type: 'string',
          example: 'Id.del.video',
        },
        body: {
          type: 'string',
          example: 'este video me parecio muy gracioso y lo recomendare',
        },
        video: {
          $ref: '#definitions/videoInComment',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
        updateAt: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
  },
};
