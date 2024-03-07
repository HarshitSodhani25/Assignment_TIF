const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        if(!req.headers.hasOwnProperty('authorization'))
            throw {"message": "Problem with token"};
        const token = req.headers['authorization'].split(' ')[1];
        if(token){
            let user = jwt.verify(token, process.env.SECRET_KEY);
            if(user.hasOwnProperty('id'))
                req.user = user;
            else
                throw {"message": "Problem with token"};
        }else{
            res.status(404).json({"status": false, "message": "Problem with token"});
        }
        next();
    } catch (error) {
        res.status(400).json({"status": false, "message": error.message});
    }
}

module.exports = {auth}