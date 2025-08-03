const express = require("express");
const serverless = require("serverless-http");

const app = express();

app.get("/hello", (req, res) => {
  console.log("✅ Reached /hello route");
  res.status(200).json({ message: "Hello from Express!" });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Root of Express in /api" });
});

module.exports = serverless(app);

// module.exports = (request, response) => {
//   if (request.method === "GET") {
//     response.status(200).json({ message: "Hello from Vercel!" });
//   } else {
//     response.status(405).json({ message: "Method not allowed" });
//   }
// };