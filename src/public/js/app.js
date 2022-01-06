const message = document.querySelector("ul");
const messageForm = document.querySelector("form");

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {//서버가 연결될 때
    console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {//서버가 메세지를 받을 때
    console.log("New message: ", message.data);
});

socket.addEventListener("close", () => {//서버가 오프라인 일때
    console.log("Disconnected to Server ❌");
});

messageForm.addEventListener("submit", (event) => {
    event.preventDefault();//새로 고침 방지
    const input = messageForm.querySelector("input");
    socket.send(input.value);
    input.value = "";
})