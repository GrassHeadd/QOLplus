const thisRoute = require("express").Router();
const DateUtils = require("../utils/dateUtils.js");

const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://rmjcnufjtkakbcocvglf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
require('datejs');

//get the events in a month
thisRoute.get("/:userId/month/:date", async (request, response) => {
    try {
        const userId = request.params.userId;
        const inputDate = request.params.date;
        const fromDateStr = DateUtils.getDateAtMonthStart(inputDate);
        const endDateStr = DateUtils.getDateAtMonthEnd(inputDate);

        const { data:data } = await supabase.from("events").select("*").eq("userId", userId).gte("startDate", fromDateStr).lte("startDate", endDateStr);
        const { data:data2 } = await supabase.from("events").select("*").eq("userId", userId).gte("endDate", fromDateStr).lte("endDate", endDateStr);
        const { data:data3 } = await supabase.from("events").select("*").eq("userId", userId).lte("startDate", fromDateStr).gte("endDate", endDateStr);
        console.log(data);
        response.status(200).json({ data, data2, data3 });
    } catch (error) {
        console.error('Error:', error.message);
        response.status(500).json({ error: 'Internal server error' });
    }
});

thisRoute.get("/:userId/week/:date", async (request, response) => {
    try {
        const userId = request.params.userId;
        const inputDate = request.params.date;
        const fromDate = DateUtils.getStartOfWeek(new Date(inputDate).toDateString());
        const toDate = DateUtils.getEndOfWeek(new Date(inputDate).toDateString());

        // Event starts within range and ends within range - eventEnd >= from && eventEnd <= to
        // Event starts within range and ends within after range - eventEnd >= from && eventEnd >= to
        // Event starts before range and ends within range - eventEnd <= from && eventEnd <= to
        // Event starts before range and ends after range - eventStart <= from && eventEnd >= to

        const { data:data } = await supabase.from("events").select("*").eq("userId", userId).gte("startDate", fromDate).lte("startDate", toDate);
        const { data:data2 } = await supabase.from("events").select("*").eq("userId", userId).gte("endDate", fromDate).lte("endDate", toDate);
        const { data:data3 } = await supabase.from("events").select("*").eq("userId", userId).lte("startDate", fromDate).gte("endDate", toDate);

        response.status(200).json({ data, data2, data3 });
    } catch (error) {
        console.error('Error:', error.message);
        response.status(500).json({ error: 'Internal server error' });
    }
});

// Get one single event
// thisRoute.get("/:userId/day/:eventId", async (request, response) => {
//     try {
//         const userId = request.params.userId;
//         const monthYear = request.params.monthYear;

//         const { data } = await supabase.from("events").select("*").eq("userId", userId).lte("startMonthYear", monthYear).gte("endMonthYear", monthYear);
//         response.status(200).json({ data });
//     } catch (error) {
//         console.error('Error:', error.message);
//         response.status(500).json({ error: 'Internal server error' });
//     }
// });

//get one specific event
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

// Date format: YYYY-MM-DD, Time Format: HH:MM[:SS:MS] (no need for leading 0s)
// new Date().toLocaleDateString() --> '2/15/2025 (mm/dd/yyyy)'
function jsDateToPostgresDate(dateStr) {
    console.log(dateStr);
    return dateStr.split("-")[2] + ":" + dateStr.split("-")[0] + ":" + dateStr.split("-")[1];   
}

// Date format: YYYY-MM-DD, Time Format: HH:MM[:SS:MS] (no need for leading 0s)
// new Date().toTimeString() --> '16:17:05 GMT+0800 (Singapore Standard Time)'
function jsDateToPostgresTime(dateStr) {
    return dateStr.split(":")[0] + ":" + dateStr.split(":")[1];
}

//get a specific event
// thisRoute.get("/:userId/:eventId", async (request, response) => {
//     try {
//       const userId = request.params.userId;
//       const eventId = request.params.eventId;

//       const { data } = await supabase.from("events").select("*").eq("userId", userId).eq("eventId", eventId);

//       response.status(200).json({ data });

//   } catch (error) {
//       console.error('Error:', error.message);
//       response.status(500).json({ error: 'Internal server error' });
//   }
// });

//post a event
thisRoute.post("/", async (request, response) => {
    const { userId, title, location, notes, category, startDate, endDate, startTime, endTime } = request.body;
  
    await supabase.from("events").insert({
        userId: userId,
        title: title,
        location: location,
        notes: notes,
        category: category,
        startDate: startDate,
        endDate: endDate,
        startTime: parseInt(startTime),
        endTime: parseInt(endTime)
    }).then(queryResponse => {
        if (queryResponse.error) {
            response.status(500).json({ error: queryResponse.error.message });
        } else {
            response.status(200).json({ message: "Event added successfully" });
        }
    });
});

//delete a specific event
thisRoute.delete("/:eventId", async (request, response) => {
    const eventId = request.params.eventId;
    await supabase.from("events").delete().eq("eventId", eventId).then(queryResponse => {
        if (queryResponse.error) {
            response.status(500).json({ error: queryResponse.error.message });
        } else {
            response.status(200).json({ message: "Event deleted successfully" });
        }
    });
});

//edit a event
thisRoute.put("/:eventId", async (request, response) => {
    const { eventId, 
            userId, 
            title, 
            location, 
            notes, 
            category, 
            startMonthYear, 
            endMonthYear, 
            startDayOfMonth, 
            endDayOfMonth, 
            startTime, 
            endTime 
        } = request.body;
       
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