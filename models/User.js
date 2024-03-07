const  mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id:{
        type: String,
        required: true,
    },
    name: {
        type: String,

    },
    email:{
        type: String,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    created_at:{
        type: Date,
        default: new Date,
    },
    deleted_at:{
        type: Date
    }
})

const user = mongoose.model('user', userSchema);
module.exports = user
