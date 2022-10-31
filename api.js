require("dotenv").config();
require("./utils/mongoose").init();
const { readdirSync } = require("node:fs");
const { join } = require("node:path");

const express = require("express");
const bodyparser = require("body-parser");

const app = express();
app.use(bodyparser.json());

/**
 * @swagger
 * /:
 *  get:
 *   description: Swagger UI
 */

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

app.listen(process.env.PORT, () => {
  console.log(`API's working on port: ${process.env.PORT}`);
});
