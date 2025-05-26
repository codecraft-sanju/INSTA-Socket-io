import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { usePost } from '../context/PostContext';
import LikesModal from './likesModal';

const Post = ({ post }) => {
  const { toggleLike, getLikesOfPost } = usePost();
  const [likes, setLikes] = useState(post.likes || []);
  const [isLiked, setIsLiked] = useState(
    post.likes?.some((user) => user._id === post.currentUserId)
  );
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likesList, setLikesList] = useState([]);

  const handleToggleLike = async () => {
    const result = await toggleLike(post._id);
    if (!result) return;

    setIsLiked(result.likedByUser);
    setLikes((prevLikes) =>
      result.likedByUser
        ? [...prevLikes, { _id: result.userId }]
        : prevLikes.filter((user) => user._id !== result.userId)
    );
  };

  const handleOpenLikesModal = async () => {
    const data = await getLikesOfPost(post._id);
    if (data) {
      setLikesList(data);
      setShowLikesModal(true);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg w-full max-w-xl mb-6 border-b border-gray-700 pb-6 mt-5">
    
      <div className="flex items-center gap-3">
        <img
          src={post.user?.profilePicture?.url || '/defaultProfilePic.jpg'}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="font-semibold">{post.user?.username}</span>
      </div>

  
      <div className="mt-3">
        <img
          src={post.image}
          alt="Post"
          className="w-full h-96 object-cover rounded-lg"
        />
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-3">
          <Heart
            size={24}
            className={`cursor-pointer transition-all duration-150 ${
              isLiked ? 'text-red-500 fill-current' : ''
            }`}
            onClick={handleToggleLike}
          />
          <MessageCircle size={24} className="cursor-pointer" />
          <Send size={24} className="cursor-pointer" />
        </div>
        <Bookmark size={24} className="cursor-pointer" />
      </div>
      <p
        className="text-sm font-semibold cursor-pointer mt-2"
        onClick={handleOpenLikesModal}
      >
        {likes.length} {likes.length === 1 ? 'like' : 'likes'}
      </p>

      
      <p className="text-sm mt-1">
        <b>{post.user?.username}</b> {post.caption}
      </p>

      
      {showLikesModal && (
        <LikesModal onClose={() => setShowLikesModal(false)} title="Liked by">
          {likesList.length === 0 ? (
            <p className="text-gray-400">No likes yet.</p>
          ) : (
            <ul className="space-y-3">
              {likesList.map((user) => (
                <li key={user._id} className="flex items-center gap-3">
                  <img
                    src={user.profilePicture?.url || '/defaultProfilePic.jpg'}
                    alt={user.username}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">@{user.username || 'unknown'}</p>
                    <p className="text-sm text-gray-400">{user.name || 'name not found'}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </LikesModal>
      )}
    </div>
  );
};

export default Post;
