const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minLength:[8,"Password must be atleast 8 characters"]
    },
    profile_pic:{
        type:String,
        trim:true
    },
    gender:{
        type:String,
        trim:true,
    },
    role:{
        type:String,
        required:true,
        enum:["admin","user"],
        default:"user"
    },
    status:{
        type:String,
        required:[true,"Status is required"],
        enum:["active","inactive"],
        default:"active"
    }
},{
    timestamps:true
})

const userModel=mongoose.model("user",userSchema)
module.exports=userModel