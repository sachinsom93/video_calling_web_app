const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)
const PORT = 3000 || process.env.PORT
const path = require("path")
const ejsLayuts = require('express-ejs-layouts')
const { v4 } = require("uuid")


// setting ejs and static files
app.set("view engine", "ejs")
app.use(ejsLayuts)
app.use("/public", express.static(path.join(__dirname, "static")))



// events for socket
io.on("connection", (socket) => {
    
    socket.on("join-room", (ROOM_ID, userId) => {
        console.log(`user ${userId} joined room ${ROOM_ID}.`)
        socket.join(ROOM_ID, (err) => {
            if(err){
                console.log(err)
            }
        })
        socket.to(ROOM_ID).broadcast.emit("enteredToRoom", userId)
        socket.on('disconnect', () => {
            socket.to(ROOM_ID).broadcast.emit("user-disconnected", userId)
        })
    })
})



// routes 
app.get('/', (req, res) => {
    res.redirect(`/${v4()}`)
})

app.get("/:roomId", (req, res) => {
    res.render('room', {roomId: req.params.roomId})
})



// listening server
server.listen(PORT, (err) => {
    if(err){
        console.log(err)
    }
    else{
        console.log(`server is started on port ${PORT}`)
    }
})