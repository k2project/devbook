const express = require('express');
const router = express.Router();

//@route    GET api/profile
//@desc     Profile route
//@access   Public
router.get('/', (req, res) => console.log('Profile router'));

module.exports = router;
