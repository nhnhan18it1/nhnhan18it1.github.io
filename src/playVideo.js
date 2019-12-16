function playVideo(stream, idVideo) {
    const video = document.getElementById(idVideo);
    video.srcObject = stream;
    video.onloadeddata = function() {
        video.play();
    };
}
module.exports = playVideo;
