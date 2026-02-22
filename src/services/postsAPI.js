import axios from "axios";

const BASE_URL = "https://route-posts.routemisr.com/posts";
const COMMENTS_URL = "https://linked-posts.routemisr.com/comments";

const getHeaders = () => {
  const token = localStorage.getItem("userToken");
  return { token };
};

export const getAllPosts = async (limit = 50) => {
  try {
    const { data } = await axios.get(`${BASE_URL}?limit=${limit}`, {
      headers: getHeaders(),
    });
    if (data.paginationInfo && data.posts) return data.posts;
    if (data.data && data.data.posts) return data.data.posts;
    if (data.posts) return data.posts;
    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getUserPosts = async (userId) => {
  if (!userId) return [];
  try {
    const { data } = await axios.get(
      `https://route-posts.routemisr.com/users/${userId}/posts?limit=100`,
      { headers: getHeaders() },
    );
    if (data.posts) return data.posts;
    if (data.data && data.data.posts) return data.data.posts;
    if (data.data && Array.isArray(data.data)) return data.data;
    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getSinglePost = async (postId) => {
  if (!postId) return null;
  try {
    const { data } = await axios.get(`${BASE_URL}/${postId}`, {
      headers: getHeaders(),
    });
    if (data.post) return data.post;
    if (data.data && data.data.post) return data.data.post;
    if (data.data) return data.data;
    
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createPost = async (formData) => {
  const { data } = await axios.post(BASE_URL, formData, {
    headers: {
      ...getHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const deletePost = async (postId) => {
  const { data } = await axios.delete(`${BASE_URL}/${postId}`, {
    headers: getHeaders(),
  });
  return data;
};

export const updatePost = async ({ postId, formData }) => {
  const { data } = await axios.put(`${BASE_URL}/${postId}`, formData, {
    headers: {
      ...getHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const toggleLike = async (postId) => {
  const { data } = await axios.put(
    `${BASE_URL}/${postId}/like`,
    {},
    { headers: getHeaders() },
  );
  return data;
};

export const getPostComments = async (postId) => {
  if (!postId) return [];
  try {
    const { data } = await axios.get(`${BASE_URL}/${postId}/comments`, {
      headers: getHeaders(),
    });
    if (data.comments) return data.comments;
    if (data.data && data.data.comments) return data.data.comments;
    if (data.data && Array.isArray(data.data)) return data.data;
    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const addComment = async ({ postId, content }) => {
  if (!postId) throw new Error("Post ID is missing");

  const { data } = await axios.post(
    `${BASE_URL}/${postId}/comments`,
    { content },
    { headers: getHeaders() },
  );
  return data;
};

export const deleteComment = async ({ postId, commentId }) => {
  const { data } = await axios.delete(
    `${BASE_URL}/${postId}/comments/${commentId}`,
    {
      headers: getHeaders(),
    },
  );
  return data;
};

export const updateComment = async ({ postId, commentId, content }) => {
  const { data } = await axios.put(
    `${BASE_URL}/${postId}/comments/${commentId}`,
    { content },
    { headers: getHeaders() },
  );
  return data;
};

export const toggleCommentLike = async ({ postId, commentId }) => {
  const { data } = await axios.put(
    `${BASE_URL}/${postId}/comments/${commentId}/like`,
    {},
    { headers: getHeaders() },
  );
  return data;
};

export const addReply = async ({ postId, commentId, content }) => {
  const formData = new FormData();
  formData.append("content", content);

  const { data } = await axios.post(
    `${BASE_URL}/${postId}/comments/${commentId}/replies`,
    formData,
    { headers: { ...getHeaders(), "Content-Type": "multipart/form-data" } },
  );
  return data;
};

export const getCommentReplies = async (postId, commentId) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/${postId}/comments/${commentId}/replies?limit=10`,
      { headers: getHeaders() },
    );

    console.log("📦 Parsing Replies Data:", data);

    if (Array.isArray(data)) return data;
    if (data.comments && Array.isArray(data.comments)) return data.comments;
    if (data.replies && Array.isArray(data.replies)) return data.replies;

    if (data.data) {
      if (Array.isArray(data.data)) return data.data;

      if (typeof data.data === "object") {
        if (data.data.comments && Array.isArray(data.data.comments))
          return data.data.comments;
        if (data.data.replies && Array.isArray(data.data.replies))
          return data.data.replies;

        const keys = Object.keys(data.data);
        for (const key of keys) {
          if (Array.isArray(data.data[key])) {
            console.log(` Found replies in key: data.data.${key}`);
            return data.data[key];
          }
        }
      }
    }

    console.warn(" Could not find any array in response");
    return [];
  } catch (error) {
    console.error(" Error fetching replies:", error);
    return [];
  }
};

// 4. Follow & Bookmark 
export const toggleFollowUser = async (userIdToFollow) => {
  const { data } = await axios.put(
    `https://route-posts.routemisr.com/users/${userIdToFollow}/follow`,
    {},
    { headers: getHeaders() },
  );
  return data;
};

export const toggleSavePost = async (postId) => {
  const { data } = await axios.put(
    `${BASE_URL}/${postId}/bookmark`,
    {},
    { headers: getHeaders() },
  );
  return data;
};

export const getSavedPosts = async () => {
  try {
    const { data } = await axios.get(
      `https://route-posts.routemisr.com/users/bookmarks`,
      { headers: getHeaders() },
    );

    console.log("📥 Saved Posts Response:", data);

    if (Array.isArray(data)) return data;
    if (data.bookmarks && Array.isArray(data.bookmarks)) return data.bookmarks;
    if (data.data && Array.isArray(data.data)) return data.data;

    if (data.data && typeof data.data === "object") {
      if (data.data.bookmarks && Array.isArray(data.data.bookmarks))
        return data.data.bookmarks;
      if (data.data.posts && Array.isArray(data.data.posts))
        return data.data.posts;

      const keys = Object.keys(data.data);
      for (const key of keys) {
        if (Array.isArray(data.data[key])) {
          console.log(`✅ Found saved posts in: data.data.${key}`);
          return data.data[key];
        }
      }
    }

    return [];
  } catch (error) {
    console.error("❌ Error fetching saved posts:", error);
    return [];
  }
};

// 5. Notifications
export const getNotifications = async () => {
  try {
    const { data } = await axios.get(
      `https://route-posts.routemisr.com/notifications`,
      { headers: getHeaders() },
    );

    console.log("🔔 Notifications Response:", data);

    if (Array.isArray(data)) return data;
    if (data.notifications && Array.isArray(data.notifications))
      return data.notifications;
    if (data.data && Array.isArray(data.data)) return data.data;

    if (data.data && typeof data.data === "object") {
      if (data.data.notifications && Array.isArray(data.data.notifications))
        return data.data.notifications;

      const keys = Object.keys(data.data);
      for (const key of keys) {
        if (Array.isArray(data.data[key])) {
          console.log(`✅ Found notifications in: data.data.${key}`);
          return data.data[key];
        }
      }
    }

    const rootKeys = Object.keys(data);
    for (const key of rootKeys) {
      if (Array.isArray(data[key])) {
        console.log(`✅ Found notifications in root: data.${key}`);
        return data[key];
      }
    }

    return [];
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    return [];
  }
};

export const getUnreadCount = async () => {
  try {
    const { data } = await axios.get(
      `https://route-posts.routemisr.com/notifications/unread-count`,
      { headers: getHeaders() },
    );

    const count = data?.data?.unreadCount || 0;

    return Number(count);
  } catch (error) {
    console.error("❌ Error fetching unread count:", error);
    return 0;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  const { data } = await axios.patch(
    `https://route-posts.routemisr.com/notifications/${notificationId}/read`,
    {},
    { headers: getHeaders() },
  );
  return data;
};

export const markAllNotificationsAsRead = async () => {
  const { data } = await axios.patch(
    `https://route-posts.routemisr.com/notifications/read-all`,
    {},
    { headers: getHeaders() },
  );
  return data;
};
