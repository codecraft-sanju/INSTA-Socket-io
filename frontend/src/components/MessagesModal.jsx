import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const MessagesModal = ({ onClose, search, setSearch, users = [], loading }) => {
  const [filteredUsers, setFilteredUsers] = useState(users);
  const navigate = useNavigate();

  useEffect(() => {
    setFilteredUsers(
      users.filter((u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.username?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  const handleUserClick = (userId) => {
    onClose(); 
    navigate(`/chat/${userId}`); 
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="bg-gray-900 text-black w-full max-w-md rounded-xl p-5 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-xl text-white font-bold mb-4">Start a Conversation</h2>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white outline-none"
        />

        {loading ? (
          <p className="text-gray-400 text-center">Loading...</p>
        ) : (
          <div className="max-h-64 overflow-y-auto flex flex-col gap-3">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <div
                  key={u._id}
                  onClick={() => handleUserClick(u._id)}
                  className="flex items-center gap-3 hover:bg-gray-800 p-2 rounded cursor-pointer"
                >
                  <img
                    src={u.profilePicture?.url || '/defaultProfilePic.jpg'}
                    alt="pfp"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm text-white font-medium">{u.name}</p>
                    <p className="text-xs text-white">@{u.username}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white-400 text-center">No users found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesModal;
