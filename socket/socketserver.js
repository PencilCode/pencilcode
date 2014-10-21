var io = require('socket.io')();
io.on('connect', function(socket) {
  var host = socket.handshake.headers.host.split(':').shift();
  var room = socket.handshake.query.room || '';
  var hroom = host + '-' + room;
  socket.join(hroom);
  socket.onevent = function(packet) {
    var args = packet.data || [];
    if (null != packet.id) {
      args.push(this.ack(packet.id));
    }
    var s = socket.nsp.to(hroom);
    console.log('sending', args, 'to', hroom);
    s.emit.apply(s, args);
  }
});
io.listen(process.env.PORT);
console.log('Socket.io server listening on ' + process.env.PORT);
