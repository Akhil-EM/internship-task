const express=require('express');
const multer=require('multer');
const fs = require("fs")

const router=express.Router();

//storage path
const fileStorageEngine=multer.diskStorage({
  destination:(req,file,cb)=>{
      cb(null,'./images/')
  },
  filename:(req,file,cb)=>{
      cb(null,Date.now()+"--"+file.originalname)
  }
});
const upload=multer({storage:fileStorageEngine})


//models
const userModel=require('../models/user.model');


//routers
router.post('/register',upload.single('image'),(req,res)=>{
    
    console.log( req.body.name)
    let filePath=`${req.protocol}://${req.hostname}:4040/${req.file.path}`;
    let name=req.body.name;
    let contactNumber=req.body.contactNumber;
    let email=req.body.email;
    let addressline=req.body.address;
   
    //check for errors
    var formHasError=false;
    var Errors=[];

       if(name.trim().length == 0){
           formHasError=true;
           Errors.push({field:"name",error:"name can't be empty"})
       }

       if( contactNumber.trim().length != 10){
            formHasError=true;
            Errors.push({field:"contactNumber",error:"invalid phonenumber"})
        }
       
       
        if(!emailValidator(email.trim())){
                formHasError=true;
                Errors.push({field:"email",error:"invalid email"})
        }

       if(addressline.trim().length==0){
            formHasError=true;
            Errors.push({field:"address",error:"address can't be empty"})
       }

         if(formHasError){
              //form has error so delete uploaded image
              const pathToFile = "./"+req.file.path;
              fs.unlink(pathToFile, function(err) {
                if (err) {
                   console.log(err)
                } else {
                   res.json({status:'success',message:{errors:Errors}})
                }
              });
              
        }else{
           let userObj={
               name:name,
               imagePath:filePath,
               contactNumber:contactNumber,
               email:email,
               address:addressline
           }

           let user_model=new userModel(userObj)
           
           user_model.save()
                     .then((obj)=>res.json({status:'success',message:'created new user successfully'}))
                     .catch((err)=>res.json({status:'error',message:'server error'}))
                     //res.json({status:'error',message:'server error'}))
        }
    
})

router.get('/fetch-all',(req,res)=>{
    userModel.find({})
             .then((_users)=>{
                 if(_users==null) return res.json({status:'error',message:'no users found'});

                 res.json({status:'success',message:{users:_users}})
             })
             .catch((err)=>res.json({status:'error',message:'server error'}))
});

router.patch('/edit',(req,res)=>{
    let id=req.body.id;
    let test_name=req.body.name;
    let test_contactNumber=req.body.contactNumber;
    let test_email=req.body.email;
    let test_addressline=req.body.address;

    let userObj={
        name:test_name,
        contactNumber:test_contactNumber,
        email:test_email,
        address:test_addressline}

    
    userModel.findByIdAndUpdate(id,userObj,{new:true})
            .then((_user)=>{
                if(_user==null) return res.json({status:'error',message:'user having that id not  found'});

                res.json({status:'success',message:{user:_user}})
            })
            .catch((err)=> res.json({status:'error',message:'server error'}))
           ///

})









router.delete('/delete',(req,res)=>{
    id=req.body.id;
    userModel.findByIdAndDelete(id)
            .then((_user)=>{
                if(_user==null) return res.json({status:'error',message:'this user not  found'});

                res.json({status:'success',message:"deleted user successfully"})
            })
            .catch((err)=>res.json({status:'error',message:'server error'}))
})
      
    
    

        
 
      
    
   
       





function emailValidator(email){
    let regex=/\S+@\S+\.\S+/
    if (regex.test(email))
    {
      return (true)
    }
      return (false)

}


module.exports=router;