import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { createClient } from '@supabase/supabase-js';
import cors from "cors";

// Load environment variables
dotenv.config();
const supabaseUrl = 'https://rmjcnufjtkakbcocvglf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.get("/events/:userId/:monthyear", async (request, response) => {
  try {
    const userId = request.params.userId;
    const monthyear = request.params.monthyear;

    const { data, error } = await supabase.from("events").select("*").eq("user_id", userId).lte("start_monthyear", monthyear).gte("end_monthyear", monthyear);

    if (error) { throw error; }
    response.json({ data });
  } catch (error) {
    console.error('Error:', error.message);
    response.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/events", async (request, response) => {
  const { userId, title, location, notes, category, startMonthYear, endMonthYear, startDOM, endDOM, startTime, endTime } = request.body;

  if (category == null) category = "Others";
  
  try {
  const { data, error } = await supabase.from("events").insert({
    user_id: userId,
    title: title,
    location: location,
    notes: notes,
    category: category,
    start_monthyear: startMonthYear,
    end_monthyear: endMonthYear,
    start_dayofmonth: startDOM,
    end_dayofmonth: endDOM,
    start_time: startTime,
    end_time: endTime
  });
  
  if (error) throw error;
  
  response.json({ data });
} catch (error) {
  console.error('Error:', error.message);
  response.status(500).json({ error: 'Internal server error' });
}
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Format: YYYYMMDD
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