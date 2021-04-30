const mongoose=require('mongoose');


//define schema
const userSchema=mongoose.Schema({
       name:{type:String,required:true},
       imagePath:{type:String,required:true},
       contactNumber:{type:Number,required:true},
       email:{type:String,required:true},
       address:{type:String,required:true}
       },{timestamps:true});



module.exports =mongoose.model('users',userSchema);