const role = require('../models/Role');
const {Snowflake} = require('@theinternetfolks/snowflake')

const getRoles = async (req, res) => {
    try {
        let page = 1;
        const pageSize = 10;
        let skip = (page-1)*pageSize; 
        const data = await role.find().skip(skip).limit(pageSize);
        let pages = Math.ceil(data.length/10);
        res.status(200).json({"status": true, "content": {"meta": {"total": data.length, "pages": pages, "page": page}, "data": data }})
    } catch (error) {
        res.status(400).json({"status": false, "message": error.message});
    }
} 

const createRole = async (req, res) => {
    try {
        let {name} = req.body;

        // check if name exist
        const isExist = await role.findOne({name: name});
        if(isExist){
            throw {"message": "Role already exist"};
        }

        //generate the snokflake id
        const id = Snowflake.generate();

        const data = new role({_id: id, name: name});
        await data.save();
        res.status(201).json({"status": true, "content": { "data": data}})


    } catch (error) {
        res.status(400).json({"status": false, "message": error.message});
    }
}

module.exports = {getRoles, createRole};
