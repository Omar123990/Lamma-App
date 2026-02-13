import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const [userData, setUserData] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  function logout() {
    localStorage.removeItem("userToken");
    setUserToken(null);
    setUserData(null);
  }

  const saveUserData = () => {
    const encodedToken = localStorage.getItem("userToken");

    if (!encodedToken) {
      logout();
      return;
    }

    try {
      const decoded = jwtDecode(encodedToken);

      const normalizedUser = {
        _id: decoded.user || decoded.id || decoded.userId || decoded._id,
        name: decoded.name || null
      };

      if (!normalizedUser._id) {
        console.error("❌ Token invalid. Logging out...");
        logout();
        return;
      }

      console.log("✅ User Connected:", normalizedUser);
      setUserData(normalizedUser);
      setUserToken(encodedToken);

    } catch (error) {
      console.error("❌ Token Error:", error);
      logout();
    }
  };

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      saveUserData();
    }
    setIsAuthReady(true);
  }, []);

  return (
    <AuthContext.Provider value={{
      userToken,
      setUserToken,
      userData,
      setUserData,
      saveUserData,
      isAuthReady,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}