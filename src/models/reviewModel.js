const mongoose=require('mongoose')

const reviewSchema=new mongoose.Schema(
    {
        user_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true,
        },
        movie_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"movie",
            required:true
        },
        content:{
            type:String,
            required:true
        }
    },
    {
        timestamps:{
            createdAt:true,updatedAt:false
        }
    }
)

const reviewModel=mongoose.model("review",reviewSchema);

module.exports=reviewModel