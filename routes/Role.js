const express = require('express');
const {getRoles, createRole} = require('../controller/Role')
const router = express.Router();

router.get('/', getRoles);
router.post('/', createRole);

module.exports = router