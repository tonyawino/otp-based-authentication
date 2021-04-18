const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Models
const UserObject = require('../models/User');
const User = require('../models/User');

//SendOtp
let sendOtp = require('../helper/utils');

// Register user and send OTP
router.post('/', (req, res, next) => {
    // taking a user
    const newuser=new UserObject(req.body);
    
    function saveUser(){
        newuser.save((err,doc)=>{
            if(err) {console.log(err);
                return res.status(400).json({success : false, message: "An error occurred: "+err.message});}
            sendOtp("email", newuser.email, newuser.phone, res);
        });
    }

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
});

module.exports = router;