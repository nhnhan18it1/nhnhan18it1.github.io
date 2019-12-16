const openCamera = require('./openCamera');
const playVideo = require('./playVideo');
const socket = io('http://localhost:3000');
//const $ = require('https://code.jquery.com/jquery-3.4.1.min.js');
//openCamera();
const Peer = require('simple-peer');


// p.on('connect', () => console.log('connected'))
$(document).ready(function() {
    socket.emit('client-send-ID', infor())
    console.log(infor())
    console.log($('#IDNN').val())
    openCamera(function(stream) {
        playVideo(stream, 'localstream')
        const Peer = require('simple-peer');
        const p = new Peer({ initiator: location.hash === '#1', trickle: false, stream: stream });

        p.on('signal', token => {
            socket.emit('video-call-rq', { IDND: ' ' + $('#IDNN').val() + ' ', IDNG: infor().IDND, Name: infor().Name, Avt: infor().Avt, Token: token })
                //$('#txtMySignal').val(JSON.stringify(token));
                //console.log(token)
                // if (infor().IDND == 2) {

            // } else {
            //     socket.emit('video-call-rq', { IDND: 2, IDNG: infor().IDND, Name: infor().Name, Avt: infor().Avt, Token: token })
            // }
            //socket.emit('video-call-rq', { IDND: $('#IDNN').val(), IDNG: infor().IDND, Token: token })
        });
        socket.on('server-send-rqvideo', function(data) {
            p.signal(data.Token);
        })
        socket.on('resend-token', function(data) {
            p.signal(data.Token);
        })

        function runStream(tokenX) {
            p.signal(tokenX);
        }
        $('#btnConnect').click(function(e) {
            const friendSN = JSON.parse($('#txtFriendSignal').val());
            p.signal(friendSN);
        });
        p.on('stream', friendstream => playVideo(friendstream, 'friendstream'))
    });
});