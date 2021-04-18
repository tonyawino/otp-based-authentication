const mongoose = require('mongoose');

module.exports = () => {
    const url = 'mongodb://localhost:27017';
    const dbName= 'student-wallet';
    mongoose.connect(`${url}/${dbName}`, {useNewUrlParser:true});
    mongoose.connection.on('open', () => {
        console.log('MongoDb: Connected');
    });
    mongoose.connection.on('error', (err) => {
        console.log('MongoDb: Error', err);
    });
    mongoose.Promise=global.Promise;
};