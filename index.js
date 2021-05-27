var getusermedia = require('getusermedia');
var Peer = require('simple-peer');

video = true;
audio = true;

var videoChat = true;
var audioChat = true;
days = {
    1:'Mon',
    2:'Tue',
    3:'Wed',
    4:'Thu',
    5:'Fri',
    6:'Sat',
    7:'Sun'
};

getusermedia(
    {
        video: video,
        audio: audio,
    },
    function(err, stream){
        if(err) console.log(err);

        console.log("Hello, World!");

        var peer = new Peer({
            initiator: location.hash === "#init",
            trickle: false,
            stream: stream,
        });

        peer.on('signal', function(data){
            console.log(data);
            document.getElementById("yourId").value = JSON.stringify(data);
        });

        document.getElementById("connect").addEventListener('click', function(){
            console.log("Connect button was clicked");
            var otherId = JSON.parse(document.getElementById('otherId').value);
            peer.signal(otherId);
        });

        document.getElementById("send").addEventListener('click', function(){
            console.log("Send button was clicked");
            var yourMessage = document.getElementById('yourMessage').value;

            console.log(yourMessage);
            var d = new Date();
            var n = days[d.getDay()] + "  " + d.getHours().toString() + ":" + d.getMinutes().toString();

            {
                html = $("<div class='row message-body'>")
                .append(
                    $("<div class='col-sm-12 message-main-sender'>")
                    .append(
                        $("<div class='sender'>")
                        .append(
                            $("<div class='message-text'>").text($('#yourMessage').val()),
                            $("<span class='message-time pull-right'>").text(n.toString())
                        )
                    )
                );
                $(".message").append(html);
            }

            peer.send(yourMessage);
            document.getElementById('yourMessage').value = "";      
        });

        document.getElementById("videoCall").addEventListener('click', function(){
            
        });

        document.getElementById("yourMessage").addEventListener('keyup', function(event){
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById("send").click();
            }
        });

        document.getElementById("videoChat").addEventListener('click', function(){
            // video = !video;
            stopVideoOnly(stream);
            console.log("VideoChat: " + String(videoChat));
        });

        document.getElementById("audioChat").addEventListener('click', function(){
            // audio = !audio;
            stopAudioOnly(stream);
            console.log("AudioChat: " + String(audioChat));
        });

        peer.on('data', function(data){
            console.log(data);

            var d = new Date();
            var n = days[d.getDay()] + "  " + d.getHours().toString() + ":" + d.getMinutes().toString();
            {
                html = $("<div class='row message-body'>")
                .append(
                    $("<div class='col-sm-12 message-main-receiver'>")
                    .append(
                        $("<div class='receiver'>")
                        .append(
                            $("<div class='message-text'>").text(data),
                            $("<span class='message-time pull-right'>").text(n.toString())
                        )
                    )
                );
                $(".message").append(html);
            }
        });
        peer.on('stream', function(stream){
            console.log(stream);
            showWebcam(stream);
        });
    }
);

function showWebcam(stream){
    var video = document.createElement("video");
    document.body.appendChild(video);
    video.srcObject = stream;
    video.style.width = "75%";
    video.style.position = "relative";
    video.style.right = "-12.5%";
    video.style.marginTop = "75px";
    video.style.marginBottom = "30px";
    video.style.border= "5px solid";
    video.className = "remote-stream";
    video.play();
}

// stop both mic and camera
function stopBothVideoAndAudio(stream) {
    stream.getTracks().forEach(function(track) {
        if (track.readyState == 'live') {
            track.stop();
        }
    });
}

// stop only camera
function stopVideoOnly(stream) {
    stream.getVideoTracks().forEach(function(track) {
        videoChat = !videoChat;
        // if (track.readyState == 'live' && track.kind === 'video') {
        //     track.enabled = videoChat;
        // }
        track.enabled = videoChat;
    });
}

// stop only mic
function stopAudioOnly(stream) {
    stream.getAudioTracks().forEach(function(track) {
        audioChat = !audioChat;
        track.enabled = audioChat;
        // if (track.readyState == 'live' && track.kind === 'audio') {
        //     track.enabled = audioChat;
        // }
        // else{
        //     track.enabled = audioChat;
        // }
    });
}