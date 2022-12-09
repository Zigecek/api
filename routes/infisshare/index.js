const mysql = require("mysql2");
const express = require("express");
require("dotenv").config();

const infisshare = express.Router();
infisshare.use(express.json());
infisshare.use(cors());

// vytvoření připojení k databázi
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});

infisshare.get("/", (req, res) => {
  connection.query("SELECT * FROM infisshare", (err, rows, fields) => {
    console.log(rows);
    console.log(fields);
    if (!err) {
      res.send(rows);
    } else {
      console.error(err);
      res.sendStatus(500);
    }
  });
});

module.exports = infisshare;
