import express from 'express';
import { uploadStory, getStories } from '../controllers/storyController.js';
import { isAuth } from '../middlewares/isAuth.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.post('/upload', isAuth, upload.single('file'), uploadStory); 
router.get('/', isAuth, getStories); 

export default router;
