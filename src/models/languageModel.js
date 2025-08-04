const mongoose= require("mongoose")

const languageSchema=new mongoose.Schema(
    {
        language:{
            type:String,
            required:true,
            trim:true
        }
    }
)

const languageModel=mongoose.model("language",languageSchema)

module.exports=languageModel;