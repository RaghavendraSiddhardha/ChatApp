const users = [];

function userJoin(id,username,room){
    const user = {id,username,room};
    users.push(user)
    return user;
}

function getUsers(id){
    return users.find(user=>user.id===id)
}

function userLeave(id){
    const ind = users.findIndex(user=>user.id===id)
    if(ind!==-1){
        return users.splice(ind,1)[0];
    }
}

function getRoomUsers(room){
    return users.filter(user=>user.room===room)
}

module.exports = {userJoin,getUsers,userLeave,getRoomUsers}