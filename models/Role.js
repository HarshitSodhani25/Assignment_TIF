const  mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    _id:{
        type: String,
        required: true,
    },
    name: {
        type: String,
        unique: true,
        required: true,
        min: 2,
    },
    created_at:{
        type: Date,
        default: new Date,
    },
    updated_at:{
        type: Date,
        default: new Date,
    }
})

const role = mongoose.model('role', roleSchema);
module.exports = role

