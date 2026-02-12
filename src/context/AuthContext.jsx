import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [userProfile, setUserProfile] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const BASE_URL = "https://linked-posts.routemisr.com/users";

  async function registerUser(values) {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`${BASE_URL}/signup`, values);
      setIsLoading(false);
      return data;
    } catch (err) {
      setIsLoading(false);
      const errorMsg = err.response?.data?.message || "Registration failed";
      setError(errorMsg);
      throw errorMsg;
    }
  }

  async function loginUser(values) {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`${BASE_URL}/signin`, values);

      if (data.message === "success") {
        localStorage.setItem("userToken", data.token);
        setUserToken(data.token);
        setUserData(data.user);
      }

      setIsLoading(false);
      return data;
    } catch (err) {
      setIsLoading(false);
      const errorMsg = err.response?.data?.message || "Login failed";
      setError(errorMsg);
      throw errorMsg;
    }
  }

  function logout() {
    localStorage.removeItem("userToken");
    setUserToken(null);
    setUserData(null);
    setUserProfile(null);
    setMyPosts([]);
  }

  async function getProfileData() {
    setIsLoadingProfile(true);
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const { data: profileData } = await axios.get(`${BASE_URL}/profile-data`, {
        headers: { token }
      });
      setUserProfile(profileData.user);

      const { data: postsData } = await axios.get(`${BASE_URL}/${profileData.user._id}/posts?limit=50`, {
        headers: { token }
      });
      setMyPosts(postsData.posts);

    } catch (error) {
      console.log("Error loading profile:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  }

  async function verifyUser() {
    const token = localStorage.getItem("userToken");

    if (token) {
      setUserToken(token);
      try {
        const { data } = await axios.get(`${BASE_URL}/profile-data`, {
          headers: { token }
        });
        setUserData(data.user);
      } catch (error) {
        logout();
      }
    } else {
      setUserToken(null);
      setUserData(null);
    }

    setIsAuthReady(true);
  }

  useEffect(() => {
    verifyUser();
  }, []);

  return (
    <AuthContext.Provider value={{
      userToken,
      userData,
      isAuthReady,
      setUserToken,
      setUserData,
      logout,
      isLoading,
      error,
      userProfile,
      myPosts,
      getProfileData,
      isLoadingProfile,
      setMyPosts,
      setUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}