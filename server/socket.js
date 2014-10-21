// A standalone socket.io reflector server.

var io = require('socket.io')(),
    config = require('./config');

io.on('connect', function(socket) {
  // All connections on the same hostname will talk to each other,
  // but the room=X url parameter can be supplied to set a specific room.
  var host = socket.handshake.headers.host.split(':').shift();
  var room = socket.handshake.query.room || '';
  var hroom = host + '-' + room;
  socket.join(hroom);

  // Overriding onevent allows us to reflect every type of packet.
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

if (config.gid) { process.setgid(config.gid); }
if (config.uid) { process.setuid(config.uid); }
console.log('Socket.io server listening on ' + process.env.PORT +
    ' with uid ' + process.getuid());
