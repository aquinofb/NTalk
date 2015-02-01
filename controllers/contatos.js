module.exports = function(app) {
	var Usuario = app.models.usuario;

	var ContatosController = {
		index: function(request, response) {
			var _id = request.session.usuario._id;
			Usuario.findById(_id, function(erro, usuario) {
				var resultado = {contatos: usuario.contatos};
				response.render('contatos/index', resultado);
			});
		},
		create: function(request, response) {
			var _id = request.session.usuario._id;
		  Usuario.findById(_id, function(erro, usuario) {
		    var contato = request.body.contato;
		    var contatos = usuario.contatos;
		    contatos.push(contato);
		    usuario.save(function() {
		      response.redirect('/contatos');
		    });
			});
		},
		show: function(request, response) {
			var _id = request.session.usuario._id;
		  Usuario.findById(_id, function(erro, usuario) {
		    var contatoID = request.params.id;
		    var contato = usuario.contatos.id(contatoID);
		    var resultado = { contato: contato };
		    response.render('contatos/show', resultado);
			});
		},
		edit: function(request, response) {
			var _id = request.session.usuario._id;
		  Usuario.findById(_id, function(erro, usuario) {
		    var contatoID = request.params.id;
		    var contato = usuario.contatos.id(contatoID);
		    var resultado = { contato: contato };
		    response.render('contatos/edit', resultado);
		  });
		},
		update: function(request, response) {
			var _id = request.session.usuario._id;
		  Usuario.findById(_id, function(erro, usuario) {
		    var contatoID = request.params.id;
		    var contato = usuario.contatos.id(contatoID);
		    contato.nome = request.body.contato.nome;
		    contato.email = request.body.contato.email;
		    usuario.save(function() {
		      response.redirect('/contatos');
		    });
			});
		},
		destroy: function(request, response) {
			var _id = request.session.usuario._id;
		  Usuario.findById(_id, function(erro, usuario) {
		    var contatoID = request.params.id;
		    usuario.contatos.id(contatoID).remove();
		    usuario.save(function() {
		      response.redirect('/contatos');
		    });
		  });
		}
	};

	return ContatosController;
};