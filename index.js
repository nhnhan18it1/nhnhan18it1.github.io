// var server = require("http").Server(app);
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var fs = require("fs")
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
server.listen(process.env.PORT || 3000);

app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array());

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
})
app.get('/abc', function(req, res) {
    res.send("abc");
});

var mangUser = [];

function search(nameKey, expext) {
    for (var i = 0; i < mangUser.length; i++) {
        if (mangUser[i].IDND == nameKey && mangUser[i].IDND != expext) {

            return mangUser[i];

        }
    }

    //return 0;
}




io.on("connection", function(socket) {
    console.log("co nguoi ket noi" + socket.id);
    socket.broadcast.emit('server-send-listus', mangUser)
    app.post('/notify', (req, res) => {
        var rs = req.body.muser;
        var data = JSON.parse(req.body.data);
        var arr = JSON.parse(rs);

        arr.forEach(element => {
            var s = search(element, data.ID);

            if (s != null) {
                console.log(s.IDN)
                io.to(s.IDN).emit("notifyCMT", data);
            }

        });
        res.json(req.body);
    });
    socket.on('disconnect', function() {
        console.log(socket.id + "-Ngat ket noi");
        if (mangUser.length != 0) {
            for (let index = 0; index < mangUser.length; index++) {
                if (mangUser[index].IDN == socket.id) {
                    mangUser.splice(index, 1)
                    io.sockets.emit('server-send-listus', mangUser)
                        //break;
                }
            }
        }


    })
    socket.on('stream', function(data) {
        console.log(data)
        socket.broadcast.emit('sendstream', data);
    })
    socket.on('mobile-require-list', function() {
        socket.emit('server-send-listus', mangUser);
    })
    socket.on('Client-send-message', function(data) {
        console.log(data)
        socket.broadcast.emit('Server-send-message', data);
    })

    socket.on('Client-send-messagePP', function(data) {
        console.log(data);
        if (mangUser.length != 0) {
            for (let index = 0; index < mangUser.length; index++) {
                if (mangUser[index].IDND == data.IDR) {
                    socket.to(mangUser[index].IDN).emit('Server-send-messagePP', data)
                }

            }
        }
    })

    socket.on('client-send-data', function(data) {
        //console.log(data)
        //io.sockets.emit("server-send-data", data);
    })
    socket.on('client-send-ID', function(data) {
        //console.log(data);
        var obj = { IDND: data.IDND, Name: data.Name, Avt: data.Avt, IDN: socket.id }
        var check = true;
        if (mangUser.length == 0) {
            mangUser.push(obj);
            console.log(mangUser);
            io.sockets.emit('server-send-listus', mangUser)
        } else {
            for (let index = 0; index < mangUser.length; index++) {
                if (mangUser[index].IDND == data.IDND || mangUser[index].IDN == socket.id) {
                    console.log('Trung')
                    check = true; //falses
                    //break;
                }
            }
            if (check) {
                mangUser.push(obj);
                console.log(mangUser);
                io.sockets.emit('server-send-listus', mangUser)
            }
        }


    })
    socket.on("client-require-partner", function(data) {
        for (let index = 0; index < mangUser.length; index++) {
            if (mangUser[index].IDND == data) {
                socket.emit("server-require-partner", mangUser[index])
                break;
            }
        }

    })
    socket.on('client-cmt', function(data) {
        for (let index = 0; index < mangUser.length; index++) {
            mangUser[index];
            if (data.IDNN == mangUser[index].IDND) {
                socket.to(mangUser[index].IDN).emit('server-cmt', data)
                    //break;
            }
        }

    })
    socket.on('client-like', function(data) {
        for (let index = 0; index < mangUser.length; index++) {
            mangUser[index];
            if (data.IDND == mangUser[index].IDND) {
                socket.to(mangUser[index].IDN).emit('server-like', data)
                break;
            }
        }
    })
    socket.on('video-call-rq', function(data) {
        //console.log(data)
        for (let index = 0; index < mangUser.length; index++) {
            mangUser[index];
            if (data.IDND == mangUser[index].IDND) {
                socket.to(mangUser[index].IDN).emit('server-send-rqvideo', data)
                    //break;
            }
        }
    })
    socket.on('video-call-ans-rq', function(data) {
        for (let index = 0; index < mangUser.length; index++) {
            mangUser[index];
            if (data.IDND == mangUser[index].IDND) {
                socket.to(mangUser[index].IDN).emit('server-send-ans-rqvideo', data)
                    //break;
            }
        }
    })
    socket.on('client-rq-token', function(data) {
        for (let index = 0; index < mangUser.length; index++) {
            mangUser[index];
            if (data.IDND == mangUser[index].IDND) {
                socket.to(mangUser[index].IDN).emit('resend-token', data)
                break;
            }
        }
    })
    socket.on('A-answer-rqv', function(data) {
        for (let index = 0; index < mangUser.length; index++) {
            mangUser[index];
            if (data.IDNN == mangUser[index].IDND) {
                socket.to(mangUser[index].IDN).emit('server-as-rqv', data)
                console.log(data)
                break;
            }
        }


    })
})