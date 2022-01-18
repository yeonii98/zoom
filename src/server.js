import http from "http";
import SocketIO from "socket.io";
import express from "express";
import { instrument } from "@socket.io/admin-ui";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views"); //경로설정
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home")); //디폴트 화면
app.get("/*", (req, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("ansewr", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  })
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);

httpServer.listen(3000, handleListen);
//같은 서버에서 http, webSocket 둘 다 작동시키기
//두 개의 프로토콜이 같은 포트에서 작동한다.
  

// function publicRooms(){
//     const {
//         sockets: {
//             adapter: { sids, rooms },
//         },
//     } = wsServer;
//     const publicRooms = [];
//     rooms.forEach((_, key) => {//roomID를 socketID에서 찾을 수 없다면 public room을 찾은 것.
//         if(sids.get(key) === undefined){
//             publicRooms.push(key);
//         }
//     });
//     return publicRooms;
// }

// function countRoom(roomName){
//     return wsServer.sockets.adapter.rooms.get(roomName)?.size;
// }

// wsServer.on("connection", (socket) => {
//     socket.onAny((event) => {
//         console.log(`Socket Event:${event}`)
//     })
//     socket.on("enter_room", (roomName, done) => {
//         socket.join(roomName);
//         done();
//         socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));//방 안에 있는 모든 사람들에게 emit(내가 아닌 다른 사람들)
//         wsServer.sockets.emit("room_change", publicRooms());
//     }); 
//     socket.on("disconnecting", () => {//방을 떠나기 직전
//         socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(room)-1));
//     });
//     socket.on("disconnect", () => {
//         wsServer.sockets.emit("room_change", publicRooms());
//     });
//     socket.on("new_message", (msg, room, done) => {
//         socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);//방 안에 있는 모든 사람들에게 emit(내가 아닌 다른 사람들) 이게 작동하려면 프론트쪽에서 on으로 받아줘야함
//         done();
//     });
//     socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
// });

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
