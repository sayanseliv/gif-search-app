import axios from 'axios';
import { envConfig } from '../config.js';
import { sanitizeQuery, validateGifId, validateSearchParams } from '../utils/validation.js';
import { cache, getCacheKey } from '../utils/cache.js';
import { handleApiError } from '../middleware/errorHandlers.js';
import { createErrorResponse } from '../utils/errorUtils.js';

const config = envConfig[process.env.NODE_ENV || 'development'];
const API_KEY = config.GIPHY_API_KEY;
const CACHE_TTL = 5 * 60 * 1000;

// Search GIFs
export const searchGifs = async (req, res) => {
	try {
		const validation = validateSearchParams(req.query);
		if (!validation.isValid) {
			return res.status(400).json(createErrorResponse(validation.errors));
		}

		const { q, limit, offset } = validation.data;

		const sanitizedQuery = sanitizeQuery(q);

		const cacheKey = getCacheKey('search', { q: sanitizedQuery, limit, offset });
		const cachedResult = cache.get(cacheKey);

		if (cachedResult) {
			console.log(`Cache hit for search: ${sanitizedQuery}`);
			return res.json(cachedResult);
		}

		const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
			params: {
				api_key: API_KEY,
				q: sanitizedQuery,
				limit,
				offset,
				rating: 'g',
				lang: 'en',
			},
			timeout: 10000,
		});

		cache.set(cacheKey, response.data, CACHE_TTL);

		res.json(response.data);
	} catch (error) {
		handleApiError(error, res, 'Failed to fetch GIFs from Giphy');
	}
};

// Get GIF details by ID
export const getGifDetails = async (req, res) => {
	try {
		const { id } = req.params;
		const validation = validateGifId(id);

		if (!validation.isValid) {
			return res.status(400).json(createErrorResponse(validation.errors));
		}

		const cacheKey = getCacheKey('gif', { id });
		const cachedResult = cache.get(cacheKey);

		if (cachedResult) {
			console.log(`Cache hit for GIF: ${id}`);
			return res.json(cachedResult);
		}

		const response = await axios.get(`https://api.giphy.com/v1/gifs/${id}`, {
			params: {
				api_key: API_KEY,
			},
			timeout: 10000,
		});

		cache.set(cacheKey, response.data, CACHE_TTL * 2);

		res.json(response.data);
	} catch (error) {
		handleApiError(error, res, 'Failed to fetch GIF details from Giphy');
	}
};

// Get search suggestions (for autocomplete input)
export const getSuggestions = async (req, res) => {
	try {
		const validation = validateSearchParams(req.query, { isForSuggestions: true });
		if (!validation.isValid) {
			return res.status(400).json(createErrorResponse(validation.errors));
		}

		const { q, limit } = validation.data;
		const sanitizedQuery = sanitizeQuery(q);

		const cacheKey = getCacheKey('suggestions', { q: sanitizedQuery, limit });
		const cachedResult = cache.get(cacheKey);

		if (cachedResult) {
			console.log(`Cache hit for suggestions: ${sanitizedQuery}`);
			return res.json(cachedResult);
		}

		const response = await axios.get('https://api.giphy.com/v1/gifs/search/tags', {
			params: {
				api_key: API_KEY,
				q: sanitizedQuery,
				limit,
			},
			timeout: 5000,
		});

		cache.set(cacheKey, response.data, CACHE_TTL * 3);

		res.json(response.data);
	} catch (error) {
		handleApiError(error, res, 'Failed to fetch suggestions from Giphy');
	}
};
