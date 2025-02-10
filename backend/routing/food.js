/* general flow for calorie calculator
    INPUTTING THE CALORIES:
    manual inputting: call api to input out the quantity, calorie per quantity, calculate in backend total nutrients -> input into database
    ai inputtiing: base on input -> determine enough information -> if successful, calculate out total nutrients-> input into database
    OUTPUTTING:
    calories for the day: calculate all the entries of the current day, calls the calories for any day function for the current day
    calories for any day: calculate the current calories of the total day 
*/


//post request for the calculation


// import express from "express";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import { createClient } from '@supabase/supabase-js';
// import cors from "cors";
// import OpenAI from "openai";

// dotenv.config();  
// const supabaseUrl = 'https://rmjcnufjtkakbcocvglf.supabase.co';
// const supabaseKey = process.env.SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);
// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(bodyParser.json());
// app.use(cors());