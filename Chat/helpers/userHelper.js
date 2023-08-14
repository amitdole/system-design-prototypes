const users = [];

function newUser(id, username, group){
    const user = {id, username, group};

    users.push(user);

    return user;
}

function getActiveUser(id){
    return users.find(user => user.id == id);
}

function exitGroup(id){

    const index = users.findIndex(user => user.id === id);

    if (index !== -1){

        return users.splice(index,1)[0];
    }
}

function getGroupUsers(group){
    return users.filter(user => user.group == group);
}

module.exports = {
    getActiveUser,
    exitGroup,
    newUser,
    getGroupUsers
};