const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/hello", (req, res) => {
  res.status(200).json({ message: "Hello from server!" });
});

module.exports = (request, response) => {
  app(request, response);
};

// module.exports = (request, response) => {
//   if (request.method === "GET") {
//     response.status(200).json({ message: "Hello from Vercel!" });
//   } else {
//     response.status(405).json({ message: "Method not allowed" });
//   }
// };