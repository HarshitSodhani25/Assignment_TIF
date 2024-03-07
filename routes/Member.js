const express = require('express');
const {addMember, deleteMember} = require('../controller/Member');
const {auth} = require('../middleware/Auth')
const router = express.Router();

router.post('/', auth, addMember);
router.delete('/:id', auth, deleteMember);

module.exports = router