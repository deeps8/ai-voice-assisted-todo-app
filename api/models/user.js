const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    uid: {type:String},
    username: {type: String,unique: true,required: true},
    password: {type: String, required: true},
    dateOfCreation: {type:Date,default:Date.now}
});

module.exports = mongoose.model('User',userSchema);