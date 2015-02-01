module.exports = function(app) {
	var autenticar = require('./../middlewares/autenticador')
			, contatos = app.controllers.contatos;

	app.get('/contatos', autenticar, contatos.index);
	app.get('/contatos/:id', autenticar, contatos.show);
	app.post('/contatos', autenticar, contatos.create);
	app.get('/contatos/:id/editar', autenticar, contatos.edit);
	app.put('/contatos/:id', autenticar, contatos.update);
	app.delete('/contatos/:id', autenticar, contatos.destroy);
};