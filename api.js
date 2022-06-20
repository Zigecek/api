require("dotenv").config();
require("./utils/mongoose").init();

const express = require("express");
const app = express();

app.use(express.json());

const routes = [
  {
    path: "/adam",
    router: require("./routes/adam"),
  },
];

routes.forEach((route) => {
  app.use(route.path, route.router);
});

app.listen(process.env.PORT, () => {
  console.log(`API's working on port: ${process.env.PORT}`);
});