var app = require('./server');

// SOCKETS //
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){
    console.log('a user connected');
});

module.exports = server;
