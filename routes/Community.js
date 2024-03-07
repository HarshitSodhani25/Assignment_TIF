const express = require('express');
const {createCommunity, getAllCommunity, getAllMember, getCommunityByUser, getJoinedCommunity} = require('../controller/Community');
const {auth} = require('../middleware/Auth');
const router = express.Router();

router.post('/', auth, createCommunity);
router.get('/', getAllCommunity);
router.get('/:id/members', getAllMember);
router.get('/me/owner', auth, getCommunityByUser);
router.get("/me/member", auth, getJoinedCommunity);

module.exports = router