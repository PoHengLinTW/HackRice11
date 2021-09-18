

const myInput = document.getElementById('myId');
const join = document.getElementById('join');
const invitation = document.getElementById('otherId');
const send = document.getElementById('send');
const videoDiv = document.getElementById('video-div');
var localStream = new MediaStream();
var videoEle;
var opponentSid = "";

/** ------------------- */
const {RTCPeerConnection, RTCSessionDescription, RTCIceCandidate} = window
var config = {
    iceServers: [ { urls: ["stun:stun.l.google.com:19302"] } ] 
};
fetch('https://oneclickmeeting.tech/iceserver')
.then(res => {return res.json()})
.then( data => {
    config.iceServers = data;
    console.log(config)
})
var myPC = new RTCPeerConnection(config);

const mediaStreamConstraints = {
    audio: true,
    video: true,
};

function handleLocalMediaStreamError(error) {
    console.log('navigator.getUserMedia error: ', error);
}
  

const socket = io("https://oneclickmeeting.tech/");

socket.on("connect", () => {
    myPC.onicecandidate = (evt) => {
        console.log("candidate")
        socket.emit("candidate", {
            to: opponentSid,
            candidate: evt.candidate
        })
    }

    myPC.ontrack = event => {
        if (!document.getElementById(event.streams[0].id)) {
            videoEle = document.createElement('video');
            videoEle.autoplay = true;
            videoEle.playsInline = true;
            videoEle.srcObject = event.streams[0];
            videoEle.id = event.streams[0].id;
            videoDiv.appendChild(videoEle);
        }
    };

    console.log(socket.id); 

    socket.on("recv-offer", (data) => {
        console.log("recv-offer")

        navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
        .then(gotLocalMediaStream).then(()=>{
            console.log(localStream)
            localStream.getTracks().forEach(track => myPC.addTrack(track, localStream));
            myPC.setRemoteDescription(new RTCSessionDescription(data.offer));
            myPC.createAnswer().then(answer => {
                myPC.setLocalDescription(answer);
                socket.emit("send-answer", {
                    to: data.from,
                    answer: answer
                })
            });
        }).catch(handleLocalMediaStreamError);
    })
    socket.on("recv-answer", (data) => {
        console.log("recv-answer")
        myPC.setRemoteDescription(new RTCSessionDescription(data.answer));
    })
    socket.on("candidate", (candidate) => {
        console.log("candidate")
        if (candidate) myPC.addIceCandidate(candidate)
        else console.log("candidate ends");
    })
    
    socket.on("user-leave", (sid) => {
        console.log("user-leave", sid, opponentSid)
        if (sid === opponentSid) {
            localStream.getTracks().forEach( track => track.stop);
            videoDiv.innerHTML = "";
        }
    })
});

join.onclick = (evt) => {
    socket.emit("get-gmail", {
        mail: myInput.value
    })
}

send.onclick = async (evt) => {
    fetch("https://oneclickmeeting.tech/user/" + invitation.value)
    .then(res => {return res.text()})
    .then(data => {
        console.log(data);
        opponentSid = data;
        navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
        .then(gotLocalMediaStream).then(()=>{
            localStream.getTracks().forEach(track => myPC.addTrack(track, localStream));
            myPC.createOffer().then(offer => {
                myPC.setLocalDescription(offer);
                socket.emit("send-offer", {
                    to: opponentSid,
                    offer: offer
                })
            });
        }).catch(handleLocalMediaStreamError);
    });
    

}

function gotLocalMediaStream(mediaStream) {
    localStream = mediaStream;
}