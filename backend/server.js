const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Individual sub-files
const events = require("./routing/events.js");
const exercises = require("./routing/exercises.js");
// const food = require("./backend/routing/food.js");
const expenses = require("./routing/expenses.js");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.use("/events", events);
app.use("/exercises", exercises);
// app.use("/food", food);
app.use("/expenses", expenses);

// Format: YYYYMMDD
//TODO
function formatDate(dateObj) {
    var month = dateObj.getMonth() + 1, day = dateObj.getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return dateObj.getFullYear() + "" + month + day;
}

// Format: HHMM in 24hr format
function formatTime(dateObj) {
    var hour = dateObj.getHours(), min = dateObj.getMinutes();
    if (hour < 10) hour = "0" + hour;
    if (min < 10) min = "0" + min;
    return hour + "" + min;
}

module.exports = (request, response) => {
    app(request, response);
}