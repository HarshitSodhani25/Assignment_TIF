const  mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    _id:{
        type: String,
        required: true,
    },
    community:{
        type: String,
        ref: "community",
    },
    user:{
        type: String,
        ref: "user",
    },
    role:{
        type: String,
        ref: "role",
    },
    created_at:{
        type: Date,
        default: new Date,
    }
})

const member = mongoose.model('member', memberSchema);
module.exports = member;
