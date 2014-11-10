// A standalone socket.io reflector server.

var DynamicServer = require('dynamic.io'),
    debug = require('debug')('reflector-socket.io'),
    config = require('./config');

io = DynamicServer({
  host: process.env.HOST,         // Enable virtual host handling
  publicStatus: true              // Enable /socket.io/status page.
});
io.setupNamespace('*', function(nsp) {
  nsp.on('connect', function(socket) {
    debug('connecting socket %s in nsp %s', socket.id, socket.nsp.fullname());
    // All connections on the same host will talk to each other,
    // but the room=X url parameter can be supplied to set a specific room.
    var room = socket.handshake.query.room || null;
    if (room) {
      socket.join(room);
    }

    // Overriding onevent allows us to reflect every type of packet.
    socket.onevent = function(packet) {
      debug('got', packet);
      var args = packet.data || [];
      if (null != packet.id) {
        args.push(this.ack(packet.id));
      }
      var s = socket.nsp;
      if (room) {
        s = s.to(room);
      }
      debug('reflecting', args, 'to', socket.nsp.fullname(), room || '');
      s.emit.apply(s, args);
    }
  });
});
io.listen(process.env.PORT);

if (config.gid) { process.setgid(config.gid); }
if (config.uid) { process.setuid(config.uid); }
console.log('Socket.io server listening on ' + process.env.PORT +
    ' (' + process.env.HOST + ') with uid ' + process.getuid());
