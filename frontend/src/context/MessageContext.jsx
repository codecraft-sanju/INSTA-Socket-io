import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useUser } from "./UserContext";
import { io } from "socket.io-client";

const MessageContext = createContext();

const API = import.meta.env.VITE_API_URL + "/api";

export const MessageProvider = ({ children }) => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();

  // Setup socket on mount
  useEffect(() => {
    socket.current = io(API.replace("/api", ""), {
      withCredentials: true,
    });

    socket.current.on("receiveMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.message,
        createdAt: Date.now(),
      });
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  // Push arrivalMessage if it's from the current chat
  useEffect(() => {
    if (
      arrivalMessage &&
      messages.length > 0 &&
      (arrivalMessage.sender === messages[0]?.sender?._id || arrivalMessage.sender === messages[0]?.sender)
    ) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, messages]);

  // Fetch messages with a user
  const fetchMessages = useCallback(async (recipientId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/message/${recipientId}`, {
        withCredentials: true,
      });
      setMessages(data);
    } catch (error) {
      console.error("Fetch messages failed:", error.response?.data?.message || error.message);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Send + Push message locally with correct structure
  const sendMessage = useCallback(
    async (recipientId, text) => {
      try {
        const { data } = await axios.post(
          `${API}/message/`,
          { recipientId, text },
          { withCredentials: true }
        );

        //  Emit via socket
        socket.current.emit("sendMessage", {
          senderId: user.user._id,
          receiverId: recipientId,
          message: text,
        });

        // Locally push message so UI updates instantly
        const newMsg = {
          _id: data._id || Date.now().toString(),
          sender: user.user._id,
          text,
          createdAt: Date.now(),
        };

        setMessages((prev) => [...prev, newMsg]);
      } catch (error) {
        console.error("Send message failed:", error.response?.data?.message || error.message);
        throw error;
      }
    },
    [user]
  );

  return (
    <MessageContext.Provider
      value={{
        messages,
        sendMessage,
        fetchMessages,
        loading,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
