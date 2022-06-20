require("dontenv").config();
require("./utils/mongoose").init();

const express = require("express");
const app = express();

app.use(require("./routes/adam"));

app.listen(process.env.PORT, () => {
  console.log(`APIs workign on port: ${process.env.PORT}`);
});
