const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Individual sub-files
const events = require("./backend/routing/events.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use("/events", events);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


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