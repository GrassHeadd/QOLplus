const thisRoute = require("express").Router();

const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://rmjcnufjtkakbcocvglf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

thisRoute.get("/:userId/:month/:date", async (request, response) => {
  try {
    const userId = request.params.userId;
    const monthYear = request.params.monthYear;

    const { data, error } = await supabase.from("expenses").select("*").eq("userId", userId).lte("startMonthYear", monthYear).gte("endMonthYear", monthYear);

    if (error) { throw error; }
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

    const { data, error } = await supabase.from("expenses").select("*").eq("userId", userId);

    if (error) { throw error; }
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



//get a month's expense for a user
thisRoute.get("/:userId/month/:monthYear", async (request, response) => {
    try {
        const userId = request.params.userId;
        const monthYear = request.params.monthYear;

        const { data } = await supabase.from("expenses").select("*").eq("userId", userId).eq("monthYear", monthYear);

        response.status(200).json({ data });

    } catch (error) {
        console.error('Error:', error.message);
        response.status(500).json({ error: 'Internal server error' });
    }
});


