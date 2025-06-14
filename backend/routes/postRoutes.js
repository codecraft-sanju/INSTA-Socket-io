import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { upload } from '../config/multerConfig.js';
import {
  createPost,
  getAllPosts,
  getUserPosts,
  deletePost,
  getFeedPosts,
  toggleLikePost,
  getLikesOfPost,
} from '../controllers/postController.js';

const router = express.Router();

router.post('/create', isAuth, upload.single('file'), createPost);
router.get('/', isAuth, getAllPosts); 
router.get('/user/:userId', isAuth, getUserPosts); 
router.delete('/:postId', isAuth, deletePost);
router.get('/feed', isAuth, getFeedPosts);
router.put('/:postId/like', isAuth, toggleLikePost);
router.get('/:postId/likes', isAuth, getLikesOfPost);



export default router;
