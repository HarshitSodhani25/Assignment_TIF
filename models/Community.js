const  mongoose = require('mongoose');
var URLSlug = require("mongoose-slug-generator");

mongoose.plugin(URLSlug);

const communitySchema = new mongoose.Schema({
    _id:{
        type: String,
        required: true,
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    slug:{
        type: String,
        slug: "name"
    },
    owner:{
        type: String,
        ref: "user",
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

communitySchema.pre("save", function(next) {
    this.slug = this.name.split(" ").join("-");
    next();
  });

const community = mongoose.model('community', communitySchema);
module.exports = community;
