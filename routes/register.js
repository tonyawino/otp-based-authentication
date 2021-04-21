const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const randomWords=require('random-words');

//Models
const UserObject = require('../models/User');
const User = require('../models/User');

//SendOtp
let sendOtp = require('../helper/utils');

// Register user and send OTP
router.post('/', (req, res, next) => {
    // taking a user
    const newuser=new UserObject(req.body);
    
    let recoveryCode="";
    randomWords(10).forEach((v)=>{
        recoveryCode+=` ${v}`;
    })
    recoveryCode=recoveryCode.trim();
    bcrypt.hash(recoveryCode, 10).then((hash)=>{
        console.log("Recovery code is "+recoveryCode);
        console.log("Hashed recovery code is "+hash);

        //Attach the recovery code to the user
        newuser.recovery=hash;
        User.findOne(
            {email:newuser.email},
            function(err,user){
                //If a user with the same email exists
                if(user)
                    return res.status(400).json({success : false, message:"A user exists with the provided email"});
    
                //If no phone is provided, save the user
                if (newuser.phone==null || newuser.phone.trim().length==0){
                    saveUser();
                }
                //if a phone is provided, confirm no user has it
                else{
                    User.findOne(
                        {phone:newuser.phone}, 
                        function(err, user){
                            //If a user with the same phone number exists
                            if(user)
                                return res.status(400).json({success : false, message :"A user exists with the provided phone number"});
    
                            //Phone is also unique, save user
                            saveUser();
                        }
                    );
                }
                
        });

    }).catch((err)=>{
        console.log(err);
        return res.status(400).json({success : false, message: "An error occurred: "+err.message});
    });
    

    function saveUser(){
        newuser.save((err,doc)=>{
            if(err) {console.log(err);
                return res.status(400).json({success : false, message: "An error occurred: "+err.message});}

            //Attach the recovery string to the response object 
            res.recovery=recoveryCode;
            sendOtp("email", newuser.email, newuser.phone, res);
        });
    }


});

module.exports = router;