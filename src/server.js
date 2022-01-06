import http from "http";
import WebSocket from "ws";
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
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    console.log("Connected to Browser ✅");
    socket.on("close", () => console.log("Disconnected from the Browser ❌"));
    socket.on("message", (message) => {
        sockets.forEach((aSocket) => aSocket.send(message.toString()));
    })
   
});

server.listen(3000, handleListen);