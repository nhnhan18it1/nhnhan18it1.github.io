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

app.get("/turnsv", function(req, res) {
    let o = {
        iceServers: [{   urls: ["stun:ss-turn2.xirsys.com"] },
            {  
                username: "E4bphbAk4Dbopxj_8MMpnJzYcbgpnBH2x4b_ES-4pnw0ZQWb3Xt5kC8CZvE9wyXRAAAAAF7ozCtuaGF2Ym5t",
                  
                credential: "299abf54-afd7-11ea-b1f4-0242ac140004",
                  
                urls: ["turn:ss-turn2.xirsys.com:80?transport=udp",       
                    "turn:ss-turn2.xirsys.com:3478?transport=udp",       
                    "turn:ss-turn2.xirsys.com:80?transport=tcp",       
                    "turn:ss-turn2.xirsys.com:3478?transport=tcp",       
                    "turns:ss-turn2.xirsys.com:443?transport=tcp",       
                    "turns:ss-turn2.xirsys.com:5349?transport=tcp"  
                ]
            }
        ]
    };

    let bodyString = JSON.stringify(o);
    let https = require("https");
    let options = {
        host: "global.xirsys.net",
        path: "/_turn/streamx",
        method: "PUT",
        headers: {
            "Authorization": "Basic " + Buffer.from("nhavbnm:feffd4ec-afd5-11ea-b23e-0242ac150003").toString("base64"),
            "Content-Type": "application/json",
            "Content-Length": bodyString.length
        }
    };

    let httpreq = https.request(options, function(httpres) {
        let str = "";
        httpres.on("data", function(data) { str += data; });
        httpres.on("error", function(e) { console.log("error: ", e); });
        httpres.on("end", function() {
            console.log("response: ", str);
            res.send(str);
        });
    });

    httpreq.on("error", function(e) { console.log("request error: ", e); });
    httpreq.end(bodyString);
})
app.post("/turnsv", function(req, res) {
    let o = {
        iceServers: [{   urls: ["stun:ss-turn2.xirsys.com"] },
            {  
                username: "E4bphbAk4Dbopxj_8MMpnJzYcbgpnBH2x4b_ES-4pnw0ZQWb3Xt5kC8CZvE9wyXRAAAAAF7ozCtuaGF2Ym5t",
                  
                credential: "299abf54-afd7-11ea-b1f4-0242ac140004",
                  
                urls: ["turn:ss-turn2.xirsys.com:80?transport=udp",       
                    "turn:ss-turn2.xirsys.com:3478?transport=udp",       
                    "turn:ss-turn2.xirsys.com:80?transport=tcp",       
                    "turn:ss-turn2.xirsys.com:3478?transport=tcp",       
                    "turns:ss-turn2.xirsys.com:443?transport=tcp",       
                    "turns:ss-turn2.xirsys.com:5349?transport=tcp"  
                ]
            }
        ]
    };

    let bodyString = JSON.stringify(o);
    let https = require("https");
    let options = {
        host: "global.xirsys.net",
        path: "/_turn/streamx",
        method: "PUT",
        headers: {
            "Authorization": "Basic " + Buffer.from("nhavbnm:feffd4ec-afd5-11ea-b23e-0242ac150003").toString("base64"),
            "Content-Type": "application/json",
            "Content-Length": bodyString.length
        }
    };

    let httpreq = https.request(options, function(httpres) {
        let str = "";
        httpres.on("data", function(data) { str += data; });
        httpres.on("error", function(e) { console.log("error: ", e); });
        httpres.on("end", function() {
            console.log("response: ", str);
            res.send(str);
        });
    });

    httpreq.on("error", function(e) { console.log("request error: ", e); });
    httpreq.end(bodyString);
})

//------------------------
var mangUser = []; //
var mangUserx = []; //
var mangRom = []; //
var x = 0; //
//-----------------------
function search(nameKey, expext) {
    for (var i = 0; i < mangUser.length; i++) {
        if (mangUser[i].IDND == nameKey && mangUser[i].IDND != expext) {

            return mangUser[i];

        }
    }

    //return 0;
}

console.log("server running...");


