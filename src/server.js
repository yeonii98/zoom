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
    socket.on("enter_room", (roomName, done) => {
        setTimeout(() => {
            done("hello from the backend");
        }, 10000);
    }); 
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