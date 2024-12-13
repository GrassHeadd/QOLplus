import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rmjcnufjtkakbcocvglf.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Load environment variables
dotenv.config();  


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/publicstaticvoidmain", async (req, res) => {
  try {
    // Example query - adjust table name and conditions as needed
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', 2)
      .limit(1)
      // You can add filters like this:
      // .eq('column_name', 'value')
      // .gte('age', 18)
      // .limit(10)
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
