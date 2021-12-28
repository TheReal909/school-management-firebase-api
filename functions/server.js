'use strict'

const express = require("express");
const cors = require("cors");
const app = express();

const config = require('./config')

// to allow connections from the front-end
var corsOptions = { 
  origin: "http://localhost:8081"
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Soutrali !" });
  });
  
  // set port, listen for requests
  const PORT = process.env.PORT || 8080;
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}.`);
  });