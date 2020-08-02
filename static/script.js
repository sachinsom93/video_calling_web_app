let socket = io('/')
const peer = new Peer(undefined, {
    host:'/', 
    port: '3001'
})
const videoGrid = document.getElementsByClassName("videoGrid")[0]
const myvideo = document.createElement('video')
myvideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
})
    .then((stream) => {
        myvideo.srcObject = stream
        myvideo.addEventListener("loadedmetadata", () => {
            myvideo.play()
        })
        // videoGrid.append(myvideo)
        videoGrid.appendChild(myvideo)
        peer.on('call', (call) => {
            call.answer(stream)
            const video = document.createElement('video')
            call.on('stream', userVideoStream => {
               addVideoStream(video, userVideoStream)
            }) 
        })

        socket.on("enteredToRoom", userId => {
            console.log(`${userId} joined this room`)
            addNewUser(userId, stream)
        })
    })

peer.on("open", (userId) => {
    socket.emit('join-room', ROOM_ID, userId)
})

socket.on("user-disconnect", userId => {
    if(peers[userId]){
        peers[userId].close()
    }
})

function addNewUser(userId, stream){
    const call = peer.call(userId, stream)
    const video = document.createElement("video")
    call.on("stream", userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    peers[userId] = call
    call.on("close", () => {
        video.remove()
    })
}



function addVideoStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)

}


socket.on("connect", () => {
    console.log("connected to server")
})