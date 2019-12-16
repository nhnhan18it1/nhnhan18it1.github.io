const playVideo = require('./playVideo');

function openCamera(cb) {
    navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
        })
        .then(stream => {
            cb(stream);

        })
        .catch(err => console.log(err))
}
module.exports = openCamera;


// {
//     const video = document.getElementById('localstream');
//     video.srcObject = stream;
//     video.onloadedmetadata = function() {
//         video.play();
//     }
// }