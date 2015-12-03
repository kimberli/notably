var app = require('./app');

// SOCKETS //
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.sockets.on('connection', function(socket){

  // load the number of sockets present in each session into an object
    var loadSessionOccupancy = function() {
        var sessionData = {};
        for (var room in io.sockets.adapter.rooms) {
            if (room.indexOf("session-") === 0) {  // check if it's a session and find the number of sockets in it
                sessionData[room.substring(8, room.length)] = Object.keys(io.sockets.adapter.rooms[room]).length;
            }
        }
        return sessionData;
    }

    // fired when a user joins a session, update occupancy for everyone (it doesnt hurt!)
    socket.on("joined session", function(data) {
        socket.join("session-" + data.sessionId); // join a room named after this session
        io.emit('session data loaded', {"occupancy" : loadSessionOccupancy()});
    });

    // fired when a user leaves a session, update occupancy for everyone (it doesnt hurt!)
    socket.on("left session", function(data) {
        socket.leave("session-" + data.sessionId); // join a room named after this session
        io.emit('session data loaded', {"occupancy" : loadSessionOccupancy()});
    });

    // fired when a snippet is saved
    socket.on("saved snippet", function(data) {
        Stash.saveSnippet(data.snippetId, data.stashId, function(err,result) {
            if (err) {
                io.to(socket.id).emit('error', {"message" : err});
            } else {
                io.to("session-" + data.sessionId).emit('saved snippet', {"snippetId" : data.snippetId, "username" : data.username});
            }
        });
    });

    // fired when a snippet is flagged
    socket.on("flagged snippet", function(data) {
        Snippet.flagSnippet(data.snippetId, data.username, function(err,result) {
            if (err) {
                io.to(socket.id).emit('error', {"message" : err});
            } else {
                io.to("session-" + data.sessionId).emit('flagged snippet', {"snippetId" : data.snippetId, "username" : data.username});
            }
        });
    });

    // fired when a snippet is added
    socket.on("added snippet", function(data) {
        Session.addSnippet(data.sessionId, data.username, data.content, function(err,result) {
            if (err) {
                io.to(socket.id).emit('error', {"message" : err});
            } else {
                io.to("session-" + data.sessionId).emit('added snippet', {"snippet" : result});
            }
        });
    });

    // fired when a snippet is removed
    socket.on("removed snippet", function(data) {
        Stash.removeSnippet(data.snippetId, data.stashId, function(err,result) {
            if (err) {
                io.to(socket.id).emit('error', {"message" : err});
            } else {
                io.to("session-" + data.sessionId).emit('removed snippet', {"snippetId" : data.snippetId, "username" : data.username});
            }
        });
    });

    // fired when a user joins the course page, update occupancy
    socket.on("joined course page", function(data) {
        socket.join("course-" + data.courseNumber); // join a room named after this session
        io.to("course-" + data.courseNumber).emit('session data loaded', {"occupancy" : loadSessionOccupancy()});
    });

    // fired when a user leaves the course page
    socket.on("left course page", function(data) {
        socket.leave("course-" + data.courseNumber); // join a room named after this session
    });

    // fired when a user creates a new session, only update for that course
    socket.on("new session", function(data) {
        io.to("course-" + data.courseNumber).emit('new session', {"session" : data.session});
    });

    // fired when a user leaves the page, update occupancy for everyone
    socket.on("disconnect", function() {
        io.emit('session data loaded', {"occupancy" : loadSessionOccupancy()});
    });

});


module.exports = server;
