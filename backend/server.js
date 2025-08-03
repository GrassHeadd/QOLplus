const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

// // Load environment variables
dotenv.config();

// // Individual sub-files
const events = require("./routing/events.js");
// const exercises = require("./routing/exercises.js");
// // const food = require("./backend/routing/food.js");
// const expenses = require("./routing/expenses.js");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.use("/api/events", events);
// app.use("/api/exercises", exercises);
// // app.use("/food", food);
// app.use("/api/expenses", expenses);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;