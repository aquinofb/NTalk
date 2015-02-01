module.exports = function(request, response, next) {
	if (!request.session.usuario) {
		return response.redirect('/');
	}

	return next();
};