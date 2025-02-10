const thisRoute = require("express").Router();

const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://rmjcnufjtkakbcocvglf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

//get the events in a month
thisRoute.get("/:userId/:monthYear", async (request, response) => {
    try {
      const userId = request.params.userId;
      const monthYear = request.params.monthYear;

      const { data } = await supabase.from("events").select("*").eq("userId", userId).lte("startMonthYear", monthYear).gte("endMonthYear", monthyear);
      response.status(200).json({ data });
  } catch (error) {
      console.error('Error:', error.message);
      response.status(500).json({ error: 'Internal server error' });
  }
});

//get a specific event
thisRoute.get("/:userId/:eventId", async (request, response) => {
    try {
      const userId = request.params.userId;
      const eventId = request.params.eventId;

      const { data } = await supabase.from("events").select("*").eq("userId", userId).eq("eventId", eventId);

      response.status(200).json({ data });

  } catch (error) {
      console.error('Error:', error.message);
      response.status(500).json({ error: 'Internal server error' });
  }
});

//todo: get event for a week


//post a event to frontend
thisRoute.post("/", async (request, response) => {
    const { userId, title, location, notes, category, startMonthYear, endMonthYear, startDOM, endDOM, startTime, endTime } = request.body;
  
    try {
        const { data } = await supabase.from("events").insert({
            userId: userId,
            title: title,
            location: location,
            notes: notes,
            category: category,
            startMonthyear: startMonthYear,
            endMonthyear: endMonthYear,
            startDayofmonth: startDOM,
            endDayofmonth: endDOM,
            startTime: startTime,
            endTime: endTime
    });

    response.json({ data });
    
} catch (error) {
    console.error('Error:', error.message);
    response.status(500).json({ error: 'Internal server error' });
}
});

//delete a specific event
thisRoute.delete("/:eventId", async (request, response) => {
    const eventId = request.params.eventId;

    try {
        
        const { data, error } = await supabase.from("events").delete().eq("eventId", eventId);
        data ? response.json({ data }) : response.status(404).json(error);

    } catch (error) {
        console.error('Error:', error.message);
        response.status(500).json({ error: 'Internal server error, unable to delete' });
    }
});

//edit a event
thisRoute.put("/:eventId", async (request, response) => {
    const { eventId, userId, title, location, notes, category, startMonthYear, endMonthYear, startDayOfMonth, endDayOfMonth, startTime, endTime } = request.body;
       
    try {
        const { data } = await supabase.from("events").update({
            userId: userId,
            title: title,
            location: location,
            notes: notes,
            category: category,
            startMonthYear: startMonthYear,
            endMonthYear: endMonthYear,
            startDayOfMonth: startDayOfMonth,
            endDayOfMonth: endDayOfMonth,
            startTime: startTime,
            endTime: endTime
        }).eq("eventId", eventId);

        response.status(200).json(data);

    } catch (error) {
        console.error('Error:', error.message);
        response.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = thisRoute;