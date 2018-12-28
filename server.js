const express = require('express');
const MongoClient = require('mongodb');
const bodyParser = require('body-parser');
var db = require('./config/db');
var app = express();


const port = 8000;
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




//var server = require('http').createServer(app).listen(port);
//var io = require('socket.io').listen(server);

/*
io.sockets.on('connection', function(client){

    console.log("client connected: " + client.id);

    client.on("sendTo", function(chatMessage){
        console.log("Message From: " + chatMessage.fromName);
        console.log("Message To: " + chatMessage.toName);


        io.sockets.socket(chatMessage.toClientID).emit("chatMessage", {"fromName" : chatMessage.fromName,
            "toName" : chatMessage.toName,
            "toClientID" : chatMessage.toClientID,
            "msg" : chatMessage.msg});

    });
});
*/
MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err)


    db = database.db("getremp")
    require('./app/routes')(app, db);



        app.listen(process.env.PORT || 3000, () => {

            console.log('We are live on ' + port);
        });

})