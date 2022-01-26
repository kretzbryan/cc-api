const express = require('express');
const router =  express.Router();

router.get('/', (req, res) => {
    res.send('This is an empty route!')
})

module.exports = router