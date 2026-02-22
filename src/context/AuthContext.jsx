import { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const [userData, setUserData] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    setUserToken(null);
    setUserData(null);
  }, []);

  const saveUserData = useCallback(() => {
    const encodedToken = localStorage.getItem("userToken");
    const storedName = localStorage.getItem("userName");

    if (!encodedToken) {
      setUserToken(null);
      setUserData(null);
      return;
    }

    try {
      const decoded = jwtDecode(encodedToken);

      const normalizedUser = {
        _id: decoded.user || decoded.userId || decoded._id || decoded.uid,
        name: storedName || decoded.name || decoded.username || "User",
        email: decoded.email,
        role: decoded.role,
      };

      setUserData((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(normalizedUser))
          return prev;
        return normalizedUser;
      });

      setUserToken(encodedToken);
    } catch (error) {
      console.error("❌ Token Error:", error);
      localStorage.removeItem("userToken");
      setUserToken(null);
      setUserData(null);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      saveUserData();
    }
    setIsAuthReady(true);
  }, [saveUserData]);

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
