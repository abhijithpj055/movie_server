const express=require("express")
const app=express()
const mongoose=require('mongoose')
const cors = require('cors');
const cookieParser=require('cookie-parser')
require('dotenv').config()
const userRouter=require("./src/routes/userRouter.js")
const movieRouter=require("./src/routes/movieRoutes.js")
const reviewRouter=require("./src/routes/reviewRouter.js")
const commentRouter = require('./src/routes/commentRouter.js')
const ratingRoutes = require('./src/routes/ratingRoutes.js')
const actorRoutes = require('./src/routes/actorRoutes.js');
const directorRoutes = require('./src/routes/directorRouter.js');
const languageRoutes = require('./src/routes/languageRoutes.js');
const uploadRoutes = require('./src/routes/upload.js');

const dbConnectionLink=process.env.DB_CONNECTION_LINK

mongoose.connect(dbConnectionLink,{
      useNewUrlParser: true,
  useUnifiedTopology: true,

}).then(res=>{
    console.log("DB connected");
    
})
const port=process.env.PORT||3000
app.use(cors({
   
   origin: [
      "http://localhost:5173",       // local frontend
    process.env.CLIENT_URL,// deployed frontend
    ],
     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true 
}));
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/api",(req,res)=>{
    res.send("<h1>movies</h1>")
})

app.use("/api/user",userRouter)
app.use("/api/movies",movieRouter)
app.use('/api/reviews', reviewRouter);
app.use('/api/reviews/:reviewId/comments', commentRouter);
app.use('/api/movies', ratingRoutes);
app.use('/api/actors', actorRoutes);
app.use('/api/directors', directorRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api', uploadRoutes);



app.listen(port,()=>{
    console.log(`Server is running on PORT ${port}...`);
    
})