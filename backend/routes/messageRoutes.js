import express from 'express';
import {
  createMessage,
  getMessagesBetweenUsers,
  getAllConversations,
} from '../controllers/messageController.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.post('/', isAuth, createMessage);
router.get('/:userId', isAuth, getMessagesBetweenUsers);
router.get('/', isAuth, getAllConversations);

export default router;
