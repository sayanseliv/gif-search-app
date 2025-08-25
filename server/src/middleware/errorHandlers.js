import {
	API_ERROR_TYPES,
	createErrorResponse,
	getErrorType,
	getUserMessage,
	logError,
} from '../utils/errorUtils.js';

// Middleware for global errors
export const globalErrorHandler = (err, req, res, next) => {
	logError(err, `Global handler - ${req.method} ${req.url}`);

	if (res.headersSent) {
		return next(err);
	}

	const errorType = getErrorType(err);
	const userMessage = getUserMessage(errorType, 'Internal server error');
	const statusCode = err.status || err.statusCode || 500;

	res.status(statusCode).json(createErrorResponse(userMessage, errorType));
};

// Middleware for 404
export const notFoundHandler = (req, res) => {
	const message = `Route ${req.method} ${req.url} not found`;
	logError(new Error(message), 'Route not found');

	res.status(404).json(createErrorResponse('Route not found', API_ERROR_TYPES.NOT_FOUND));
};

// API error handling
export const handleApiError = (error, res, defaultMessage = 'An error occurred') => {
	const errorType = getErrorType(error);
	const userMessage = getUserMessage(errorType, defaultMessage);

	logError(error, defaultMessage);

	let statusCode = 500;
	if (error.response) statusCode = error.response.status;
	else if (errorType === API_ERROR_TYPES.TIMEOUT) statusCode = 408;
	else if (errorType === API_ERROR_TYPES.NETWORK) statusCode = 503;

	res.status(statusCode).json(createErrorResponse(userMessage, errorType));
};
