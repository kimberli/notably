var server = require('./server/socket');
var port = process.env.PORT || 5000;

server.listen(port, function() {
    console.log("running at localhost:" + port);
});
