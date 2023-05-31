const express = require("express")
const app = express()
const http = require("http").createServer(app)
const { Server } = require("socket.io")
const path = require("path")
const io = new Server(http)

app.use(express.static((__dirname)))

const client_data = new Set()

io.on("connection", onConnect)

function onConnect(socket) {
    client_data.add(socket.id)

    io.emit("Totaluser", client_data.size)
    socket.on("disconnect", () => {
        client_data.delete(socket.id)
        io.emit("Totaluser", client_data.size)
    })

    socket.on("message",(data)=>{
        
        socket.broadcast.emit("chat-message",data)
    })
    socket.on("feedback",(data)=>{
        socket.broadcast.emit("live",data)
    })

}

http.listen(7040, () => {
    console.log("server started")
})

