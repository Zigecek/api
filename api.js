require("dotenv").config();
require("./utils/mongoose").init();

const express = require("express");
const app = express();

app.use(require("./routes/adam"));

app.listen(process.env.PORT, () => {
  console.log(`API's working on port: ${process.env.PORT}`);
});
