var app = require('./app');

// SOCKETS //
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.sockets.on('connection', function(socket){

    socket.on("joined session", function(data) {
      console.log("joined room");
      socket.join(data.sessionId); // join a room named after this session
    });

    socket.on("left session", function(data) {
      console.log("left room");
      socket.leave(data.sessionId); // join a room named after this session
    });

    // fired when a snippet is saved
    socket.on("saved snippet", function(data) {
      io.to(data.sessionId).emit('saved snippet', {"snippetId" : data.snippetId});
    });

    // fired when a snippet is added
    socket.on("added snippet", function(data) {
      io.to(data.sessionId).emit('added snippet', {"snippet" : data.snippet});
    });

    // fired when a snippet is removed
    socket.on("removed snippet", function(data) {
      io.to(data.sessionId).emit('removed snippet', {"snippetId" : data.snippetId});
    });

});



module.exports = server;
