
const mongoose = require("mongoose");
const config = require("../config");

module.exports = {
  init: () => {
    const dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
      poolSize: 5,
      connectTimeoutMS: 10000,
      family: 4,
    };

    mongoose.connect(
      process.platform != "linux" && config.ofi != true
        ? process.env.MONGOOSE_KEY2
        : process.env.MONGOOSE_KEY
    );

    mongoose.Promise = global.Promise;

    mongoose.connection.on("connected", () => {
      console.log(" ");
      console.log("MongoDB - Připojeno.");
    });

    mongoose.connection.on("err", (err) => {
      console.log(" ");
      console.error(`MongoDB - Chyba: \n${err.stack}`);
    });

    mongoose.connection.on("dissconnected", () => {
      console.log(" ");
      console.warn("MongoDB - Připojení přerušeno.");
    });
  },
};
