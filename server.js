const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const {userJoin,getUsers,userLeave,getRoomUsers} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname,'public')))

io.on('connection',(socket)=>{
    socket.on('joinRoom',({username,room})=>{
        const user = userJoin(socket.id,username,room)
        socket.join(user.room)
        socket.emit('message',formatMessage('ChatBot',`Welcome to ${user.room} chat`))
        socket.broadcast.to(user.room).emit('message',formatMessage('ChatBot',`${user.username} has joined the chat`))
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id)
        if(user){
            io.to(user.room).emit('message',formatMessage('ChatBot',`${user.username} has left the chat`)) 
            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
    socket.on('chatmessage',(msg)=>{
        const user = getUsers(socket.id)
        io.to(user.room).emit('message',formatMessage(user.username,msg))
    })
})


server.listen(3000,()=>console.log('Server running'))

