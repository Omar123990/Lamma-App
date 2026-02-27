import axios from "axios";

const BASE_URL = "https://route-posts.routemisr.com/posts";

const getHeaders = () => {
  const token = localStorage.getItem("userToken");
  return { token };
};

export const getAllPosts = async (limit = 50) => {
  try {
    const { data } = await axios.get(`${BASE_URL}?limit=${limit}`, {
      headers: getHeaders(),
    });
    return data?.data?.posts || [];
  } catch (error) {
    console.error("❌ Error in getAllPosts:", error);
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
    return data?.data?.posts || data?.posts || [];
  } catch (error) {
    console.error("❌ Error in getUserPosts:", error);
    return [];
  }
};

export const getSinglePost = async (postId) => {
  if (!postId) return null;
  try {
    const { data } = await axios.get(`${BASE_URL}/${postId}`, {
      headers: getHeaders(),
    });
    return data?.data?.post || data?.post || null;
  } catch (error) {
    console.error("❌ Error fetching single post:", error);
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
    return data?.data?.comments || [];
  } catch (error) {
    console.error("Error fetching comments:", error);
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
    { headers: getHeaders() },
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
    return data?.data?.replies || [];
  } catch (error) {
    console.error("❌ Error fetching replies:", error);
    return [];
  }
};

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
    return data?.data?.bookmarks || [];
  } catch (error) {
    console.error("❌ Error fetching saved posts:", error);
    return [];
  }
};

export const getNotifications = async () => {
  try {
    const { data } = await axios.get(
      `https://route-posts.routemisr.com/notifications`,
      { headers: getHeaders() },
    );
    return data?.data?.notifications || [];
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
    return Number(data?.data?.unreadCount || 0);
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
