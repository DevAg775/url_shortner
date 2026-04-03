const express = require("express");
const {handleSignup,handlelogin} = require('../controllers/user')
const router = express.Router()

router.post('/',handleSignup)
router.post('/login',handlelogin)



module.exports = router;