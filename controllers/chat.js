module.exports = function(app) {
	var ChatController = {
		index: function(request, response) {
			var params = {sala: request.query.sala};

			response.render('chat/index', params);
		}
	};

	return ChatController;
};