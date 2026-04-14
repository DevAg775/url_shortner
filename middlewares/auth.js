const { getUser } = require("../services/auth")

async function restrictToLoggedinUserOnly(req,res,next){
    const userUid = req.cookies?.uid

    if(!userUid) return res.redirect("/login") //agar user-uid ni hsi to login pr bhejo
    const user = getUser(userUid)

    if(!user) return res.redirect("/login") //agar user map me nhi hai toh login pr bhejo
    req.user = user
    next()
}

async function checkAuth(req,res,next){
    const userUid = req.cookies?.uid
    const user = getUser(userUid)
    req.user = user
    next()
}

module.exports = {
    restrictToLoggedinUserOnly,checkAuth
}