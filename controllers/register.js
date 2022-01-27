const express = require('express');
const mongo = require('mongodb')
const router = express.Router();
const db = require('../models');
const mongoose= require('mongoose')
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check')




router.post('/', [
    check('firstName', 'First Name is required').not().isEmpty(),
    check('lastName', 'Last Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    try {
        let foundUser = await db.User.findOne({email});
        if (foundUser) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
        }
        const salt = await bcrypt.genSalt(10);
        hash = await bcrypt.hash(password, salt);
        req.body.password = hash;
        const newUser = await db.User.create(req.body);
        res.send('User registered');
    } catch (err) {
        console.log(err.message),
        res.status(500).send('Internal Server Error')
    } 
})


module.exports = router;