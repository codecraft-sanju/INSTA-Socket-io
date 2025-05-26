import { Comment } from '../models/commentModel.js';
import { Post } from '../models/postModel.js';
import { createNotification } from '../utils/createNotification.js';

// Add comment to a post
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = await Comment.create({
      user: req.user._id,
      post: postId,
      text,
    });

    // Populate user info in the created comment
    const populatedComment = await newComment.populate(
      'user',
      'username profilePicture',
    );

    // Create notification for post owner (if commenter is not the owner)
    if (post.user.toString() !== req.user._id.toString()) {
      await createNotification(post.user, req.user._id, 'comment', postId);
    }

    res.status(201).json({
      message: 'Comment added',
      comment: populatedComment,
    });
  } catch (error) {
    console.error('Add Comment Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get comments for a post
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
  } catch (error) {
    console.error('Get Comments Error:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
};


