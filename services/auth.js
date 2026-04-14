const sessionidToUserMap = new Map()

function setUser(id, user){
    sessionidToUserMap.set(id,user)
}

function getUser(id){
    return sessionidToUserMap.get(id)
}

function deleteUser(id){
    sessionidToUserMap.delete(id)  //  Map has a built-in delete method
}

module.exports = {
   setUser,getUser,deleteUser
}