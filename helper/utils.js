const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Vonage = require('@vonage/server-sdk')
const UserObject = require('../models/User');

function getToken(payload){
    
}

function sendOtp(validate, email, phone, res){
    // Generate a OTP
    const num = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    const otp = num.toString();

    // Get hash and save to the database.
    bcrypt.hash(otp, 10).then((hash) => {
      let promise;
      //If validating using email, update using the email then send OTP via email
      if (validate==="email"){
        promise = UserObject.findOneAndUpdate({
          email
        }, {
          email: email,
          otp: hash
        }, {
          upsert: true
        });

        promise.then((data) => {
            // Send an e-mail. 
            let transporter = nodemailer.createTransport({
                host: process.env.NODEMAILER_HOST,
                auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS
                }
            });
            let mailOptions = {
                from: process.env.NODEMAILER_USER,
                to: email,
                subject: otp + ' is your one time password.',
                text: `Dear ${data.name}, your one time password is: ${otp}`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                res.status(500).json({
                    success: false,
                    message: "Something went wrong. Try again later."
                });
                return console.log(error);
                } else {
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
                console.log("otp:" + otp);
    
                // Prepare a token. 
                const payload = {
                    email
                };
                const token = jwt.sign(payload, process.env.TEMPORARILYTOKENKEY, {
                    expiresIn: 900 // This token expires 15 minutes later.  
                });
    
                // Send a response.
                res.status(200).json({
                    success: true,
                    message: "If your address is correct, you will receive an email!",
                    token: token,
                    //otp: otp
                    // The above line is added for the test. Uncomment it, when testing.
                });
    
            }
  
          });
        }).catch((err) => {
          console.log(err);
          res.status(500).json({
            success: false,
            message: "Something went wrong. Try again later."
          });
        });
      }
      //If validating using phone, update using phone, then send OTP via SMS
      else if (validate==="phone"){
        promise = UserObject.findOneAndUpdate({
          phone
        }, {
          phone: phone,
          otp: hash
        }, {
          upsert: true
        });

        promise.then(data=>{

            const vonage = new Vonage({
                apiKey: process.env.VONAGEKEY,
                apiSecret: process.env.VONAGESECRET
            });

            const from = "StdntWllt";
            const to = data.phone;
            const text =  `Dear ${data.name}, your one time password is: ${otp}`;

            vonage.message.sendSms(from, to, text, (err, responseData) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        message: "Something went wrong. Try again later."
                      });
                } 
                else {
                    if(responseData.messages[0]['status'] === "0") {
                        console.log("Message sent successfully.");
                         // Prepare a token. 
                        const payload = {
                            email:data.email
                        };
                        const token = jwt.sign(payload, process.env.TEMPORARILYTOKENKEY, {
                            expiresIn: 900 // This token expires 15 minutes later.  
                        });

                        console.log("otp:" + otp);

                        // Send a response.
                        res.status(200).json({
                            success: true,
                            message: "If your address is correct, you will receive an email!",
                            token: token,
                            //otp: otp
                            // The above line is added for the test. Uncomment it, when testing.
                        });
                    } 
                    else {
                        console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                        res.status(500).json({
                            success: false,
                            message: "Something went wrong. Try again later."
                          });
                    }
                }
            })

        }).catch(err=>{
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Something went wrong. Try again later."
              });
        });
      }
      else{
        res.status(500).json({
          success: false, 
          message: "Validate not provided"
        });
      }

    });
  }

  module.exports=sendOtp;