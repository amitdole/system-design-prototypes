const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./helpers/formatDate');

const {
    getActiveUser,
    exitGroup,
    newUser,
    getGroupUsers
} = require('./helpers/userHelper');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname,'/public')))

io.on('connection', socket => {
    socket.on('joinGroup',({username, group})=> {
        const user = newUser(socket.id, username, group);
        socket.join(user.group);

        socket.emit('message',formatMessage("Mychat",'Moderation apply.'));

        socket.broadcast
        .to(user.group)
        .emit('message',formatMessage("Mychat",`${user.username} joined group.`));

        io.to(user.group).emit('groupUsers',{
            group: user.group,
            users: getGroupUsers(user.group)
        });
    });

    socket.on('chatMessage', msg => {
        const user = getActiveUser(socket.id);

        io.to(user.group).emit('message',formatMessage(user.username, msg))
    });

    socket.on('disconnect', () => {
        const user = exitGroup(socket.id);
        
        if (user){
            io.to(user.group)
            .emit('message',
            formatMessage('MyChat', `${user.username} has left.`));

        io.to(user.group).emit('groupUsers',{
            group: user.group,
            users: getGroupUsers(user.group)
        });
    }
    });
});

const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log(`App is listening on port ${PORT}`))
