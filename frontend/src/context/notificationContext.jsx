import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "./UserContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useUser();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!user?.user?._id) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/notification/${user.user._id}`);
      const fetchedNotifications = res.data?.data || [];

      setNotifications(fetchedNotifications);

      const unread = fetchedNotifications.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const res = await axios.put(`/api/notification/read/${id}`);
      const updatedNotification = res.data?.data;

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
      toast.success(res.data?.message || "Marked as read");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to mark as read"
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await axios.put("/api/notification/mark-all-read");

      const updated = notifications.map((n) => ({ ...n, isRead: true }));
      setNotifications(updated);
      setUnreadCount(0);
      toast.success(res.data?.message || "All marked as read");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to mark all as read"
      );
    }
  };

  const deleteNotification = async (id) => {
    try {
      const res = await axios.delete(`/api/notification/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success(res.data?.message || "Notification deleted");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete notification"
      );
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        loading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
