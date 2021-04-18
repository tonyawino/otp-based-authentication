const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');

//Models
const UserObject = require('../models/User');

// Verify OTP and login.
router.post('/', (req, res, next) => {
  const {
    otp, recovery, validate
  } = req.body;
  const decoded_email = req.decoded_email;
  const promise = UserObject.findOne({
    email: decoded_email
  });
  promise.then((data) => {
    if (!data) {
      res.status(500).json({
        success: false,
        message: "Oops! We are sorry! Something went wrong!"
      });
    } 
    else {
      let promise;
      let newRecovery;
      //If logging in using OTP
      if (validate==="otp"){
        promise=bcrypt.compare(otp, data.otp);
      }
      //If logging in using recovery
      else if (validate==="recovery"){
        promise=bcrypt.compare(recovery, data.recovery);
        newRecovery = crypto.randomBytes(32).toString("hex");
      }
      else{
        return res.status(500).json({
          success: false,
          message: "Invalid validate type."
        });
      }
      promise.then((result) => {
        if (!result) {
          res.status(401).json({
            success: false,
            message: "Authentication failed. Wrong otp or recovery phrase!"
          });
        } 
        else {
          //If used the recovery code, generate ands save a new one
          if (validate==="recovery"){
            bcrypt.hash(newRecovery, 10).then((hash)=>{
              UserObject.findOneAndUpdate({
                email
              }, {
                email: data.email,
                recovery: hash
              }, {
                upsert: true
              });
            }).catch((err)=>{
                console.log(err);
            });
          }

          // Prepare a token.
          const payload = {
            email: decoded_email
          };
          const token = jwt.sign(payload, process.env.APISECRETKEY, {
            expiresIn: 86400 * 30 // This token expires 30 days later. 
          });
          res.status(200).json({
            success: true,
            message: `Welcome ${data.name}!`,
            token: token, 
            recovery: newRecovery,
            object: { "name":data.name, 
                      "email":data.email,
                      "phone":data.phone}
          });
        }
      }).catch((err) => {
        console.log(err);
        res.status(500).json({
          success: false,
          message: "Something went wrong. Try again later."
        });
      });
    }
  }).catch((err) => {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Try again later."
    });
  });
});

module.exports = router;