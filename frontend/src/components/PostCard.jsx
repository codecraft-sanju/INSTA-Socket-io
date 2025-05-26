import React, { useEffect, useState } from 'react';
import { usePost } from '../context/PostContext';
import { useUser } from '../context/UserContext';
import { useComment } from '../context/commentContext';
import moment from 'moment';

const PostCard = ({ post: initialPost, onClose }) => {
  const { toggleLike, getLikesOfPost } = usePost();
  const { user } = useUser();
  const { comments, getComments, addComment } = useComment();

  const [newComment, setNewComment] = useState('');
  const [post, setPost] = useState(initialPost);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likesList, setLikesList] = useState([]);

  const isLikedByCurrentUser = post.likes.some((like) =>
    typeof like === 'object' ? like._id === user?._id : like === user?._id
  );

  useEffect(() => {
    getComments(post._id);
  }, [post._id, getComments]);

  const handleLike = async () => {
    const data = await toggleLike(post._id);
    if (!data) return;

    if (data.likedByUser) {
      setPost((prev) => ({
        ...prev,
        likes: [...prev.likes, user],
      }));
    } else {
      setPost((prev) => ({
        ...prev,
        likes: prev.likes.filter((like) =>
          typeof like === 'object' ? like._id !== user._id : like !== user._id
        ),
      }));
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await addComment(post._id, newComment);
    await getComments(post._id);
    setNewComment('');
  };

  const handleShowLikesModal = async () => {
    const data = await getLikesOfPost(post._id);
    if (data) {
      setLikesList(data);
      setShowLikesModal(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#1a1a1a] rounded-xl p-4 w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 text-xl hover:text-red-500 transition"
        >
          ✖
        </button>
        <div className="rounded-lg overflow-hidden mb-3">
          <img
            src={post.image}
            alt="post"
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="flex justify-between items-center mb-2">
          <span
            className="text-sm text-gray-400 cursor-pointer hover:underline"
            onClick={handleShowLikesModal}
          >
            {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
          </span>
          <button
            onClick={handleLike}
            className={`text-sm px-3 py-1 rounded-full transition ${
              isLikedByCurrentUser
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-800 text-blue-400 hover:bg-gray-700'
            }`}
          >
            {isLikedByCurrentUser ? ' Unlike' : ' Like'}
          </button>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            placeholder="Add a comment..."
            className="flex-1 p-2 rounded-lg bg-[#2a2a2a] text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleAddComment}
            className="text-sm font-medium text-blue-500 hover:text-blue-400 transition"
          >
            Post
          </button>
        </div>
        <div className="overflow-y-auto pr-1 max-h-52 custom-scrollbar">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-sm">No comments yet.</p>
          ) : (
            comments.map((cmt) => (
              <div key={cmt._id} className="flex items-start gap-3 mt-3">
                <img
                  src={
                    cmt.user?.profilePicture?.url || '/defaultProfilePic.jpg'
                  }
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover border border-gray-600"
                />
                <div>
                  <p className="text-sm text-gray-300 leading-snug">
                    <span className="font-semibold text-white">
                      {cmt.user?.username || 'Unknown'}
                    </span>{' '}
                    <span>{cmt.text}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {moment(cmt.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {showLikesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-4">
          <div className="bg-[#1a1a1a] w-full max-w-sm rounded-lg p-4 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowLikesModal(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-lg"
            >
              ✖
            </button>
            <h2 className="text-white text-lg mb-3 font-semibold border-b border-gray-700 pb-2">
              Likes
            </h2>
            {likesList.length === 0 ? (
              <p className="text-gray-500 text-sm">No likes yet.</p>
            ) : (
              likesList.map((user) => (
                <div key={user._id} className="flex items-center gap-3 py-2">
                  <img
                    src={user.profilePicture?.url || '/defaultProfilePic.jpg'}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover border border-gray-600"
                  />
                  <div className="text-gray-300 text-sm leading-tight">
                    <p className="font-semibold text-white">@{user.username}</p>
                    <p className="text-gray-400 text-xs">{user.name || 'No Name'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
