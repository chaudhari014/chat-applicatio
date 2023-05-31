const socket = io()
let messageContainer = document.getElementById("message-container")
let nameInput = document.getElementById("name-input")
let messageForm = document.getElementById("message-form")
let messageInput = document.getElementById("message-input")

let connect_user = document.getElementById("connect-user")

messageForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    sendMessage()
})
socket.on("Totaluser", (size) => {
    connect_user.textContent = `Total user: ${size}`
}) 

function sendMessage(){
    const data={
        name:nameInput.value,
        message:messageInput.value,
        dateTime:new Date()
    }
    socket.emit("message",data)
    if(!messageInput.value){
        alert("please write some message")
        return
    }
    addmessageToUI(true,data)
    scroll()
    messageInput.value=""
}
socket.on("chat-message",(data)=>{
    addmessageToUI(false,data)
})

function addmessageToUI(isOwnmessage,data){
    clearFeedback()
       let element=` <li class=${isOwnmessage?"message-right":"message-left"}>
       <p class="message">${data.message}
           <span>${data.name}-${moment(data.dateTime).fromNow()}</span>
       </p>
   </li>`
   messageContainer.innerHTML += element
}

function scroll(){
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
}

messageInput.addEventListener("focus",()=>{
    socket.emit("feedback",{feedback:`${nameInput.value} is typing a message...`})
})
messageInput.addEventListener("keypress",()=>{
    socket.emit("feedback",{feedback:`${nameInput.value} is typing a message...`})
})
// messageInput.addEventListener("blur",()=>{
//     socket.emit("feedback",{feedback:""})
// })

socket.on("live",(data)=>{
    clearFeedback()
    console.log(data)
    let ele=`<li class="message-feedback">
    <p class="feedback" id="feedback">${data.feedback}</p>
</li>`
console.log(ele)
messageContainer.innerHTML += ele
})

function clearFeedback(){
    document.querySelectorAll("li.message-feedback").forEach(el=>{
        el.parentNode.removeChild(el)
    })
}