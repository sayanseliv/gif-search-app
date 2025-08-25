import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import router from './src/routes/index.js';

import { envConfig } from './src/config.js';
import { globalErrorHandler } from './src/middleware/errorHandlers.js';

const environment = process.env.NODE_ENV || 'development';
const config = envConfig[environment];

const app = express();
const PORT = config.portServer || 5000;

app.use(cors());
app.use(helmet());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Middleware for logging requests
app.use((req, res, next) => {
	const start = process.hrtime();
	const getDurationInMs = (start) => {
		const NS_PER_SEC = 1e9;
		const NS_TO_MS = 1e6;
		const diff = process.hrtime(start);
		return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
	};

	res.on('finish', () => {
		const duration = getDurationInMs(start).toFixed(2);
		const logLevel = res.statusCode >= 400 ? 'ERROR' : 'INFO';
		console.log(
			`[${logLevel}] ${new Date().toISOString()} ${req.ip} ${req.method} ${req.url} ${
				res.statusCode
			} ${duration}ms`
		);
	});

	next();
});

app.use('/api/v1', router);

// Global error handler
app.use(globalErrorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception:', err);
	// Graceful shutdown
	process.exit(1);
});

// Graceful shutdown
const gracefulShutdown = () => {
	console.log('Received shutdown signal, closing server gracefully...');
	process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

app.listen(PORT, () => {
	console.log(`🚀 Server running on http://${config.hostServer}:${PORT}`);
	console.log(`📚 API Documentation: http://${config.hostServer}:${PORT}/api/v1`);
});
