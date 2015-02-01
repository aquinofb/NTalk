module.exports = function(app) {
	var Usuario = app.models.usuario;

	var HomeController = {
		index: function(request, response) {
			response.render('home/index');
		},
		login: function(request, response) {
			var query = {email: request.body.usuario.email};
			Usuario.findOne(query)
						 .select('nome email')
						 .exec(function(erro, usuario) {
						 	if (usuario) {
						 		request.session.usuario = usuario;
						 		response.redirect('/contatos');
						 	} else {
						 		var usuario = request.body.usuario;
						 		Usuario.create(usuario, function(erro, usuario) {
						 			if (erro) {
						 				response.redirect('/');
						 			} else {
						 				request.session.usuario = usuario;
						 				response.redirect('/contatos');
						 			}
						 		});
						 	}
						 });
		},
		logout: function(request, response) {
			request.session.destroy();
			response.redirect('/');
		}
	};

	return HomeController;
}