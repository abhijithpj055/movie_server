const mongoose=require ("mongoose")


const movieSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:[true,"Title is required"],
            trim:true,
        },
        image:{
            type:String,
            trim:true,
        },
        description:{
            type:String,
            required:[true,"Description is required"],
        },
        release_date:{
            type:Date,
            required:[true,"Release date is reqired"]
        },
    },
    {
        timestamps:true
    }
)


const movieModel=mongoose.model("movie",movieSchema)
module.exports=movieModel
