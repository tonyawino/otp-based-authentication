const express = require('express');
const router = express.Router();

//Models
const UserObject = require('../models/User');

//SendOtp
let sendOtp = require('../helper/utils');

// Get OTP
router.post('/', (req, res, next) => {
  const {
    email, 
    phone, 
    validate
  } = req.body;

  //Cannot get OTP to an email or phone that is not registered
  //If validate using email
  if (validate==="email"){
    UserObject.findOne(
      {email:email}, 
      function(err, user){
          //If no user with the email exists
          if(!user)
              return res.status(400).json({success : false, message :"Account not yet registered"});
  
          sendOtp(validate, email, phone, res);
      }
    );
  }
  //If validate using phone
  else if (validate==="phone"){
    UserObject.findOne(
      {phone:phone}, 
      function(err, user){
          //If no user with the phone exists
          if(!user)
              return res.status(400).json({success : false, message :"Account not yet registered"});
  
          sendOtp(validate, email, phone, res);
      }
    );
  }
  else{
    return res.status(400).json({success : false, message :"Validation mechanism not provided"}); 
  }
  
});

module.exports = router;