const thisRoute = require("express").Router();
const DateUtils = require("../utils/dateUtils.js");

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

    const { data } = await supabase.from("expenses").select("*").eq("userId", userId).gte("date", fromDateStr).lte("date", endDateStr)
    response.status(200).json({ data });
    
} catch (error) {
    console.error('Error:', error.message);
    response.status(500).json({ error: 'Internal server error' });
}
});

thisRoute.get("/:userId/:week/:date", async (request, response) => {
    try {
      const userId = request.params.userId;
      const inputDate = request.params.date;
      const fromDateStr = DateUtils.getEndOfWeek(inputDate);
      const endDateStr = DateUtils.getStartOfWeek(inputDate);
  
      const { data } = await supabase.from("expenses").select("*").eq("userId", userId).gte("date", fromDateStr).lte("date", endDateStr)
      response.status(200).json({ data });
      
  } catch (error) {
      console.error('Error:', error.message);
      response.status(500).json({ error: 'Internal server error' });
  }
  });

//get all expenses for a user
thisRoute.get("/:userId", async (request, response) => {
  try {
    const userId = request.params.userId;

    const { data } = await supabase.from("expenses").select("*").eq("userId", userId);

    response.status(200).json({ data });

} catch (error) {
    console.error('Error:', error.message);
    response.status(500).json({ error: 'Internal server error' });
}
});

//get a specific expense
thisRoute.get("/:userId/:expenseId", async (request, response) => {
    try {
        const userId = request.params.userId;
        const expenseId = request.params.expenseId;

        const { data } = await supabase.from("expenses").select("*").eq("userId", userId).eq("expenseId", expenseId);

        response.status(200).json({ data });

    } catch (error) {
        console.error('Error:', error.message);
        response.status(500).json({ error: 'Internal server error' });
}});

thisRoute.post("/", async (request, response) => {
    const { userId, 
        expenseName, 
        amount, 
        category, 
        date
        } = request.body;
  
    try {
        const { data } = await supabase.from("expenses").insert({
            userId: userId,
            expenseName: expenseName,
            amount: amount,
            category: category,
            date: date
    });

    response.status(200).json({ data });
    
} catch (error) {
    console.error('Error:', error.message);
    response.status(500).json({ error: 'Internal server error' });
}
});

//delete a specific event
thisRoute.delete("/:expenseId", async (request, response) => {
    const expenseId = request.params.expenseId;

    try {
        
        const { data } = await supabase.from("expenses").delete().eq("expenseId", expenseId);
        console.log(data);
        response.status(200).json({ data });

    } catch (error) {
        console.error('Error:', error.message);
        response.status(500).json({ error: 'Internal server error, unable to delete' });
    }
});

thisRoute.put("/:expenseId", async (request, response) => {
    const { userId, 
            expenseName, 
            amount, 
            category, 
            date
        } = request.body;

    const expenseId = request.params.expenseId;
  
    try {
        const { data } = await supabase.from("expenses").update({
            userId: userId,
            expenseName: expenseName,
            amount: amount,
            category: category,
            date: date
    }).eq("expenseId", expenseId).select("*");

    if (!data || data.length === 0) {
        return response.status(404).json({ error: "Expense not found" });
      } else {
        return response.status(200).json({ data });
      }
    
} catch (error) {
    console.error('Error:', error.message);
    response.status(500).json({ error: 'Internal server error' });
}
});


module.exports = thisRoute;
