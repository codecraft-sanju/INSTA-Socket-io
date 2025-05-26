import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useUser } from './UserContext'; 

const PostContext = createContext();


export const PostProvider = ({ children }) => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingUserPosts, setLoadingUserPosts] = useState(false);
  const [loadingFeedPosts, setLoadingFeedPosts] = useState(false);

  // Fetch all posts (admin or debug use)
  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const { data } = await axios.get('/api/posts');
      setPosts(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching posts');
      console.error('Error fetching posts:', error);
    }
    setLoadingPosts(false);
  };

  // Fetch posts for a specific user
  const fetchUserPosts = async (userId) => {
    setLoadingUserPosts(true);
    try {
      const { data } = await axios.get(`/api/posts/user/${userId}`);
      setUserPosts(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching user posts');
      console.error('Error fetching user posts:', error);
    }
    setLoadingUserPosts(false);
  };

  //  Fetch feed posts (only from followed users)
  const fetchFeedPosts = async () => {
    setLoadingFeedPosts(true);
    try {
      const { data } = await axios.get('/api/posts/feed', {
        withCredentials: true,
      });
      setFeedPosts(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching feed posts');
      console.error('Error fetching feed posts:', error);
    }
    setLoadingFeedPosts(false);
  };

  
  // Create a new post with file and optional caption
  const createPost = async (file, caption = '') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caption', caption);

      const { data } = await axios.post('/api/posts/create', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Dynamically update all post lists
      setPosts((prev) => [data.post, ...prev]);
      setUserPosts((prev) => [data.post, ...prev]);
      setFeedPosts((prev) => [data.post, ...prev]);

      toast.success('Post created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating post');
      console.error('Error creating post:', error);
    }
  };

  // Delete a post
  const deletePost = async (postId) => {
    try {
      await axios.delete(`/api/posts/${postId}`, { withCredentials: true });

      setPosts((prev) => prev.filter((post) => post._id !== postId));
      setUserPosts((prev) => prev.filter((post) => post._id !== postId));
      setFeedPosts((prev) => prev.filter((post) => post._id !== postId));

      toast.success('Post deleted successfully');
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting post');
      console.error('Error deleting post:', error);
    }
  };
 const toggleLike = async (postId) => {
  try {
    const { data } = await axios.put(`/api/posts/${postId}/like`, {}, { withCredentials: true });

    setFeedPosts((prev) =>
      prev.map((post) =>
        post._id === postId
          ? {
              ...post,
              likes: data.likedByUser
                ? [...post.likes, { _id: user._id, username: user.username }]
                : post.likes.filter((like) => like._id !== user._id),
            }
          : post
      )
    );

    return data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Error toggling like');
    console.error('Error toggling like:', error);
  }
};


const getLikesOfPost = async (postId) => {
  try {
    const { data } = await axios.get(`/api/posts/${postId}/likes`, { withCredentials: true });
    return data; 
  } catch (error) {
    toast.error(error.response?.data?.message || 'Error fetching likes');
    console.error('Error fetching likes:', error);
  }
};


  
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider
      value={{
        posts,
        userPosts,
        feedPosts,
        loadingPosts,
        loadingUserPosts,
        loadingFeedPosts,
        fetchUserPosts,
        fetchFeedPosts,
        createPost,
        deletePost,
        toggleLike,
        getLikesOfPost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  return useContext(PostContext);
};
