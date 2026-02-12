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