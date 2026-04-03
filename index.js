const express = require("express");
const path = require("path")
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const staticRoute = require("./routes/staticRoute")
const shortid = require("shortid");

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url")
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set("view engine","ejs")
app.set("views",path.resolve("./views"))
app.use("/url", urlRoute);
app.use("/", staticRoute);

app.get("/test",async (req,res)=>{
  const allUrls = await URL.find({})
  return res.render('home', { urls: allUrls })
})

//dynamic route
app.get('/url/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );
  
  if (!entry) return res.status(404).json({ error: "Short URL not found" });
  
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));