const mongoose=require("mongoose")


const actorSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    }
});

const actorModel=mongoose.model("actor",actorSchema);

module.exports=actorModel;