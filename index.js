const express = require("express")
const app = express()
const http = require("http").createServer(app)
const { Server } = require("socket.io")
const path = require("path")
const io = new Server(http)
const multer  = require('multer')

app.use(express.static(path.join(__dirname,"./html")))
app.use(express.json())

app.get("/",(req,res)=>{
  res.send({"msg":"successfully"})
})

// --------------------------------------------------------------------
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

  app.post("/upload",upload.single("file"),(req,res)=>{
    
    res.send({msg:"file uploaded successfully",imageName:req.file.filename})
  })



// ------------------------------------------------------------------------------------------



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

    socket.on("image",(data)=>{
        console.log(data)
        socket.broadcast.emit("upload-image",data)
    })

}








http.listen(7040, () => {
    console.log("server started")
})

