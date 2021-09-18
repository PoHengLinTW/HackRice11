const express = require("express");

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = 8080;

const userList = [];
const roomList = [];

app.use(express.static('public'))

io.on('connection', (socket) => {
	console.log('a user connected', socket.id);
	socket.on("get-gmail", (data) => {
		console.log(data);
		userList.add(data);
		socket.on("invite", (data) => {
			socket.to(data.to).emit("get-invitation", data.from)
		})
		socket.on("candidate", (data) => {
			socket.to(data.to).emit("candidate", data.candidate);
		})
		socket.on("send-offer", (data) => {
			socket.to(data.to).emit("recv-offer", data.offer);
		})
		socket.on("send-answer", (data) => {
			socket.to(data.to).emit("recv-answer", data.answer);
		})
	})
});

server.listen(PORT, () => {console.log("App listens on port " + PORT)});
