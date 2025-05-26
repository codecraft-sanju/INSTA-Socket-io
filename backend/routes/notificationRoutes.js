import express from 'express';
import {
  getNotifications,
  markAsRead,
  deleteNotification,
  markAllAsRead,
} from '../controllers/notificationController.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.get('/:userId', isAuth, getNotifications);
router.put('/read/:id', isAuth, markAsRead);
router.delete('/:id', isAuth, deleteNotification);
router.put('/mark-all-read', isAuth, markAllAsRead);

export default router;
