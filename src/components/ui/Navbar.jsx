import { useContext, useMemo, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/authAPI";
import { getUnreadCount } from "../../services/postsAPI";
import toast from "react-hot-toast";
import { Badge } from "@heroui/react";

import NavLinks from "./NavLinks";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const { userToken, logout, userData: contextUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isFirstLoad = useRef(true);
  const prevCountRef = useRef(0);

  const { data: apiUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!userToken,
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: getUnreadCount,
    enabled: !!userToken,
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      prevCountRef.current = unreadCount;
      return;
    }

    if (unreadCount > prevCountRef.current) {
      toast.custom(
        (t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-sm w-full bg-white dark:bg-[#18181b] shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 dark:ring-white/10 p-3 border-l-4 border-purple-500`}
          >
            <div className="flex-1 w-0 p-1">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                    <Bell className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-bounce" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    New Notification!
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Someone interacted with you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
        { duration: 2000, position: "bottom-right" },
      );
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount]);

  const userData = apiUser || contextUser;

  const userPhoto = useMemo(() => {
    if (!userData?.photo)
      return "https://linked-posts.routemisr.com/uploads/default-profile.png";
    let cleanPhoto = String(userData.photo);
    if (
      cleanPhoto.includes("undefined") ||
      cleanPhoto.includes("null") ||
      cleanPhoto.trim() === ""
    )
      return "https://linked-posts.routemisr.com/uploads/default-profile.png";
    if (cleanPhoto.includes("route-posts.routemisr.com")) {
      cleanPhoto = cleanPhoto.replace("https://route-posts.routemisr.com/", "");
    }
    if (cleanPhoto.startsWith("http")) return cleanPhoto;
    cleanPhoto = cleanPhoto.startsWith("/")
      ? cleanPhoto.substring(1)
      : cleanPhoto;
    return `https://linked-posts.routemisr.com/${cleanPhoto}`;
  }, [userData]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-60 w-[95%] max-w-7xl transition-all duration-300">
        <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3 backdrop-blur-xl border border-white/40 bg-white/60 dark:bg-[#0f0f11]/60 dark:border-white/10 shadow-lg shadow-purple-500/10 rounded-full">
          <Link
            to="/"
            onClick={scrollToTop}
            className="flex items-center gap-2 sm:gap-3 group shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform duration-300">
              L
            </div>
            <span className="font-bold text-xl tracking-wide hidden lg:block text-gray-800 dark:text-white group-hover:text-purple-600 transition-colors font-sans">
              Lamma
            </span>
          </Link>

          {userToken && (
            <NavLinks
              userData={userData}
              location={location}
              scrollToTop={scrollToTop}
            />
          )}

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {userToken ? (
              <>
                <Link
                  to="/notifications"
                  className={`p-2 rounded-full transition-colors flex items-center justify-center ${
                    location.pathname === "/notifications"
                      ? "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
                  }`}
                >
                  {unreadCount > 0 ? (
                    <Badge
                      content={unreadCount}
                      color="danger"
                      size="sm"
                      shape="circle"
                      showOutline={false}
                      className="text-[10px] font-bold text-white border-none"
                    >
                      <Bell
                        size={20}
                        className={
                          location.pathname === "/notifications"
                            ? "fill-purple-600/20"
                            : ""
                        }
                      />
                    </Badge>
                  ) : (
                    <Bell
                      size={20}
                      className={
                        location.pathname === "/notifications"
                          ? "fill-purple-600/20"
                          : ""
                      }
                    />
                  )}
                </Link>

                <UserMenu
                  userData={userData}
                  userPhoto={userPhoto}
                  resolvedTheme={resolvedTheme}
                  toggleTheme={toggleTheme}
                  handleLogout={handleLogout}
                  navigate={navigate}
                />
              </>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  {resolvedTheme === "dark" ? (
                    <Sun size={20} />
                  ) : (
                    <Moon size={20} />
                  )}
                </button>
                <Link to="/login">
                  <button className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold hover:opacity-80 transition-opacity text-sm">
                    Login
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
