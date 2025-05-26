import express from 'express';
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowersAndFollowing,
} from '../controllers/followController.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();
router.post('/follow/:id', isAuth, followUser);
router.delete('/unfollow/:id', isAuth, unfollowUser);
router.get('/followers/:id', isAuth, getFollowers);
router.get('/following/:id', isAuth, getFollowing);
router.get('/all/:id', isAuth, getFollowersAndFollowing);


export default router;
