var app = require('./app');

// SOCKETS //
var server = require('http').Server(app);
var io = require('socket.io')(server);

var session = io.of('/session');
var course = io.of('/course');

// io.sockets.on('connection', function(socket) {
//   console.log("joined main thing");
// });

io.sockets.on('connection', function(socket){

    socket.on("joined session", function(data) {
      console.log("\n\n\n joined session \n\n\n");
      socket.join("session-" + data.sessionId); // join a room named after this session
      io.to("course-" + data.courseNumber).emit('joined session', {"sessionId" : data.sessionId});
    });

    socket.on("left session", function(data) {
      console.log("\n\n\n left session \n\n\n");
      socket.leave("session-" + data.sessionId); // join a room named after this session
      io.to("course-" + data.courseNumber).emit('left session', {"sessionId" : data.sessionId});
    });

    // fired when a snippet is saved
    socket.on("saved snippet", function(data) {
      io.to("session-" + data.sessionId).emit('saved snippet', {"snippetId" : data.snippetId});
    });

    // fired when a snippet is added
    socket.on("added snippet", function(data) {
      io.to("session-" + data.sessionId).emit('added snippet', {"snippet" : data.snippet});
    });

    // fired when a snippet is removed
    socket.on("removed snippet", function(data) {
      io.to("session-" + data.sessionId).emit('removed snippet', {"snippetId" : data.snippetId});
    });

    socket.on("joined course page", function(data) {
      socket.join("course-" + data.courseNumber); // join a room named after this session
      sessionData = {};
      // find the number of people currently in each of the rooms
      for(i=0;i<data.sessions.length;i++) {
        room = "session-" + data.sessions[i]._id;
        if(io.sockets.adapter.rooms[room]) {
          sessionData[data.sessions[i]._id] = Object.keys(io.sockets.adapter.rooms[room]).length;
        } else {
          sessionData[data.sessions[i]._id] = 0;
        }
      }
      io.to("course-" + data.courseNumber).emit('session data loaded', {"occupancy" : sessionData});
    });

    socket.on("left course page", function(data) {
      socket.leave("course-" + data.courseNumber); // join a room named after this session
    });

    socket.on("new session", function(data) {
      io.to("course-" + data.courseNumber).emit('new session', {"session" : data.session});
    });

    socket.on("disconnect", function() {
        for (var room in socket.adapter.rooms) {
          if (room.indexOf("session") === 0) {io.emit('left session', {"sessionId" : room.substring(8, room.length)});}
        }
    });

});




module.exports = server;
