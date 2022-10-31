require("dotenv").config();
require("./utils/mongoose").init();
const { readdirSync } = require("node:fs");
const { join } = require("node:path");

const express = require("express");
const bodyparser = require("body-parser");

const app = express();

app.use(bodyparser.json());

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
  });
}

console.log(routes);

addSubs(join(__dirname, "routes"));

routes.forEach((route) => {
  app.use(route.path, route.router);
});

// swagger
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const jsdocOptions = {
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
  apis: ["./api.js", "./routes/**/*.js"],
};

const swaggerSpec = swaggerJsDoc(jsdocOptions);

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(process.env.PORT, () => {
  console.log(`API's working on port: ${process.env.PORT}`);
});
