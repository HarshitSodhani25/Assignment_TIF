const express = require("express");
const mongoose = require("mongoose");
const port = process.env.PORT;
const server = express();
require('dotenv').config();
const auth = require('./routes/Auth')
const member = require('./routes/Member')
const community = require('./routes/Community')
const role = require('./routes/Role')

const mongoConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('mongoose connected successfully');
    } catch (error) {
        console.log(error.message);
    }
}

//middleware
server.use(express.json());
server.use((req, res, next) => {
    console.log(req.url);
    next();
})
server.use('/v1/auth', auth);
server.use('/v1/role', role);
server.use('/v1/community', community);
server.use('/v1/member', member);

mongoConnect();

server.listen(port, ()=>console.log(`server is running on http://localhost:${port}`))