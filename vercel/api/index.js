const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/hello", (req, res) => {
  console.log("Hit /hello route!");
  res.status(200).json({ message: "OK" });
});

module.exports = serverless(app);

// module.exports = (request, response) => {
//   if (request.method === "GET") {
//     response.status(200).json({ message: "Hello from Vercel!" });
//   } else {
//     response.status(405).json({ message: "Method not allowed" });
//   }
// };