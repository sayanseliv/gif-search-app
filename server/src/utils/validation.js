const MAX_LIMIT = 50;
const MAX_QUERY_LENGTH = 100;
const DEFAULT_LIMIT = 10;
const DEFAULT_SUGGESTIONS_LIMIT = 5;

// Search query sanitization
export const sanitizeQuery = (query) => {
	if (typeof query !== 'string') {
		return '';
	}

	return query
		.trim()
		.substring(0, MAX_QUERY_LENGTH) // Length limitation
		.replace(/[<>'"&]/g, '') // Removing Potentially Dangerous Characters
		.replace(/\s+/g, ' '); // Normalizing whitespace
};

export const validateSearchParams = (params, options = {}) => {
	const errors = [];
	const { q, limit, offset } = params;
	const { isForSuggestions = false } = options;

	// validate query
	if (!q || typeof q !== 'string') {
		errors.push('Query parameter "q" is required and must be a string');
	} else if (q.trim().length === 0) {
		errors.push('Query parameter "q" cannot be empty');
	} else if (q.length > MAX_QUERY_LENGTH) {
		errors.push(`Query parameter "q" cannot exceed ${MAX_QUERY_LENGTH} characters`);
	}

	// validate limit
	let validLimit = isForSuggestions ? DEFAULT_SUGGESTIONS_LIMIT : DEFAULT_LIMIT;

	if (limit !== undefined) {
		const numLimit = parseInt(limit, 10);
		if (isNaN(numLimit) || numLimit < 1) {
			errors.push('Limit must be a positive integer');
		} else if (numLimit > MAX_LIMIT) {
			errors.push(`Limit cannot exceed ${MAX_LIMIT}`);
		} else {
			validLimit = numLimit;
		}
	}

	// validate offset
	let validOffset = 0;
	if (!isForSuggestions && offset !== undefined) {
		const numOffset = parseInt(offset, 10);
		if (isNaN(numOffset) || numOffset < 0) {
			errors.push('Offset must be a non-negative integer');
		} else if (numOffset > 10000) {
			errors.push('Offset cannot exceed 10000');
		} else {
			validOffset = numOffset;
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
		data: {
			q: sanitizeQuery(q),
			limit: validLimit,
			...(isForSuggestions ? {} : { offset: validOffset }),
		},
	};
};

// Validate ID GIF
export const validateGifId = (id) => {
	const errors = [];

	if (!id || typeof id !== 'string') {
		errors.push('GIF ID is required and must be a string');
	} else if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
		errors.push('Invalid GIF ID format');
	} else if (id.length > 50) {
		errors.push('GIF ID too long');
	}

	return {
		isValid: errors.length === 0,
		errors,
		data: { id: id?.trim() },
	};
};
