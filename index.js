const express = require("express");
const path = require("path")
const cookieParser = require("cookie-parser")
const { connectToMongoDB } = require("./connect");
const {restrictToLoggedinUserOnly,checkAuth} = require("./middlewares/auth")
const { deleteUser } = require("./services/auth");
const URL = require("./models/url");
const shortid = require("shortid");

//Routes
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRoute")
const userRoute = require("./routes/user")

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url")
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser())

app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

app.use("/url",restrictToLoggedinUserOnly ,urlRoute);
app.use("/user", userRoute);  
app.use("/",checkAuth, staticRoute);



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

app.get("/logout", (req, res) => {
  const sessionId = req.cookies.uid;
  
  if (sessionId) {
    deleteUser(sessionId); //  remove session from your store
  }
  
  res.clearCookie("uid");
  res.redirect("/");
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));