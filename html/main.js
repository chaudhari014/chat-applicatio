const socket = io()
let messageContainer = document.getElementById("message-container")
let nameInput = document.getElementById("name-input")
let messageForm = document.getElementById("message-form")
let messageInput = document.getElementById("message-input")

let connect_user = document.getElementById("connect-user")



let username=prompt("what is your name")
nameInput.value=username
messageForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    sendMessage()
})
socket.on("Totaluser", (size) => {
    connect_user.textContent = `Total user: ${size}`
}) 

function sendMessage(){
    let time=new Date()
    let date=time.getDate()
    let month=time.getUTCMonth()
    let hours=time.getHours()>=12?time.getHours()-12:time.getHours()
    let AmPm=time.getHours()>=12?"pm":"am"
    let minit=time.getMinutes()

    const data={
        name:username,
        message:messageInput.value,
        dateTime:`${hours}:${minit} ${AmPm}`
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
    scroll()
})

function addmessageToUI(isOwnmessage,data){
    clearFeedback()
       let element=` <li class=${isOwnmessage?"message-right":"message-left"}>
       <p class="message">${data.message}
           <span>by ${data.name} ${data.dateTime}</span>
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
messageInput.addEventListener("blur",()=>{
    socket.emit("feedback",{feedback:""})
})

socket.on("live",(data)=>{
    clearFeedback()
    console.log(data)
    let ele=`<li class="message-feedback">
    <p class="feedback" id="feedback">${data.feedback}</p>
</li>`

messageContainer.innerHTML += ele
scroll()
})

function clearFeedback(){
    document.querySelectorAll("li.message-feedback").forEach(el=>{
        el.parentNode.removeChild(el)
    })
}




// /-----------------------------------

const form = document.getElementById('fileUploadForm');
const fileInput = document.getElementById('fileInput');

form.addEventListener('submit', async (e) => {
  e.preventDefault();


  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
         sendImage(data)
       // Success message from the server
    } else {
      console.log('File upload failed');
    }
  } catch (error) {
    console.error('An error occurred while uploading the file:', error);
  }
});


function sendImage(data){
    // let image=`<img src="./uploads/${data.name}" alt="">`
    console.log(data)
    addImageToUI(true,data)
    socket.emit("image",data)
    
}
socket.on("upload-image",(data)=>{
    addImageToUI(false,data)
    
 })



 function addImageToUI(isOwnmessage,data){
    let newimage=`<img src="./uploads/${data.imageName}"   class=${isOwnmessage?"message-right imageClick":"message-left imageClick"}  alt="">`
    messageContainer.innerHTML += newimage
    let imageClick=document.querySelectorAll("img")
       for(let i=0;i<imageClick.length;i++){
        imageClick[i].addEventListener("click",(el)=>{
            el.preventDefault()
            window.open(el.target.currentSrc,"_blank")
        })
       }
     scroll()
 }
