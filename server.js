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

app.get("/events/:userId/:date", async (request, response) => {
  try {
    // Example query - adjust table name and conditions as needed
    const userId = request.params.userId;
    const date = new Date(request.params.date);

    // Format of date: YYYYMM E.g. 202409, format of time: HHMM e.g. 0000 to 2359
    const { data, error } = await supabase.from('events').select('*').eq("user_id", userId).gte("fromDate", "");
    
    if (error) {throw error;}

    console.log("output: ", data + ", " + userId + "," + date);
    response.json({ data });
  } catch (error) {
    console.error('Error:', error.message);
    response.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//TODO
function formatDate(dateObj) {
  // stump
  return null;
}