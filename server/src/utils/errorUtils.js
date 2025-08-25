// API Error Types
export const API_ERROR_TYPES = {
	RATE_LIMIT: 'RATE_LIMIT',
	INVALID_API_KEY: 'INVALID_API_KEY',
	NOT_FOUND: 'NOT_FOUND',
	TIMEOUT: 'TIMEOUT',
	NETWORK: 'NETWORK',
	VALIDATION: 'VALIDATION',
	UNKNOWN: 'UNKNOWN',
};

// Standardizing the Error Response
export const createErrorResponse = (errors, type = API_ERROR_TYPES.VALIDATION) => {
	const errorArray = Array.isArray(errors) ? errors : [errors];
	return {
		success: false,
		error: {
			type,
			messages: errorArray,
			timestamp: new Date().toISOString(),
		},
	};
};

// Error logging
export const logError = (error, context = '') => {
	const errorInfo = {
		timestamp: new Date().toISOString(),
		context,
		message: error.message,
		stack: error.stack,
		...(error.response && {
			status: error.response.status,
			statusText: error.response.statusText,
			data: error.response.data,
		}),
		...(error.code && { code: error.code }),
	};

	console.error('API Error:', JSON.stringify(errorInfo, null, 2));
};

// Determining the error type by HTTP
export const getErrorType = (error) => {
	if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') return API_ERROR_TYPES.TIMEOUT;
	if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') return API_ERROR_TYPES.NETWORK;

	if (error.response) {
		switch (error.response.status) {
			case 401:
			case 403:
				return API_ERROR_TYPES.INVALID_API_KEY;
			case 404:
				return API_ERROR_TYPES.NOT_FOUND;
			case 429:
				return API_ERROR_TYPES.RATE_LIMIT;
			default:
				return API_ERROR_TYPES.UNKNOWN;
		}
	}

	return API_ERROR_TYPES.UNKNOWN;
};

// Getting a custom error message
export const getUserMessage = (errorType, defaultMessage) => {
	const messages = {
		[API_ERROR_TYPES.RATE_LIMIT]: 'Too many requests. Please wait a moment and try again.',
		[API_ERROR_TYPES.INVALID_API_KEY]:
			'API service temporarily unavailable. Please try again later.',
		[API_ERROR_TYPES.NOT_FOUND]: 'The requested GIF was not found.',
		[API_ERROR_TYPES.TIMEOUT]: 'Request timed out. Please check your connection and try again.',
		[API_ERROR_TYPES.NETWORK]: 'Network error. Please check your connection and try again.',
		[API_ERROR_TYPES.VALIDATION]: 'Invalid request parameters.',
		[API_ERROR_TYPES.UNKNOWN]:
			defaultMessage || 'An unexpected error occurred. Please try again.',
	};

	return messages[errorType];
};
