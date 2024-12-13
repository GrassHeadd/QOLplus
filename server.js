import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();  
const supabaseUrl = 'https://rmjcnufjtkakbcocvglf.supabase.co';
const supabaseKey = process.env.DB_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/publicstaticvoidmain", async (req, res) => {
  try {
    // Example query - adjust table name and conditions as needed
    const { data, error } = await supabase
    .from('users')
    .select('*');

    if (error) {
      throw error;
    }
    console.log("output: ", data);
    res.json({ data });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
