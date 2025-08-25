class SimpleCache {
	constructor() {
		this.cache = new Map();
		this.timers = new Map();
	}

	set(key, value, ttl = 5 * 60 * 1000) {
		// Clean timer
		if (this.timers.has(key)) {
			clearTimeout(this.timers.get(key));
		}

		// Save data
		this.cache.set(key, {
			value,
			timestamp: Date.now(),
			ttl,
		});

		// set timer for autodelete
		const timer = setTimeout(() => {
			this.delete(key);
		}, ttl);

		this.timers.set(key, timer);
	}

	get(key) {
		const item = this.cache.get(key);

		if (!item) {
			return null;
		}

		// check TTL
		if (Date.now() - item.timestamp > item.ttl) {
			this.delete(key);
			return null;
		}

		return item.value;
	}

	delete(key) {
		// Clean timer
		if (this.timers.has(key)) {
			clearTimeout(this.timers.get(key));
			this.timers.delete(key);
		}

		this.cache.delete(key);
	}

	clear() {
		// Clean all timers
		for (const timer of this.timers.values()) {
			clearTimeout(timer);
		}

		this.timers.clear();
		this.cache.clear();
	}

	// Get stats of cache
	getStats() {
		return {
			size: this.cache.size,
			keys: Array.from(this.cache.keys()),
		};
	}

	// clear expired records
	cleanup() {
		const now = Date.now();
		const keysToDelete = [];

		for (const [key, item] of this.cache.entries()) {
			if (now - item.timestamp > item.ttl) {
				keysToDelete.push(key);
			}
		}

		keysToDelete.forEach((key) => this.delete(key));

		console.log(`Cache cleanup: removed ${keysToDelete.length} expired items`);
	}
}

export const cache = new SimpleCache();

// Generate cache keys
export const getCacheKey = (type, params) => {
	const sortedParams = Object.keys(params)
		.sort()
		.map((key) => `${key}:${params[key]}`)
		.join('|');

	return `${type}:${sortedParams}`;
};

setInterval(() => {
	cache.cleanup();
}, 10 * 60 * 1000);

process.on('SIGTERM', () => {
	console.log('Clearing cache on shutdown...');
	cache.clear();
});

process.on('SIGINT', () => {
	console.log('Clearing cache on shutdown...');
	cache.clear();
});
