import React, { useEffect, useRef, useState } from "react";
import { useUser } from "../context/UserContext";
import { useMessage } from "../context/MessageContext";

const Chat = ({ chatUserId }) => {
  const { users, user } = useUser();
  const { messages, fetchMessages, sendMessage, loading } = useMessage();

  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const safeMessages = Array.isArray(messages) ? messages : [];

  useEffect(() => {
    if (chatUserId) {
      setError(null);
      fetchMessages(chatUserId).catch(() => {
        setError("Failed to load messages");
      });
    }
  }, [chatUserId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [safeMessages]);

  const handleSendMessage = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    setSending(true);
    setError(null);
    try {
      await sendMessage(chatUserId, trimmed);
      setNewMessage("");
    } catch (err) {
      setError("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (!user) return <p className="text-white">Loading current user...</p>;

  const chatUser = users.find((u) => u._id === chatUserId);
  if (!chatUser)
    return <p className="text-white">Please select a user to chat with.</p>;

  return (
<div className="bg-gray-900">
    <div className="ml-72">
      <div className="flex flex-col h-screen p-4 text-white bg-gray-900 w-full overflow-hidden">
        
        <div className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-2">
          <img
            src={chatUser?.profilePicture?.url || "/defaultProfilePic.jpg"}
            alt="pfp"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold">{chatUser.username}</h2>
            {chatUser?.bio && (
              <p className="text-sm text-gray-400">{chatUser.name}</p>
            )}
          </div>
        </div>
        <div
          className="flex-grow overflow-y-auto mb-4 border border-gray-600 p-2 rounded bg-gray-800 flex flex-col"
          style={{ gap: "8px" }}
        >
          {loading ? (
            <p className="text-center">Loading messages...</p>
          ) : error ? (
            <p className="text-center text-red-400">{error}</p>
          ) : safeMessages.length === 0 ? (
            <p className="text-center text-gray-400 italic">
              No messages yet. Start the conversation!
            </p>
          ) : (
            safeMessages.map((msg, index) => {
              const senderId = msg.sender?._id || msg.sender;
              const isSender = senderId === user.user._id;
              const sender = isSender ? user.user : chatUser;
              const time = new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={msg._id || msg.id || index}
                  className={`flex gap-2 items-start max-w-[80%] ${
                    isSender ? "self-end flex-row-reverse" : "self-start"
                  }`}
                >
                  <img
                    src={sender?.profilePicture?.url || "/defaultProfilePic.jpg"}
                    alt="pfp"
                    className="w-8 h-8 rounded-full object-cover mt-1"
                  />
                  <div
                    className={`p-2 rounded-lg max-w-[300px] break-words ${
                      isSender
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    <div className="text-xs text-gray-300 mb-1">
                      {sender.username} • {time}
                    </div>
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {sending && (
          <p className="text-sm text-blue-300 mb-2 text-center">Sending...</p>
        )}
        <div className="input-area flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 rounded-l border border-gray-600 bg-gray-800 text-white focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={sending}
          />
          <button
            onClick={handleSendMessage}
            disabled={sending}
            className={`px-4 py-2 rounded-r transition ${
              sending
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Send
          </button>
        </div>
      </div>
      </div>
      </div>
  );
};

export default Chat;
