const fs = require("fs");
const p = require("path");

const RequestParameterType = {
  QUERY: "QUERY",
  PARAM: "PARAM",
  BODY: "BODY",
};
const swaggerConfig = {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Swagger API",
  },
  tags: [],
  consumes: ["application/json"],
  produces: ["application/json"],
  paths: {},
  definitions: {},
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const generateJSON = ({ prefix, files }) => {
  Object.keys(files).forEach((tag) => {
    files[tag].getRoutes().forEach((r) => {
      const url = `${prefix}${tag}${r.path}`;
      const actionName = r.action ? r.action.name : "";
      if (swaggerConfig.paths[url] === undefined) {
        swaggerConfig.paths[url] = {};
      }
      swaggerConfig.paths[url][r.method.toLowerCase()] = {
        tags: [tag],
        summary: actionName,
        produces: ["application/json"],
        responses: {
          200: {
            description: "OK",
          },
          400: {
            description: "badly formated payload",
          },
          404: {
            description: "page not found",
          },
        },
      };

      const types = Object.keys(r.input || {}).map((key) => r.input[key]);

      if (types.includes(RequestParameterType.BODY)) {
        swaggerConfig.paths[url][r.method.toLowerCase()].requestBody = {
          description: "payload Object",
          content: {
            "application/json": {
              schema: {
                $ref: `#/definitions/${actionName}`,
              },
            },
          },
        };

        swaggerConfig.definitions[actionName] = {
          type: "object",
          properties: {},
        };
      }

      if (types.includes(RequestParameterType.QUERY) || types.includes(RequestParameterType.PARAM)) {
        swaggerConfig.paths[url][r.method.toLowerCase()].parameters = [];
      }

      for (const key of Object.keys(r.input || {})) {
        if (r.input[key] === RequestParameterType.BODY) {
          swaggerConfig.definitions[actionName].properties[key] = {
            type: "string",
          };
        }

        if (r.input[key] === RequestParameterType.QUERY) {
          swaggerConfig.paths[url][r.method.toLowerCase()].parameters.push({
            name: key,
            description: "",
            in: RequestParameterType.QUERY,
            schema: {
              type: "string",
            },
          });
        }

        if (r.input[key] === RequestParameterType.PARAM) {
          swaggerConfig.paths[url][r.method.toLowerCase()].parameters.push({
            name: key,
            description: "",
            in: "path",
            schema: {
              type: "string",
            },
            allowReserved: true,
          });
        }
      }
    });
  });

  return JSON.stringify(swaggerConfig, null, 2);
};
const generatedHTML = () => `
<!-- HTML for static distribution bundle build -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Swagger UI</title>
    
    <style>
      ${fs.readFileSync(p.resolve(__dirname, "./swagger/swagger-ui.css"))}
      html {
        box-sizing: border-box;
        overflow: -moz-scrollbars-vertical;
        overflow-y: scroll;
      }

      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }

      body {
        margin: 0;
        background: #fafafa;
      }
    </style>
  </head>

  <body>
    <div id="swagger-ui"></div>

   
    <script>
    ${fs.readFileSync(p.resolve(__dirname, "./swagger/swagger-ui-bundle.js"))}
    ${fs.readFileSync(p.resolve(__dirname, "./swagger/swagger-ui-standalone-preset.js"))}
      window.onload = function () {
        window.ui = SwaggerUIBundle({
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
          plugins: [SwaggerUIBundle.plugins.DownloadUrl],
          layout: 'StandaloneLayout',
          validatorUrl: null,
          url: window.location.pathname +'/config.json'
        });
      };
    </script>
  </body>
</html>
`;
module.exports = ({ prefix, files }) => {
  return (req, res) => {
    if (req.url === "/config.json") {
      const computedPrefix = prefix || req.originalUrl.split("/").slice(0, -2).join("/");
      res.send(generateJSON({ prefix: computedPrefix, files }));
    } else {
      res.setHeader("Content-Type", "text/html");
      res.send(generatedHTML());
    }
  };
};
