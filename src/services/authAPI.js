import axios from "axios";

const BASE_URL = "https://linked-posts.routemisr.com/users";

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

  const { data } = await axios.get(
    "https://linked-posts.routemisr.com/users/profile-data", 
    { headers: { token } }
  );
  
  return data.user;
};

export const uploadProfilePhoto = async (imageFile) => {
  const token = localStorage.getItem("userToken");
  const formData = new FormData();
  formData.append("photo", imageFile);

  const { data } = await axios.put(
    "https://linked-posts.routemisr.com/users/upload-photo", 
    formData, 
    { headers: { token, "Content-Type": "multipart/form-data" } }
  );
  return data;
};

export const changeUserPassword = async ({ password, newPassword }) => {
  const token = localStorage.getItem("userToken");
  const { data } = await axios.patch(
    "https://linked-posts.routemisr.com/users/change-password", 
    { password, newPassword }, 
    { headers: { token } }
  );
  return data;
};