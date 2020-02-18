const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('./../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

//@route    POST api/users
//@desc     User registration
//@access   Public
router.post(
    '/',
    [
        check('name', 'User name is required!')
            .not()
            .isEmpty(),
        check('email', 'A valid email is required!').isEmail(),
        check(
            'password',
            'Please eneter a password of min 6 characters.'
        ).isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body;
        try {
            //check if user exist
            let user = await User.findOne({ email });
            if (user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'User already exist' }] });
            }
            //check if  the email has got gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
            user = new User({ name, email, avatar, password });

            //encript the password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            //save a new user
            await user.save();
            const payload = {
                user: {
                    id: user.id
                }
            };
            //creat token
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 3600000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('server error');
        }
    }
);

module.exports = router;
