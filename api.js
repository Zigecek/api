require("dotenv").config();
require("./utils/mongoose").init();
const { readdirSync } = require("node:fs");
const { join } = require("node:path");

const express = require("express");
const bodyparser = require("body-parser");

const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
var jsdocOptions = {
  swaggerDefinition: {
    info: {
      title: "API",
      version: "1.0.0",
      description: "API",
      contact: {
        name: "Jan Kozohorský",
        email: "jan@kozohorsky.xyz",
      },
    },
  },
  apis: [__filename],
};
const swaggerSpec = swaggerJsDoc(jsdocOptions);

const app = express();
app.use(bodyparser.json());

/**
 * @swagger
 * /:
 *  get:
 *   description: Swagger UI
 */
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

var routes = [];

function addSubs(path) {
  let subs = readdirSync(path, { withFileTypes: true }).filter((dirent) =>
    dirent.isDirectory()
  );

  subs.forEach((sub) => {
    routes.push({
      path: "/" + sub.name,
      router: require(join(path, "/", sub.name)),
    });
    //jsdocOptions.apis.push(join(path, "/", sub.name, "/index.js"));
  });
}

console.log(routes);

addSubs(join(__dirname, "routes"));

routes.forEach((route) => {
  app.use(route.path, route.router);
});

app.listen(process.env.PORT, () => {
  console.log(`API's working on port: ${process.env.PORT}`);
});
