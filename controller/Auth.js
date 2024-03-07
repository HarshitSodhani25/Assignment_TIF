const user = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {Snowflake} = require("@theinternetfolks/snowflake")

const signUp = async (req, res) => {
    const {name, email, password} = req.body;
    try {
        //check if user already exist
        const isExist = await user.find({email: email});
        if(isExist.length > 0){
            throw {"message": "User already exist, try to login"}
        }

        //generate the snokflake id
        const id = Snowflake.generate();

        //hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        //create the entry in the database
        const User = new user({_id: id, name: name, email: email, password: hashPassword});
        await User.save();

        //generate the token
        const token = await jwt.sign({id: User._id}, process.env.SECRET_KEY);

        res.status(201).json({"status": true, "content":{data: {"id": User._id, "name": User.name, "email": User.email, "created_at": User.created_at}, "meta": {"access-token": token}}})

    } catch (error) {
        res.status(400).json({"status": false, "error": error.message});
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        //check if that email exist or not
        let isExist = await user.find({email: email});
        if(isExist.length == 0){
            throw {"message": "Invalid Credentials"};
        }
        isExist = isExist[0];

        //check if password match
        const isMatch = bcrypt.compare(password, isExist.password);
        if(!isMatch){
            throw {"message": "Invalid Credentials"}
        }

        //now generate the token
        const token = await jwt.sign({id: isExist._id}, process.env.SECRET_KEY);
        res.status(200).json({"status": true, "content":{data: {"id": isExist._id, "name": isExist.name, "email": isExist.email, "created_at": isExist.created_at}, "meta": {"access-token": token}}})
 
    } catch (error) {
        res.status(400).json({"status": false, "error": error.message});
    }
}

const getMyDetail = async (req, res) =>{
    const id = req.user.id;
    try {
        const data = await user.findById(id).select('name email created_at');
        if(data.length == 0){
            throw {"message": "Invalid request"};
        }
        data['id'] = id
        res.status(200).json({"status": true, "content": {data}})
    } catch (error) {
        res.status(400).json({"status": false, "error": error.message});
    }
}


module.exports = {signUp, login, getMyDetail}