io.on("connection", function(socket) {
    console.log("co nguoi ket noi" + socket.id);
    socket.broadcast.emit('server-send-listus', mangUser)

    //----------------video call-----------------------
    mangUserx.push(socket.id);
    // convenience function to log server messages on the client
    function log() {
        var array = ['Message from server:'];
        array.push.apply(array, arguments);
        socket.emit('log', array);
    }

    socket.on('message', function(message) {
        socket.broadcast.emit('message', message);
        log('Client said: ', message);
        // for a real app, would be room-only (not broadcast)
        console.log("message " + socket.id + "-" + message)
    });

    socket.on("request_to",function(data) {
        //data = {IDNG,Avt,name}
        console.log(data.IDNN)
        mangUser.forEach(element => {
            if (data.IDNN == element.IDND) {
                socket.to(element.IDN).emit("s_request",{IDS:'"+data.IDNG+"',Avt:'"+data.Avt+"',name:"+data.name+"})
                
            }
        });
    })

    socket.on("c_an_request_to",function(data){
        F_IDN="";
        mangUser.forEach(element => {
            if (element.IDND==data.IDNN) {
                F_IDN=element.IDN;
            }
        });
        if (F_IDN!=="") {
            if (data.isAccept==true) {
                socket.to(F_IDN).emit("sv_an_request_to","{isAccept:true}")
            }
            else{
                socket.to(F_IDN).emit("sv_an_request_to","{isAccept:false}")
            }
        }
        
    })

    socket.on("create", function(data) {
        mangRom.push({ 'room': data, 'us': [socket.id] })
        console.log(mangRom);
        for (let index = 0; index < mangRom.length; index++) {
            if (data == mangUserx[index].room) {
                log('Room ' + room + ' now has ' + mangUserx[index].us.length + ' client(s)')
            }

        }
        socket.emit('created', data, socket.id);

    })

    socket.on("join", function(data) {
        log('Client ID ' + socket.id + ' joined room ' + data);
        // io.sockets.in(room).emit('join', room);
        // socket.join(room);
        // socket.emit('joined', room, socket.id);
        socket.broadcast.emit("join", data)
        var i;
        for (let index = 0; index < mangRom.length; index++) {
            //const element = mangRom[index];
            if (mangRom[index].room == data) {
                mangRom[index].us.push(socket.id);
                i = index;
            }
        }
        for (let index = 0; index < mangRom[i].us.length; index++) {
            socket.to(mangRom[i].us[index]).emit('ready');
        }
        socket.emit('joined', data, socket.id);
        console.log(mangRom);
    })

    socket.on('create or join', function(room) {
        console.log("rom: " + room)
        log('Received request to create or join room ' + room);

        var numClients = mangUserx.length;
        log('Room ' + room + ' now has ' + numClients + ' client(s)');
        console.log('Room ' + room + ' now has ' + numClients + ' client(s)');

        if (numClients === 1) {
            socket.join(room);
            log('Client ID ' + socket.id + ' created room ' + room);
            console.log('Client ID ' + socket.id + ' created room ' + room);
            socket.emit('created', room, socket.id);

        } else if (numClients === 2) {
            log('Client ID ' + socket.id + ' joined room ' + room);
            io.sockets.in(room).emit('join', room);
            socket.join(room);
            socket.emit('joined', room, socket.id);
            io.sockets.in(room).emit('ready');
        } else { // max 5 clients
            socket.emit('full', room);
        }
    });

    socket.on('ipaddr', function() {
        log('Client said: ipaddr');
        var ifaces = os.networkInterfaces();
        for (var dev in ifaces) {
            ifaces[dev].forEach(function(details) {
                if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
                    socket.emit('ipaddr', details.address);
                }
            });
        }
    });

    //---------------------------------------------------------------------------------

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
        if (mangRom.length != 0) {
            for (let index = 0; index < mangUser.length; index++) {
                if (mangUser[index] == socket.id) {
                    mangUser.splice(index, 1);
                }

            }
            for (let index = 0; index < mangRom.length; index++) {
                for (let j = 0; j < mangRom[index].us.length; j++) {

                    if (mangRom[index].us[j] == socket.id) {
                        mangRom[index].us.splice(j, 1);
                    }
                }


            }
            for (let index = 0; index < mangRom.length; index++) {
                if (mangRom[index].us.length == 0) {
                    mangRom.splice(index, 1);
                }

            }
        }
        console.log(mangRom)

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