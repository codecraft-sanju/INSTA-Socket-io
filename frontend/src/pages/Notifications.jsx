import { useNotificationContext } from "../context/notificationContext"; // Correct import name
import { useUser } from "../context/UserContext";
import { useEffect } from "react";
import moment from "moment";
import { Loader2, BellOff, Trash2 } from "lucide-react";

const Notifications = () => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    deleteNotification,
  } = useNotificationContext();  // Correct hook name here

  const { user } = useUser();

  useEffect(() => {
    document.title = "Notifications • Instagram Clone";
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-6">
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Notifications</h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-400 mt-16">
            <BellOff size={40} />
            <p className="mt-4 text-lg">No Notifications Yet</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notif) => (
              <li
                key={notif._id}
                className={`flex items-center gap-4 p-4 rounded-xl border ${
                  notif.read
                    ? "border-gray-700 bg-gray-900"
                    : "border-indigo-500 bg-gray-800"
                }`}
              >
                <img
                  src={notif.sender?.profilePicture.url || "/defaultProfilePic.jpg"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div className="flex-1">
                  <p className="text-sm leading-snug">
                    <span className="font-semibold">
                      {notif.sender?.name || "Unknown"}
                    </span>{" "}
                    {notif.type === "follow" && "started following you"}
                    {notif.type === "like" && "liked your post"}
                    {notif.type === "comment" && "commented on your post"}
                  </p>
                  <p className="text-xs text-gray-400">
                    @{notif.sender?.username} •{" "}
                    {moment(notif.createdAt).fromNow()}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif._id)}
                      className="text-xs text-indigo-400 hover:underline"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif._id)}
                    className="text-gray-500 hover:text-red-500"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;
