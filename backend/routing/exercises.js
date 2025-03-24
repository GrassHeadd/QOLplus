/*todo: gym stuff calculation
- track the weight and reps im doing
- ai comment on my intensity and if im training the parts enough
- ai give suggestions to if i need to change anything and what i should work on next

linkage with other stuff
- ai identify what day i should exercise next base on my schedule
- ai identify how much calories i lost from running and gymming and comment on it

*/

const thisRoute = require("express").Router();
const DateUtils = require("../utils/date.js");

const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://rmjcnufjtkakbcocvglf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
require('datejs');

thisRoute.get("/:userId/:month/:date", async (request, response) => {
    try {
      const userId = request.params.userId;
      const inputDate = request.params.date;
      const fromDateStr = DateUtils.getDateAtMonthStart(inputDate);
      const endDateStr = DateUtils.getDateAtMonthEnd(inputDate);
  
      const { data } = await supabase.from("exercises").select("*").eq("userId", userId).gte("date", fromDateStr).lte("date", endDateStr)
      response.status(200).json({ data });
      
  } catch (error) {
      console.error('Error:', error.message);
      response.status(500).json({ error: 'Internal server error' });
  }
  });

// thisRoute.get("/:userId/:week/:date", async (request, response) => {
//     try {
//       const userId = request.params.userId;
//       const inputDate = request.params.date;
//       const fromDateStr = DateUtils.getEndOfWeek(inputDate);
//       const endDateStr = DateUtils.getStartOfWeek(inputDate);
  
//       const { data } = await supabase.from("exercises").select("*").eq("userId", userId).gte("date", fromDateStr).lte("date", endDateStr)
//       response.status(200).json({ data });
      
//   } catch (error) {
//       console.error('Error:', error.message);
//       response.status(500).json({ error: 'Internal server error' });
//   }
//   });

//get all gym data for a user
thisRoute.get("/:userId", async (request, response) => {
    try {
        const userId = request.params.userId;

        const { data } = await supabase.from("exercises").select("*").eq("userId", userId);

        response.json({ data });

    } catch (error) {
        console.error('Error:', error.message);
        response.status(500).json({ error: 'Internal server error' });
}
});

//get a specific gym event
thisRoute.get("/:userId/:exerciseId", async (request, response) => {
    try {
        const userId = request.params.userId;
        const exerciseId = request.params.exerciseId;

        const { data } = await supabase.from("exercises").select("*").eq("userId", userId).eq("exerciseId", exerciseId);

        response.json({ data });

    } catch (error) {
        console.error('Error:', error.message);
        response.status(500).json({ error: 'Internal server error' });
    }
});

//todo: get a week of gym data for a user

//post gym data
thisRoute.post("/", async (request, response) => {
    const { userId, 
        exerciseName, 
        exerciseStructure, 
        date,
        notes 
        } = request.body;

    try {
    const { data } = await supabase.from("exercises").insert({
        userId: userId,
        exerciseName: exerciseName,
        exerciseStructure: exerciseStructure,
        date: date,
        notes: notes
        //no need exerciseId, supabase will auto generate
    }).select();
    console.log("posted data" + data);

    response.status(200).json({ data });

    } catch (error) {
    console.error('Error:', error.message);
    response.status(500).json({ error: 'Internal server error' });
    }
});

//delete a specific gym event
thisRoute.delete("/:exerciseId", async (request, response) => {
    const exerciseId = request.params.exerciseId;

    try {
        const { data } = await supabase.from("exercises").delete().eq("exerciseId", exerciseId);
        response.status(200).json({ data });

    } catch (error) {
        console.error('Error:', error.message);
        response.status(500).json({ error: 'Internal server error, unable to delete' });
    }
});

//edit a event
thisRoute.put("/:exerciseId", async (request, response) => {
    const { userId, 
            exerciseName, 
            exerciseStructure, 
            date,
            notes
        } = request.body;
    
    const exerciseId = request.params.exerciseId;
       
    try {
        const { data } = await supabase.from("exercises").update({
            userId: userId,
            exerciseName: exerciseName,
            exerciseStructure: exerciseStructure,
            date: date,
            notes: notes
        }).eq("exerciseId", exerciseId).select("*");

        if (!data || data.length === 0) {
            return response.status(404).json({ error: "exercise not found" });
          } else {
            return response.status(200).json({ data });
          }

    } catch (error) {
        console.error('Error:', error.message);
        response.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = thisRoute;