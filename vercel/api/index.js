const app = require("../../backend/server.js");

module.exports = app;

// const express = require("express");
// const bodyParser = require("body-parser");
// const dotenv = require("dotenv");
// const cors = require("cors");

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(bodyParser.json());
// app.use(cors());

// app.get("/api/hello", (req, res) => {
//   res.status(200).json({ message: "Hello from server!" });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// module.exports = app;

// module.exports = (request, response) => {
//   if (request.method === "GET") {
//     response.status(200).json({ message: "Hello from Vercel!" });
//   } else {
//     response.status(405).json({ message: "Method not allowed" });
//   }
// };