import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/postsAPI";
import { BellOff, Check } from "lucide-react";
import { Spinner, Button } from "@heroui/react";
import toast from "react-hot-toast";
import NotificationItem from "../components/notifications/NotificationItem";
import { Helmet } from "react-helmet-async";

export default function Notifications() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("All");

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const { mutate: handleMarkAll, isPending: isMarkingAll } = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
      toast.success("All caught up! ✨");
    },
  });

  const {
    mutate: handleMarkOne,
    isPending: isMarkingOne,
    variables: markingId,
  } = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });

  const unreadCount = notifications?.filter((n) => !n.isRead)?.length || 0;

  const displayedNotifications = notifications?.filter((notif) => {
    if (filter === "Unread") return !notif.isRead;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto pt-24 px-4 pb-20">
      <Helmet>
        <title>
          {unreadCount > 0
            ? `(${unreadCount}) Notifications | Lamma`
            : "Notifications | Lamma"}
        </title>
      </Helmet>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Notifications
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Realtime updates for likes, comments, shares, and follows.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="faded"
            startContent={<Check size={16} />}
            isLoading={isMarkingAll}
            onPress={handleMarkAll}
            className="font-medium bg-white/20 dark:bg-black/20 backdrop-blur-md border border-gray-200/50 dark:border-white/10"
          >
            Mark all as read
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setFilter("All")}
          className={`px-4 cursor-pointer py-1.5 rounded-full text-sm font-semibold transition-all backdrop-blur-md ${filter === "All" ? "bg-blue-600 text-white" : "bg-white/30 dark:bg-black/30 border border-gray-200/50 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("Unread")}
          className={`px-4 cursor-pointer py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 backdrop-blur-md ${filter === "Unread" ? "bg-blue-600 text-white" : "bg-white/30 dark:bg-black/30 border border-gray-200/50 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10"}`}
        >
          Unread
          {unreadCount > 0 && (
            <span
              className={`px-1.5 rounded-full text-[10px] ${filter === "Unread" ? "bg-white text-blue-600" : "bg-blue-500 text-white"}`}
            >
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" color="primary" />
        </div>
      ) : displayedNotifications && displayedNotifications.length > 0 ? (
        <div className="flex flex-col gap-0 bg-white/20 dark:bg-[#0f0f11]/40 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/10 overflow-hidden shadow-lg">
          {displayedNotifications.map((notif, index) => (
            <NotificationItem
              key={notif._id}
              notif={notif}
              isLast={index === displayedNotifications.length - 1}
              isMarkingOne={isMarkingOne}
              markingId={markingId}
              handleMarkOne={handleMarkOne}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white/20 dark:bg-[#0f0f11]/40 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-white/10 shadow-lg">
          <div className="bg-white/30 dark:bg-black/40 p-6 rounded-full mb-4 border border-white/20 dark:border-white/5">
            <BellOff size={48} className="text-gray-500 dark:text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            No {filter === "Unread" ? "unread" : ""} notifications
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm text-sm">
            You're all caught up! Check back later for new interactions.
          </p>
        </div>
      )}
    </div>
  );
}
