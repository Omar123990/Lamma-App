/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const getInitialUserData = () => {
  const encodedToken = localStorage.getItem("userToken");
  const storedName = localStorage.getItem("userName");

  if (!encodedToken) return null;

  try {
    const decoded = jwtDecode(encodedToken);
    return {
      _id: decoded.user || decoded.userId || decoded._id || decoded.uid,
      name: storedName || decoded.name || decoded.username || "User",
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    console.error("❌ Token Error:", error);
    localStorage.removeItem("userToken");
    return null;
  }
};

export default function AuthContextProvider({ children }) {
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const [userData, setUserData] = useState(getInitialUserData);
  const [isAuthReady] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    setUserToken(null);
    setUserData(null);
  }, []);

  const saveUserData = useCallback(() => {
    setUserToken(localStorage.getItem("userToken"));
    setUserData(getInitialUserData());
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userToken,
        setUserToken,
        userData,
        setUserData,
        saveUserData,
        isAuthReady,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
