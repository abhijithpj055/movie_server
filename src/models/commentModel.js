const mongoose=require("mongoose")

const commentSchema=new mongoose.Schema(
    {
        review_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"review",
            required:true,
        },
        user_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true,
        },
        content:{
            type:String,
            required:true,
        }
    },
    {
        timestamps:{createdAt:true,updatedAt:false}
    }
)

const commentModel =mongoose.model("comment",commentSchema)

module.exports=commentModel