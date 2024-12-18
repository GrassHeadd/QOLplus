import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { createClient } from '@supabase/supabase-js';
import cors from "cors";
import OpenAI from "openai";

// Load environment variables
dotenv.config();  
const supabaseUrl = 'https://rmjcnufjtkakbcocvglf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

//to track the response 
let foodPrompt = "";
app.post("calorie calculator", async (req, res) => {
  try {
    const { input } = req.body;
    foodPrompt.append(input);
    const isValid = foodInfoCheck(input); //if valid to calculate the food, continue, else, prompt user for more information
    if (isValid != "True") { //if valid,then continue lol else log the error msg to the frontend and prompt for more info
      return res.status(400).json({ error: validationResult.message });
    }
    const calorieData = await foodCalorieCalculate(input);
    foodPrompt = ""; //clear the foodPrompt
    // TODO append the food prompt to the other fields we need, then add to the database
    res.json(calorieData);
  } catch (error) {
    console.error('Error:', error.message);
    response.status(500).json({ error: 'calorie calculator error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//takes in the prompt by the user, see if have enough information to determine the calorie, fat, protein, if not, prompt user for more information else, return true
function foodInfoCheck(userInput) {

  const prompt = `
  You are a food information checker. this is the output ive got ${userInput}. Base on this, determine if you are able to make a good estimate of the calories and nutrients of the food. 
  If you are, output just the string "True". 
  Else, output a string to ask the user to input what is still required to make a good estimate
  `
  try {
    const response = openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0].message.content.trim();

  } catch (err) {
    console.error("Error calling OpenAI API:", err.response?.data || err.message);
    res.status(500).json({ error: "food info check error", details: err.message });
  }
  
}

function foodCalorieCalculate(userInput) {
  const prompt = `
  You are a calorie calculator. You will return me the calorie, protein, carbohydrate and fat of the food base on the user input ${userInput}.
  output the response in json format like this:
  {
    "calorie": "the calories of the food you estimated",
    "protein": "protein of the food you estimated",
    "carbohydrate": "carbohydrate of the food you estimated",
    "fat": "fat of the food you estimated"
  }`
  try {
    const response = openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0].message.content.trim();

  } catch (err) {
    console.error("Error calling OpenAI API:", err.response?.data || err.message);
    res.status(500).json({ error: "food calorie cal error", details: err.message });
  }
}

//TODO
function formatDate(dateObj) {
  // stump
  return null;
}