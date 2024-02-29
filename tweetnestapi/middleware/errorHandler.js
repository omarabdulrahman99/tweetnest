const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
	const statusCode = res.statusCode ? res.statusCode : 500;

	switch (statusCode) {
		case constants.VALIDATION_ERROR:
			res.json({
				title: 'Validation Failed',
				message: err.message,
				stackTrace: err.stack,
				notif: 'error'
			});
			break;
		case constants.NOT_FOUND:
			res.json({
				title: 'Not found',
				message: err.message,
				stackTrace: err.stack,
				notif: 'error'
			});
			break;
		case constants.UNAUTHORIZED:
			res.json({
				title: 'Unauthorized',
				message: err.message,
				stackTrace: err.stack,
				notif: 'error'
			});
		case constants.FORBIDDEN:
			res.json({
				title: 'Forbidden',
				message: err.message,
				stackTrace: err.stack,
				notif: 'error'
			});
		case constants.SERVER_ERROR:
			res.json({
				title: 'Server Error',
				message: err.message,
				stackTrace: err.stack,
				notif: 'error'
			});
		default:
			res.json({
				title: 'Failed',
				message: err.message,
				stackTrace: err.stack,
				notif: 'error'
			});
			break;
	};
}
module.exports = errorHandler;