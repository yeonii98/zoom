const socket = io();

const welcome = document.getElementById("welcome");
const nickform = welcome.querySelector("#nickform");
const roomform = welcome.querySelector("#roomform");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgform = room.querySelector("#msg");
    msgform.addEventListener("submit", handleMessageSubmit);
}

roomform.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = roomform.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
});
//마지막 argument는 꼭 function이 와야 함

nickform.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = welcome.querySelector("#nickform input");
    const value = input.value;
    socket.emit("nickname", value);
});

socket.on("welcome", (user) => {
    addMessage(`${user} arrived!`);
})

socket.on("bye", (left) => {
    addMessage(`${left} left ㅠㅠ`);
})

socket.on("new_message", addMessage);