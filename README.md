# OTP Based Authentication

<img src="https://www.guarana-technologies.com/wp-content/uploads/2017/08/node-js-web-app-development.png" width="150" height="150"/><img src="https://cdn-images-1.medium.com/max/800/1*yB8AVO2xadCGmsyTtx0sag.png" width="150" height="150"/><br>

This RESTful api provides OTP based authentication. It is written in Node.js. MongoDB was used as the database. Node.js and MongoDB must be installed to the operation system before "git clone".

# Settings
1-) Install all dependencies with "npm install" command. <p>
2-a) Open ".env" file in the project folder for edit. It should be two different api key in ".env" file to sign JWT: First one APISECRETKEY, second one TEMPORARILYTOKENKEY. Because there are two types of jwt in this api for security. The jwt which is signed with TEMPORARILYTOKENKEY is expires in 15 minutes. This jwt must be used only for confirm OTP. And the jwt which is signed with APISECRETKEY is expires in 30 days. This jwt must be used for validate all endpoint under /api/... <br>
2-b) Mail service settings should  be in the ".env" file too. There are three variables for that: <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1-) NODEMAILER_HOST variable is for mail service smtp info. For example: "NODEMAILER_HOST = smtp-mail.outlook.com". <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2-) NODEMAILER_USER variable is for sender email address. For example "NODEMAILER_USER = johndoe@hotmail.com". <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 3-) NODEMAILER_PASS variable is for sender email password. <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Briefly ".env" file should look like this: <p> 
<i>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NODEMAILER_HOST = smtp-mail.outlook.com
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NODEMAILER_USER = johndoe@hotmail.com
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NODEMAILER_PASS = FoobarPassword
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;APISECRETKEY = LoremIpsum
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TEMPORARILYTOKENKEY = DolorSitAmet
</i>
2-c) Vonage SMS Service settings should be in the ".env" file too. These are two variables for: <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1-) VONAGEKEY variable from the Vonage website e.g. "VONAGEKEY=1cb9wam6"
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2-) VONAGESECRET variable from the Vonage website e.g. "VONAGESECRET=MpaveqKD9AqDHaPb".

<p>3- "/helper/db.js" file should be edited to connect to the MongoDB database. In case of working on the localhost, just open the db.js file and edit "databasename". But if it's wanted to work on a server like "mongolab", change "<i>mongodb://localhost/databasename</i>" with server database connection settings. For example: "<i>mongodb://db_user_name:db_user_password@db.mlab.com:port_number/databasename</i>". 

# Routes-Endpoints
| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /getotp | `POST` | {email:'dolorsit@amet.com', phone:'254712345678', validate:'phone'} | Sends an otp to users' email or phone and response a token in a json. The validate field takes either 'phone' or 'email' and the corresponding field has to be present. This token should be sent back with otp to "/login" and "/api/logout" endpoint.|
| /login | `POST` | { otp:'loremipsum', recovery:'adghaghdahdvhdadhvh', validate:'otp', token:'BdahvdhavBbdjahaj' }  | Login with either the OTP or Recovery Code. The validate field takes either 'otp' or 'recovery', and the associated field has to be present. Generates a 30 days token.|
| /api/logout | `POST` | {token:'adacuyejwbbc'} | Invalidates token. |
| /register | `POST` | {name:'User's Name', email:'email@email.com', phone: '254712345678', validate: 'email'} | Registers a new user and returns a response with the user object, a recovery code, and token. An OTP will be sent to either the email or phone depending on the parameter passed to the validate field |

# Usage
1- As understood, only "/getotp" and "/register" endpoints do not require tokens. Rest of routes needs token. All tokens can be sent with "x-access-token" key in the header or with "token" key in the post body. If some endpoint under "/api/..." route will be used in the future with GET method, tokens can be sent with "token" key-parameter in the GET query. Api will work. This REST api accepts token in every way but prefered way is sending token with header. <br>
2- All responses include a json like "{success: true/false, message: "Some info"}"
3- "/register" response includes a json like "{success: true/false, message: "Some info", recovery:"recoverycode", object:{name:"User's name", email:"email@email.com", phone:"254712345678"}}"

# Test
There is a test line that was added in the "/getotp" route. Don't forget to uncomment it before test. Also don't forget the comment it again after the test is finished. This is really important. Attention!! <i>If you forget to comment it again, you have given the OTP directly to the user in the response body. This creates a very serious security vulnerability.</i>
<p>Enjoy!
