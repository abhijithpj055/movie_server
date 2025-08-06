const express=require("express")
const app=express()
const mongoose=require('mongoose')
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
const dbConnectionLink=process.env.DB_CONNECTION_LINK

mongoose.connect(dbConnectionLink,{
      useNewUrlParser: true,
  useUnifiedTopology: true,

}).then(res=>{
    console.log("DB connected");
    
})
const port=process.env.PORT
app.use(cookieParser())
app.use(express.json())

app.get("/",(req,res)=>{
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


app.listen(port,()=>{
    console.log(`Server is running on PORT ${port}...`);
    
})