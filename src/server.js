import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views"); //경로설정
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home")); //디폴트 화면
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

//같은 서버에서 http, webSocket 둘 다 작동시키기
//두 개의 프로토콜이 같은 포트에서 작동한다.
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket.onAny((event) => {
        console.log(`Socket Event:${event}`)
    })
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname);//방 안에 있는 모든 사람들에게 emit(내가 아닌 다른 사람들)
    }); 
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname));
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);//방 안에 있는 모든 사람들에게 emit(내가 아닌 다른 사람들) 이게 작동하려면 프론트쪽에서 on으로 받아줘야함
        done();
    });
    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});
// const sockets = [];
// const wss = new WebSocket.Server({ server });
// wss.on("connection", (socket) => {
//     sockets.push(socket);
//     console.log("Connected to Browser ✅");
//     socket["nickname"] = "Anon";
//     socket.on("close", () => console.log("Disconnected from the Browser ❌"));
//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg);//string을 javascript object로 변환
//         switch(message.type){
//             case "new_message":
//                 sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
//             case "nickname":
//                  socket["nickname"] = message.payload;
//         }
        
//     })
   
// });

httpServer.listen(3000, handleListen);