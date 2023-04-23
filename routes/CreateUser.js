const express = require('express')
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const jwtSecrate = "mynameiskaraniamawebdeveloper"
// Creating a new user | Signup form

router.post('/createuser',
    // username must be an email
    [body('email', "Please enter a valid email").isEmail(),
    // password must be at least 5 chars long
    body('name', "Please enter valid name").isLength({ min: 5 }),
    body('password', "Incorrect password").isLength({ min: 5 })],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let salt = await bcrypt.genSalt(10);
        let secPassword = await bcrypt.hash(req.body.password, salt)
        try {
            await User.create({
                name: req.body.name,
                password: secPassword,
                email: req.body.email,
                location: req.body.location
            })
         
            res.json({ success: true });
        } catch (error) {
            console.log(error)
            res.json({ success: false });
        }

    })


// Verifying the user | Login Form

router.post('/loginuser',
    [body('email', "Please enter a valid email").isEmail(),
    // password must be at least 5 chars long
    body('password', "Incorrect password").isLength({ min: 5 })],
    async (req, res) => {
        let email = req.body.email;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            let userData = await User.findOne({ email })
            if (!userData) {
                return res.status(400).json({ errors: 'Incorrect credentials , Please enter valid details' });
            }
            const passCompare = await bcrypt.compare(req.body.password, userData.password)
            if (!passCompare) {
                return res.status(400).json({ errors: 'Incorrect password, Please enter valid details' });
            }
            
            const data = {
                user: {
                    id: userData.id
                }
            }
            const authToken = jwt.sign(data, jwtSecrate)
            
            res.json({ success: true, authToken: authToken });
        } catch (error) {
            console.log(error)
            res.json({ success: false });
        }
    })

module.exports = router;