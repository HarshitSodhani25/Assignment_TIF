const community = require('../models/Community');
const member = require('../models/Member');
const {Snowflake} = require('@theinternetfolks/snowflake')

const createCommunity = async (req, res) => {
    const {name} = req.body;
    try {
        const owner = req.user.id;

        //generate the snokflake id
        const id = Snowflake.generate();

        let data = new community({_id: id, name: name, owner: owner});
        await data.save();
        res.status(201).json({"status": true, "content": {"data": data}});
    } catch (error) {
        res.status(400).json({"status": false, "message": error.message});
    }
}

const getAllCommunity = async (req, res) => {
    try {
        let page = 1;
        const pageSize = 10;
        let skip = (page-1)*pageSize; 
        const data = await community.find().populate('owner', 'name').skip(skip).limit(pageSize).exec();
        let pages = Math.ceil(data.length/10);
        res.status(200).json({"status": true, "content": {"meta": {"total": data.length, "pages": pages, "page": page}, "data": data }})
    } catch (error) {
        res.status(400).json({"status": false, "message": error.message});
    }
}

const getAllMember = async (req, res) => {
    const {id} = req.params;
    try {
        let page = 1;
        const pageSize = 10;
        let skip = (page-1)*pageSize; 
        const data = await member.find({community: id}).populate('user', 'name').populate('role', 'name').skip(skip).limit(pageSize).exec();
        let pages = Math.ceil(data.length/10);
        res.status(200).json({"status": true, "content": {"meta": {"total": data.length, "pages": pages, "page": page}, "data": data }})
    } catch (error) {
        res.status(400).json({"status": false, "message": error.message});
    }
}

const getCommunityByUser = async (req, res) => {
    try {
        let page = 1;
        const pageSize = 10;
        let skip = (page-1)*pageSize; 
        const user_id = req.user.id;
        const data = await community.find({owner: user_id}).skip(skip).limit(pageSize);
        let pages = Math.ceil(data.length/10);
        res.status(200).json({"status": true, "content": {"meta": {"total": data.length, "pages": pages, "page": page}, "data": data }})
    } catch (error) {
        res.status(400).json({"status": false, "message": error.message});
    }
}

const getJoinedCommunity = async (req, res) => {
    try {
        let page = 1;
        const pageSize = 10;
        let skip = (page-1)*pageSize; 
        const user_id = req.user.id;
        const communities = await member.find({user: user_id}).select('community');
        const communitiesIds = communities.map(obj => obj.community);

        const data = await community.find({_id: {$in: communitiesIds}}).populate('owner', 'name').skip(skip).limit(pageSize).exec();

        let pages = Math.ceil(data.length/10);
        res.status(200).json({"status": true, "content": {"meta": {"total": data.length, "pages": pages, "page": page}, "data": data }})
    } catch (error) {
        res.status(400).json({"status": false, "message": error.message});
    }
}

module.exports = {createCommunity, getAllCommunity, getAllMember, getCommunityByUser, getJoinedCommunity}