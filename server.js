import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/flysucks", (req, res)=>{
  console.log("get a girlfriend you stinky loser nerd");
  const {rr} = req.body
  console.log(req.body);
  if (rr == "skibidi") {
   res.json({ kaicenat : "ohio rizz gyatt fanum tax"});
  } else {
    res.json({ kaicenat : "among us edging gooning let him cook"});
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
