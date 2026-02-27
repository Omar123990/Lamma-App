import axios from "axios";

const BASE_URL = "https://route-posts.routemisr.com/users";

const getHeaders = () => {
  const token = localStorage.getItem("userToken");
  return { token };
};

export const signupUser = async (userData) => {
  const { data } = await axios.post(`${BASE_URL}/signup`, userData);
  return data;
};

export const signinUser = async (userData) => {
  const { data } = await axios.post(`${BASE_URL}/signin`, userData);
  return data;
};
export const getCurrentUser = async () => {
  const token = localStorage.getItem("userToken");
  if (!token) return null;

  try {
    const { data } = await axios.get(`${BASE_URL}/profile-data`, {
      headers: { token },
    });
    return data?.data?.user;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("userToken");
    }
    console.error("❌ Error fetching current user:", error);
    return null;
  }
};

export const changePassword = async (passwordData) => {
  const { data } = await axios.patch(
    `${BASE_URL}/change-password`,
    passwordData,
    {
      headers: getHeaders(),
    },
  );
  return data;
};

export const uploadProfilePhoto = async (formData) => {
  const { data } = await axios.put(`${BASE_URL}/upload-photo`, formData, {
    headers: {
      ...getHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const getUserById = async (userId) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${userId}/profile`, {
      headers: getHeaders(),
    });
    return data.user || data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const forgotPassword = async (email) => {
  const { data } = await axios.post(`${BASE_URL}/forgot-password`, { email });
  return data;
};

export const verifyResetCode = async (resetCode) => {
  const { data } = await axios.post(`${BASE_URL}/verify-reset-code`, {
    resetCode,
  });
  return data;
};

export const resetPassword = async (email, newPassword) => {
  const { data } = await axios.put(`${BASE_URL}/reset-password`, {
    email,
    newPassword,
  });
  return data;
};

export const getFollowSuggestions = async (limit = 10) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/suggestions?limit=${limit}`, {
      headers: getHeaders(),
    });

    console.log("👥 Suggestions Response:", data);

    return data?.data?.suggestions || [];
  } catch (error) {
    console.error("❌ Error fetching suggestions:", error);
    return [];
  }
};
