import { Notification } from '../models/notificationModel.js';

export const createNotification = async (
  recipientId,
  senderId,
  type,
  postId = null,
) => {
  try {
    const existing = await Notification.findOne({
      recipient: recipientId,
      sender: senderId,
      type,
      post: postId,
      isRead: false,
    });

    if (existing) return;

    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type,
      post: postId,
    });

    await notification.save();
  } catch (error) {
    console.error('Error creating notification:', error.message);
  }
};
