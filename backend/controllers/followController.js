import { User } from '../models/userModel.js';
import { createNotification } from '../utils/createNotification.js';


//Follow a user
export const followUser = async (req, res) => {
  try {
    const userToFollowId = req.params.id;
    const currentUserId = req.user._id.toString();

    if (userToFollowId === currentUserId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const [userToFollow, currentUser] = await Promise.all([
      User.findById(userToFollowId),
      User.findById(currentUserId),
    ]);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userToFollow.followers.includes(currentUserId)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    userToFollow.followers.push(currentUserId);
    currentUser.following.push(userToFollowId);

    await Promise.all([userToFollow.save(), currentUser.save()]);

    // Create follow notification
    await createNotification(userToFollowId, currentUserId, 'follow');

    res.status(200).json({
      message: 'User followed successfully',
      followersCount: userToFollow.followers.length,
      followingCount: currentUser.following.length,
    });
  } catch (error) {
    console.error('Follow Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Unfollow user (similarly add improvements)
export const unfollowUser = async (req, res) => {
  try {
    const userToUnfollowId = req.params.id;
    const currentUserId = req.user._id.toString();

    const [userToUnfollow, currentUser] = await Promise.all([
      User.findById(userToUnfollowId),
      User.findById(currentUserId),
    ]);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!userToUnfollow.followers.includes(currentUserId)) {
      return res
        .status(400)
        .json({ message: "You're not following this user" });
    }

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUserId,
    );
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollowId,
    );

    await Promise.all([userToUnfollow.save(), currentUser.save()]);

    res.status(200).json({
      message: 'User unfollowed successfully',
      followersCount: userToUnfollow.followers.length,
      followingCount: currentUser.following.length,
    });
  } catch (error) {
    console.error('Unfollow Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get followers of a user
export const getFollowers = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate(
      'followers',
      'username profilePicture',
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.followers);
  } catch (error) {
    console.error('Get Followers Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get following of a user
export const getFollowing = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate(
      'following',
      'username profilePicture',
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.following);
  } catch (error) {
    console.error('Get Following Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
//  Get both followers and following of a user
export const getFollowersAndFollowing = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .populate('followers', 'username name profilePicture')
      .populate('following', 'username name profilePicture');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      followers: user.followers || [],
      following: user.following || [],
    });
  } catch (error) {
    console.error('Get Followers & Following Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

