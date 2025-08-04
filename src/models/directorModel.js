const mongoose =require('mongoose')

const directorSchema=new mongoose.Schema({
    name:{
        type:String,
        reqired:true,
        trim:true,
    }
})

const directorModel=mongoose.model("director",directorSchema)
module.exports=directorModel;