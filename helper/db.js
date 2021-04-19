const mongoose = require('mongoose');
//Config Files
require('dotenv').config();

module.exports = () => {
    const dbName= 'student-wallet';
    const user=process.env.MONGO_USER;
    const pass=process.env.MONGO_PASS;
    console.log("Username is "+user+" and password is "+pass);
    const url=`mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@cluster0.8tdwz.mongodb.net/${encodeURIComponent(dbName)}?retryWrites=true&w=majority`
    //const url = `mongodb://localhost:27017/${dbName}`;
    mongoose.connect(`${url}`, {useNewUrlParser:true});
    mongoose.connection.on('open', () => {
        console.log('MongoDb: Connected');
    });
    mongoose.connection.on('error', (err) => {
        console.log('MongoDb: Error', err);
    });
    mongoose.Promise=global.Promise;
};