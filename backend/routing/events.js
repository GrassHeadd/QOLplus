const thisRoute = require("express").Router();
const DateUtils = require("../utils/date.js");

const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://rmjcnufjtkakbcocvglf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
require('datejs');

//get the events in a month
thisRoute.get("/:userId/month/:date", async (request, response) => {
    const userId = request.params.userId;
    const inputDate = request.params.date;
    const fromDateStr = DateUtils.getDateAtMonthStart(inputDate);
    const toDateStr = DateUtils.getDateAtMonthEnd(inputDate);

    await supabase.from("events").select("*").eq("userId", userId).or(
        `and(startDate.gte.${fromDateStr}, startDate.lte.${toDateStr}),` +
        `and(endDate.gte.${fromDateStr}, endDate.lte.${toDateStr}),` +
        `and(startDate.lt.${fromDateStr}, endDate.gt.${toDateStr})`
    ).then(queryResponse => {
        if (queryResponse.error) {
            response.status(500).json({ "error": queryResponse.error.message });
            return;
        }
        response.status(200).json({ "data": queryResponse.data });
    });
});

thisRoute.get("/:userId/week/:date", async (request, response) => {
    const userId = request.params.userId;
    const inputDate = request.params.date;
    const fromDateStr = DateUtils.getStartOfWeek(inputDate);
    const toDateStr = DateUtils.getEndOfWeek(inputDate);

    await supabase.from("events").select("*").eq("userId", userId).or(
        `and(startDate.gte.${fromDateStr}, startDate.lte.${toDateStr}),` +
        `and(endDate.gte.${fromDateStr}, endDate.lte.${toDateStr}),` +
        `and(startDate.lt.${fromDateStr}, endDate.gt.${toDateStr})`
    ).then(queryResponse => {
        if (queryResponse.error) {
            response.status(500).json({ "error": queryResponse.error.message });
            return;
        }
        response.status(200).json({ "data": queryResponse.data });
    });
});

thisRoute.get("/:userId/date/:date", async (request, response) => {
    const userId = request.params.userId;
    const inputDate = request.params.date;
    const dateStr = DateUtils.getFormattedDateStr(inputDate);

    await supabase.from('events').select().eq('userId', userId).or(
        `startDate.eq.${dateStr},` +
        `endDate.eq.${dateStr},` +
        `and(startDate.lt.${dateStr}, endDate.gt.${dateStr})`
    ).then(queryResponse => {
        if (queryResponse.error) {
            response.status(500).json({ "error": queryResponse.error.message });
            return;
        }
        response.status(200).json({ "data": queryResponse.data });
    });
});

//get one specific event
thisRoute.get("/:userId/:eventId", async (request, response) => {
    const userId = request.params.userId;
    const eventId = request.params.eventId;

    await supabase.from("events").select("*").eq("userId", userId).eq("eventId", eventId)
    .then(queryResponse => {
        if (queryResponse.error) {
            response.status(500).json({ "error": queryResponse.error.message });
            return;
        }
        response.status(200).json({ "data": queryResponse.data });
    });
});

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
            response.status(500).json({ "error": queryResponse.error.message });
        } else {
            response.status(200).json({ "data": "Event added successfully" });
        }
    });
});

//delete a specific event
thisRoute.delete("/:eventId", async (request, response) => {
    const eventId = request.params.eventId;
    await supabase.from("events").select("*").eq("eventId", eventId)
    .then(async (queryResponse) => {
        // Check if the record exists first
        if (queryResponse.error) {
            response.status(500).json({ "error": queryResponse.error.message });
            return;
        }
        if (queryResponse.data.length === 0) {
            response.status(500).json({ "error": "Event does not exist" });
            return;
        }

        await supabase.from("events").delete().eq("eventId", eventId)
        .then(queryResponse2 => {
            // Should not have any errors even when no record found
            if (queryResponse2.error) {
                response.status(500).json({ "error": queryResponse2.error.message });
            } else {
                response.status(200).json({ "data": "Event deleted successfully" });
            }
        });
    });
});

//edit a event
thisRoute.put("/:eventId", async (request, response) => {
    const eventId = request.params.eventId;

    const {
        userId,
        title,
        location,
        notes,
        category,
        startDate,
        endDate,
        startTime,
        endTime
    } = request.body;

    await supabase.from("events").select("*").eq("eventId", eventId)
    .then(async (queryResponse) => {
        if (queryResponse.error) {
            response.status(500).json({ "error": queryResponse.error.message });
            return;
        }
        if (queryResponse.data.length === 0) {
            response.status(500).json({ "error": "Event does not exist" });
            return;
        }

        await supabase.from("events").update({
            userId: userId,
            title: title,
            location: location,
            notes: notes,
            category: category,
            startDate: startDate,
            endDate: endDate,
            startTime: startTime,
            endTime: endTime
        }).eq("eventId", eventId)
        .then(queryResponse2 => {
            if (queryResponse2.error) {
                response.status(500).json({ "error": queryResponse2.error.message });
            } else {
                response.status(200).json({ "data": queryResponse2.data });
            }
        });
    });
});

module.exports = thisRoute;