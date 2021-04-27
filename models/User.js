const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {type:String, unique:true, required:true},
    name: {type:String, required:true},
    phone: {type:String},
    otp: {type:String},
    recovery: {type:String},
    createdAt:{ type: Date, default: Date.now }
});
module.exports = mongoose.model('user', UserSchema);