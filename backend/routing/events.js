const thisRoute = require("express").Router();

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
        const fromDate = new Date(inputDate), endDate = new Date(inputDate);
        fromDate.setDate(1);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);
        const fromDateStr = fromDate.getFullYear() + "-" + (fromDate.getMonth() + 1) + "-" + (fromDate.getDate());
        const endDateStr = endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + (endDate.getDate());
        console.log(fromDateStr);
        console.log(endDateStr);

        const { data:data } = await supabase.from("events").select("*").eq("userId", userId).gte("startDate", fromDateStr).lte("startDate", endDateStr).or();
        const { data:data2 } = await supabase.from("events").select("*").eq("userId", userId).gte("endDate", fromDateStr).lte("endDate", endDateStr);
        const { data:data3 } = await supabase.from("events").select("*").eq("userId", userId).lte("startDate", fromDateStr).gte("endDate", endDateStr);
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
        console.log("Input from frontend: " + inputDate);
        const fromDate = getStartOfWeekFromDate(new Date(inputDate).toDateString());
        const toDate = getEndOfWeekFromDate(new Date(inputDate).toDateString());
        console.log("Start Date: " + fromDate, "End Date: " + toDate);

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

function getStartOfWeekFromDate(dateStr) {
    let StartWeekDate = Date.parse(dateStr);
    while(getDayFromDate(StartWeekDate) > 0) {
        StartWeekDate.addDays(-1);
    }

    let year = StartWeekDate.getFullYear();
    let month = StartWeekDate.getMonth()+1;
    let day = StartWeekDate.getDate()+1;    
    console.log("start date: " + year + "-" + month + "-" + day);
    console.log("done looping start week date");
    return year + "-" + month + "-" + day;      
}

function getEndOfWeekFromDate(dateStr) {
    let EndWeekDate = Date.parse(dateStr);
    while(getDayFromDate(EndWeekDate) < 6) {
        EndWeekDate.addDays(1);
    }
    let year = EndWeekDate.getFullYear();
    let month = EndWeekDate.getMonth()+1;
    let day = EndWeekDate.getDate()+1;  
    console.log("start date: " + year + "-" + month + "-" + day);
    console.log("done looping end week date");
    return year + "-" + month + "-" + day;   
}

function getDayFromDate(dateStr) {
    return Date.parse(dateStr).getDay(); //return 0-6
}

// function getMonthFromDate(dateStr) {
//     const Month = Date.parse(dateStr).getMonthFromDate();
//     return Month;
// }

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