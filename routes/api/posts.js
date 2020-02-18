const express = require('express');
const router = express.Router();

//@route    GET api/posts
//@desc     Posts route
//@access   Public
router.get('/', (req, res) => console.log('Posts router'));

module.exports = router;
