import { createContext, useState } from "react";
import axios from "axios";

export const PostContext = createContext();

export default function PostContextProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getAllPosts() {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("userToken");
      const { data } = await axios.get("https://linked-posts.routemisr.com/posts?limit=50", {
        headers: { token },
      });
      setPosts(data.posts);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching posts");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PostContext.Provider value={{ 
        posts, 
        setPosts,
        getAllPosts, 
        isLoading,
        error
    }}>
      {children}
    </PostContext.Provider>
  );
}