require('dotenv').config()
const express = require("express");
const cors = require('cors')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});
const PORT = 8080;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
var twilioToken = ""
client.tokens.create().then(token => {
	twilioToken = token;
	console.log(token)
});

var userList = [];

app.use(express.static('public'))
app.use(cors())

app.get('/iceserver', (req, res) => {
	return res.json(twilioToken.iceServers);
})

app.get('/user/:email', (req, res) => {
	const user = userList.find(ele => ele.mail === req.params['email'])
	if (user) res.send(user.sid);
	else res.send("404");
})

io.on('connection', (socket) => {
	console.log('a user connected', socket.id);
	socket.on("get-gmail", (data) => {
		const newUser = {
			mail: data.mail,
			isInMeeting: false,
			isOnline: true,
			sid: socket.id,
		}
		userList.push(newUser);

		socket.on("invite", (data) => {
			console.log("invite ", data);
			socket.to(user.sid).emit("get-invitation-pending", {
				from: data.from,
				sid: socket.id
			})
		})

		socket.on("candidate", (data) => {
			socket.to(data.to).emit("candidate", data.candidate);
		})

		socket.on("send-offer", (data) => {
			socket.to(data.to).emit("recv-offer", {
				offer: data.offer,
				from: socket.id
			});
		})

		socket.on("send-answer", (data) => {
			socket.to(data.to).emit("recv-answer", {
				answer: data.answer,
				from: socket.id
			});
		})	
	})
	socket.on("disconnect", () => {
		console.log(socket.id + " leave ");
		userList = userList.filter(ele => ele.sid !== socket.id);
		socket.broadcast.emit("user-leave", socket.id);
	})
});

server.listen(PORT, () => {console.log("App listens on port " + PORT)});
