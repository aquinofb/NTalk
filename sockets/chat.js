module.exports = function(io) {
	var crypto = require('crypto')
			, redis = require('redis').createClient()
			, sockets = io.sockets
			, onlines = {};

	sockets.on('connection', function(client) {
		var session = client.handshake.session
				, usuario = session.usuario;

		redis.sadd('onlines', usuario.email, function(erro) {
			redis.smembers('onlines', function(erro, emails) {
				emails.forEach(function(email) {
					client.emit('notify-offlines', email);
					client.broadcast.emit('notify-offlines', email);
				});
			});
		});

		client.on('join', function(sala) {
			if (!sala) {
				var timestamp = new Date().toString()
						, md5 = crypto.createHash('md5');

				sala = md5.update(timestamp).digest('hex');
			}

			session.sala = sala;
			client.join(sala);

			var msg = '<b>' + usuario.nome + "</b entrou.<br />";
			redis.lpush(sala, msg, function(erro, res) {
				redis.lrange(sala, 0, -1, function(erro, msgs) {
					msgs.forEach(function(msg) {
						sockets.in(sala).emit('send-client', msg);
					});
				});
			})
		});

		client.on('disconnect', function() {
			var sala = session.sala
		    	, msg = "<b>"+ usuario.nome +":</b> saiu.<br>";

		  redis.lpush(sala, msg);

		  client.broadcast.emit('notify-offlines', usuario.email);
		  sockets.in(sala).emit('send-client', msg);
		  redis.srem('onlines', usuario.email);
		  client.leave(sala);
		});

	  client.on('send-server', function(msg) {
	  	var sala = session.sala
	  			, data = {email: usuario.email, sala: sala};

	    msg = "<b>" + usuario.nome + ": " + msg + "<br />";
	    redis.lpush(sala, msg);

	    client.broadcast.emit('new-message', data);
	    sockets.in(sala).emit('send-client', msg);
	  });
	});
}