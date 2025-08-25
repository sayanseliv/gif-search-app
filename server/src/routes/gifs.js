import express from 'express';
import { getGifDetails, getSuggestions, searchGifs } from '../controllers/gifsController.js';

const router = express.Router();

router.get('/search', searchGifs);

router.get('/gif/:id', getGifDetails);

router.get('/suggestions', getSuggestions);

export default router;
