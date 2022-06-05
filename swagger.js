module.exports = {
  swagger: "2.0",
  info: {
    description: "Esta API se encarga de manejar la infomación de la base de datos del proyecto `YouTube Clone`",
    version: "1.0.0",
    title: "API Youtube Clone",
    contact: {
      email: "apiteam@swagger.io",
    },
  },
  server: {
    url: "http://localhost:8080",
  },
  tags: [
    {
      name: "label",
      description: "Este endpoint maneja toda la informacion relacionada con las etiquetas usadas en los videos.",
    },
  ],
  paths: {
    "/label": {
      get: {
        tags: ["label"],
        summary: "Recupera el listado con todas las etiquetas de la base de datos.",
        produces: ["application/json"],
        responses: {
          200: {
            description: "OK",
            schema: {
              type: "array",
              items: {
                $ref: "#/definitions/LabelLite",
              },
            },
          },
        },
      },
      post: {
        tags: ["label"],
        summary: "Inserta la información de una nueva etiqueta en la base de datos.",
        produces: ["application/json"],
        parameters: [
          {
            name: "body",
            in: "body",
            description: "Nombre de la etiqueta a ingresar",
            required: true,
            schema: {
              $ref: "#/definitions/labelPost",
            },
          },
        ],
        responses: {
          201: {
            description: "Etiqueta Creada.",
            schema: { $ref: "#/definitions/LabelLite" },
          },
          405: {
            description: "Nombre de etiqueta faltante.",
          },
        },
      },
    },
    "/label/{slug}": {
      get: {
        tags: ["label"],
        summary: "Recupera la instancia de la etiqueta.",
        produces: ["application/json"],
        parameters: [
          {
            name: "slug",
            in: "path",
            description: "Slug de la etiqueta a recuperar.",
            required: true,
            type: "string",
          },
        ],
        responses: {
          200: {
            description: "OK",
            schema: {
              $ref: "#/definitions/Label",
            },
          },
          404: {
            description: "Etiqueta no encontrada.",
          },
        },
      },
      put: {
        tags: ["label"],
        summary: "Actualiza el nombre y el slug de la etiqueta.",
        produces: ["application/json"],
        parameters: [
          {
            name: "slug",
            in: "path",
            description: "Slug de la etiqueta a actualizar.",
            required: true,
            type: "string",
          },
          {
            name: "body",
            in: "body",
            description: "El nuevo nombre de la etiqueta.",
            required: true,
            schema: {
              $ref: "#/definitions/labelPost",
            },
          },
        ],
        responses: {
          200: {
            description: "Etiqueta actualizada.",
            schema: { $ref: "#/definitions/LabelLite" },
          },
          404: {
            description: "Etiqueta no encontrada.",
          },
          405: {
            description: "Slug o nombre de etiqueta faltante.",
          },
        },
      },
      delete: {
        tags: ["label"],
        summary: "Elimina la etiqueta de la DB.",
        produces: ["application/json"],
        parameters: [
          {
            name: "slug",
            in: "path",
            description: "Slug de la etiqueta a eliminar.",
            required: true,
            type: "string",
          },
        ],
        responses: {
          200: {
            description: "OK",
            schema: {
              $ref: "#/definitions/LabelLite",
            },
          },
          404: {
            description: "Etiqueta no encontrada.",
          },
        },
      },
    },
  },
  definitions: {
    labelPost: {
      type: "object",
      required: ["name"],
      properties: {
        name: {
          type: "string",
          example: "Autos Deportivos",
        },
      },
    },
    Label: {
      type: "object",
      properties: {
        id: {
          type: "string",
          example: "629b82eb8fe398f547c03c24",
        },
        name: {
          type: "string",
          example: "Autos Deportivos",
        },
        slug: {
          type: "string",
          example: "Autos_Deportivos",
        },
        videos: {
          type: "array",
          items: {
            $ref: "#/definitions/Video",
          },
        },
        createdAt: {
          type: "string",
          format: "date-time",
        },
        updateAt: {
          type: "string",
          format: "date-time",
        },
      }, //.end properties
    }, //.end Label
    LabelLite: {
      type: "object",
      properties: {
        id: {
          type: "string",
          example: "629b82eb8fe398f547c03c24",
        },
        name: {
          type: "string",
          example: "Autos Deportivos",
        },
        slug: {
          type: "string",
          example: "Autos_Deportivos",
        },
        videos: {
          type: "array",
          items: [],
          example: [],
        },
        createdAt: {
          type: "string",
          format: "date-time",
        },
        updateAt: {
          type: "string",
          format: "date-time",
        },
      },
    },
    Video: {
      type: "object",
      properties: {
        id: {
          type: "string",
          example: "629b82eb8fe398f547c03c24",
        },
        title: {
          type: "string",
          example: "Manual para dormir",
        },
        description: {
          type: "string",
          example: "La forma correcta de dormir cada noche, no se olviden mirar antes el video de como despertarse.",
        },
        videoUrl: {
          type: "string",
          example: "https://www.youtube.com/watch?v=SdsaZ-t1QwA",
        },
        imageUrl: {
          type: "string",
          example: "https://www.youtube.com/watch?v=SdsaZ-t1QwA",
        },
        visits: {
          type: "number",
          example: 1230,
        },
        labels: {
          type: "array",
          items: {
            $ref: "#/definitions/Label",
          },
        },
        comments: {
          type: "array",
          items: [],
          example: [],
        },
        createdAt: {
          type: "string",
          format: "date-time",
        },
        updateAt: {
          type: "string",
          format: "date-time",
        },
      },
    },
  },
};
