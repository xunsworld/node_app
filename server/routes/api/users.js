// login & register
const express = require('express');
const router = express.Router();
const User = require('../../models/User');
// 加密算法
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
// token
const jwt = require('jsonwebtoken');
const { secretOrKey } = require('../../config/keys');
const passport = require('passport');

// @route   POST api/users/register
// @desc    Register User
// @access  Public

router.post("/register", (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ msg: "Email already exists" });
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save().then(user => res.json(user));
                });
            });

        }
    })
})
// @route   POST api/users/login
// @desc    Login User / Return JWT Token
// @access  Public
router.post("/login", (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ msg: "User not found" })
        }

        bcrypt.compare(password, user.password).then(isMath => {
            if (isMath) {
                const rule = { id: user.id, name: user.name }
                // jwt.sign('规则', '加密名字', '过期时间', '箭头函数')
                jwt.sign(rule, secretOrKey, { expiresIn: 3600 }, (err, token) => {
                    if (err) throw err;
                    res.json({
                        success: true,
                        token: "Bearer " + token
                    })
                })
            } else {
                res.status(400).json({ msg: "Invalid password" })
            }
        })
    })
})

// @route   GET api/users/current
// @desc    Get Current User
// @access  Private
router.get("/current", passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    })
})

module.exports = router;