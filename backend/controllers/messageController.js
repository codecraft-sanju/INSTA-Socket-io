import { Message } from '../models/messageModel.js';
import { User } from '../models/userModel.js';

// Send a new message
export const createMessage = async (req, res) => {
  try {
    const { recipientId, text } = req.body;

    if (!recipientId || !text) {
      return res
        .status(400)
        .json({ message: 'Recipient ID and text are required' });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient user not found' });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      text,
    });

    res.status(201).json({
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (error) {
    console.error('Create Message Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all messages between two users (chat history)
export const getMessagesBetweenUsers = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: userId },
        { sender: userId, recipient: req.user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'username profilePicture')
      .populate('recipient', 'username profilePicture');

    res.status(200).json(messages);
  } catch (error) {
    console.error('Get Messages Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all users with whom the current user had conversations
export const getAllConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    });

    const conversationUserIds = new Set();

    messages.forEach((msg) => {
      if (msg.sender.toString() !== userId.toString()) {
        conversationUserIds.add(msg.sender.toString());
      }
      if (msg.recipient.toString() !== userId.toString()) {
        conversationUserIds.add(msg.recipient.toString());
      }
    });

    const users = await User.find({
      _id: { $in: Array.from(conversationUserIds) },
    }).select('username profilePicture');

    res.status(200).json(users);
  } catch (error) {
    console.error('Get Conversations Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
