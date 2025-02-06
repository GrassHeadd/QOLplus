const thisRoute = require("express").Router();

const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://rmjcnufjtkakbcocvglf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

thisRoute.get("/:userId/:monthyear", async (request, response) => {
    try {
      const userId = request.params.userId;
      const monthyear = request.params.monthyear;

      const { data, error } = await supabase.from("events").select("*").eq("user_id", userId).lte("start_monthyear", monthyear).gte("end_monthyear", monthyear);

      if (error) { throw error; }
      response.status(200).json({ data });
  } catch (error) {
      console.error('Error:', error.message);
      response.status(500).json({ error: 'Internal server error' });
  }
});

thisRoute.post("/", async (request, response) => {
    const { userId, title, location, notes, category, startMonthYear, endMonthYear, startDOM, endDOM, startTime, endTime } = request.body;

    console.log(request.body);
    // if (category == null) category = "Others";
  
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

thisRoute.delete("/:eventId", async (request, response) => {
    const eventId = request.params.eventId;

    try {
        const { data, error } = await supabase.from("events").delete().eq("event_id", eventId);
        data ? response.json({ data }) : response.status(404).json(error);
    } catch (error) {
        console.error('Error:', error.message);
        response.status(500).json({ error: 'Internal server error, unable to delete' });
    }
});

thisRoute.put("/:eventId", async (request, response) => {
    const { event_id, userId, title, location, notes, category, start_monthyear, end_monthyear, start_dayofmonth, end_dayofmonth, start_time, end_time } = request.body;
       
    try {
        const { data, error } = await supabase.from("events").update({
            userId: userId,
            title: title,
            location: location,
            notes: notes,
            category: category,
            start_monthyear: start_monthyear,
            end_monthyear: end_monthyear,
            start_dayofmonth: start_dayofmonth,
            end_dayofmonth: end_dayofmonth,
            start_time: start_time,
            end_time: end_time
        }).eq("event_id", event_id);

        if (error) throw error;
        response.status(200).json(data);

    } catch (error) {
        console.error('Error:', error.message);
        response.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = thisRoute;