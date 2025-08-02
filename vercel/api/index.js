// const serverless = require("serverless-http");

// const app = require("../../backend/server.js");

// module.exports = serverless(app);

const express = require("express");
const serverless = require("serverless-http");

const app = express();

app.get("/ping", (req, res) => {
  res.json({ message: "pong!" });
});

module.exports = serverless(app);