import axios from "axios";

export const getAllPosts = async () => {
    const token = localStorage.getItem("userToken");
    const { data } = await axios.get(
        "https://linked-posts.routemisr.com/posts?limit=20",
        { headers: { token } }
    );
    return data.posts;
};

export const getUserPosts = async (userId) => {
    const token = localStorage.getItem("userToken");
    if (!userId) return [];
    const { data } = await axios.get(
        `https://linked-posts.routemisr.com/users/${userId}/posts?limit=20`,
        { headers: { token } }
    );
    return data.posts;
};

export const getSinglePost = async (postId) => {
    const token = localStorage.getItem("userToken");
    if (!postId) return null;
    const { data } = await axios.get(
        `https://linked-posts.routemisr.com/posts/${postId}`,
        { headers: { token } }
    );
    return data.post;
};

export const createNewPost = async ({ content, image }) => {
    const token = localStorage.getItem("userToken");
    const formData = new FormData();
    formData.append("body", content);
    if (image) {
        formData.append("image", image);
    }

    const { data } = await axios.post(
        "https://linked-posts.routemisr.com/posts",
        formData,
        { headers: { token, "Content-Type": "multipart/form-data" } }
    );
    return data;
};

export const deletePost = async (postId) => {
    const token = localStorage.getItem("userToken");
    const { data } = await axios.delete(
        `https://linked-posts.routemisr.com/posts/${postId}`,
        { headers: { token } }
    );
    return data;
};

export const updatePost = async ({ postId, formData }) => {
    const token = localStorage.getItem("userToken");
    const { data } = await axios.put(
        `https://linked-posts.routemisr.com/posts/${postId}`,
        formData,
        { headers: { token, "Content-Type": "multipart/form-data" } }
    );
    return data;
};

export const getPostComments = async (postId) => {
    const token = localStorage.getItem("userToken");

    if (!token) return [];

    const { data } = await axios.get(
        `https://linked-posts.routemisr.com/posts/${postId}/comments`,
        { headers: { token } }
    );
    return data.comments;
};

export const createComment = async ({ postId, content }) => {
    const token = localStorage.getItem("userToken");
    const { data } = await axios.post(
        `https://linked-posts.routemisr.com/comments`,
        { content, post: postId },
        { headers: { token } }
    );
    return data;
};

export const deleteComment = async ({ postId, commentId }) => {
    const token = localStorage.getItem("userToken");
    const { data } = await axios.delete(
        `https://linked-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
        { headers: { token } }
    );
    return data;
};

export const updateComment = async ({ postId, commentId, content }) => {
    const token = localStorage.getItem("userToken");
    const { data } = await axios.put(
        `https://linked-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
        { content },
        { headers: { token } }
    );
    return data;
};