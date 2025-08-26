import express from 'express';
import gifRouter from './gifs.js';
import { globalErrorHandler, notFoundHandler } from '../middleware/errorHandlers.js';
import { getGifDetails } from '../controllers/gifsController.js';

const router = express.Router();

router.get('/', (req, res) => {
	res.json({
		success: true,
		message: 'GIF Search API is working!',
		timestamp: new Date().toISOString(),
		version: '1.0.0',
	});
});

router.use('/gifs', gifRouter);
// router.get('/gif/:id', getGifDetails);

router.use(notFoundHandler);

router.use(globalErrorHandler);

export default router;
