const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    tid: {type:String},
    title: {type: String, required: true},
    done:{type:Boolean, default:false},
    category:{type:String, required:true},
    user: {
        username:{type:String},
        uid:{type:String}
    },
    dateOfCreation: {type:Date,default:Date.now}
});

module.exports = mongoose.model('Task',userSchema);