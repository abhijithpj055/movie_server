const mongoose=require('mongoose')

const ratingSchema=new mongoose.Schema(
    {
        user_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true,
        },
        movie_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"movie",
            required:true,
        },
        score:{
            type:Number,
            require:true,
            min:0,
            max:10
        }
    },
    {
        timestamps:{
            createdAt:true,updatedAt:false
        }
    }
)

const ratingModel=mongoose.model("rating",ratingSchema)
module.exports=ratingModel;