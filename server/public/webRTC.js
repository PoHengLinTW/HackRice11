
const {RTCPeerConnection, RTCIceCandidate} = window

const myInput = document.getElementById('myId');
const join = document.getElementById('join');
const invitation = document.getElementById('otherId');
const send = document.getElementById('send');
var localStream;

/** ------------------- */
const mediaStreamConstraints = {
    video: true,
};

function handleLocalMediaStreamError(error) {
    console.log('navigator.getUserMedia error: ', error);
}
  

const socket = io("http://34.125.144.188/");

socket.on("connect", () => {
  console.log(socket.id); 
  socket.on("welcome", (data) => {console.log(data)});
});

join.onclick = (evt) => {
    socket.emit("get-gmail", {
        mail: myInput.innerHTML
    })
}

send.onclick = (evt) => {
    console.log("click")
    navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
    .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);
    // socket.emit("invite", {
    //     mail: myInput.innerHTML
    // })
}

function gotLocalMediaStream(mediaStream) {
    localStream = mediaStream;
}