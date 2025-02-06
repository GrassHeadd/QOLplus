/*todo: gym stuff calculation
- track the weight and reps im doing
- ai comment on my intensity and if im training the parts enough
- ai give suggestions to if i need to change anything and what i should work on next

linkage with other stuff
- ai identify what day i should exercise next base on my schedule
- ai identify how much calories i lost from running and gymming and comment on it

*/

const thisRoute = require("express").Router();

const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://rmjcnufjtkakbcocvglf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

thisRoute.get("/:userId/:monthyear", async (request, response) => {
  try {
    const userId = request.params.userId;
    const monthyear = request.params.monthyear;

    const { data, error } = await supabase.from("gym").select("*").eq("user_id", userId).lte("start_monthyear", monthyear).gte("end_monthyear", monthyear);

    if (error) { throw error; }
    response.json({ data });
} catch (error) {
    console.error('Error:', error.message);
    response.status(500).json({ error: 'Internal server error' });
}
});

thisRoute.post("/", async (request, response) => {
  const { user_d, title, location, notes, category, startMonthYear, endMonthYear, startDOM, endDOM, startTime, endTime } = request.body;

  // if (category == null) category = "Others";

  try {
  const { data, error } = await supabase.from("events").insert({
      user_id: userId,
      exercise_id: exercise_id,
      exercise_name: exercise_name,
      exercise_structure: exercise_structure,
      // exercise_date: exercise_date,
  });

  if (error) throw error;
  
  response.json({ data });
} catch (error) {
  console.error('Error:', error.message);
  response.status(500).json({ error: 'Internal server error' });
}
});

