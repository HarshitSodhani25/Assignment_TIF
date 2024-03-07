const member = require('../models/Member');
const role = require('../models/Role');
const community = require('../models/Community')
const {Snowflake} = require('@theinternetfolks/snowflake')

const addMember = async (req, res) => {
    const {community, user, role} = req.body;
    try {
        const user_id = req.user.id;
        const community_owner = await community.findOne({_id: community});
        const isMember = await member.findOne({user: user_id});
        const role_id = await role.findOne({name: 'community admin'}).select('_id')
        if(community_owner.user===user_id || isMember?.role===role_id){
            const userExist = await user.findOne({_id: user});
            if(userExist){

                //generate the snokflake id
                const id = Snowflake.generate();

                const data = new member({_id: id, community: community, user: user, role:role})
                await data.save();
                res.status(201).json({"status": true, "content": {data: data}});
            }else{
                throw {"message": "User does not exist"};
            }
        }else{
            res.status(400).json({"status": false, "message": "Not allowed access"})
        }
    } catch (error) {
        res.status(400).json({"status": false, "message": error.message});
    }
}

const deleteMember = async (req, res) => {
    const {id} = req.params;
    try {
        const user_id = req.user.id;
        const memberCommunity = await member.findById(id);
        const userOwnedCommunity = await community.find({owner: user_id});
        let flag=0;
        for (let obj of userOwnedCommunity){
            if(obj._id === memberCommunity.community){
                flag = 1;
                break;
            }
        }
        const isMember = await member.findOne({user: user_id, community: memberCommunity.community});
        if(flag === 0 && !isMember)
            throw {"message": "Not Allowed Access"};
        const role_id = await role.find({$or:[{name: 'community owner'}, {name:'community moderator'}]});
        for (let obj of role_id){
            if(isMember.role === obj._id)
                flag = 1;
        }
        if(flag === 0){
            throw {"message": "Not Allowed Access"};
        }
        await member.findByIdAndDelete(id);
        res.status(200).json({"status": true});
    } catch (error) {
        res.status(400).json({"status": false, "message": error.message});
    }
     
}

module.exports = {addMember, deleteMember}