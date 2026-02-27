import {
  Outlet,
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import Navbar from "./../components/ui/Navbar";
import { useTheme } from "next-themes";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import FollowSuggestions from "../components/home/FollowSuggestions";
import { Rss, User, Bookmark, Sparkles, Users } from "lucide-react";

import bgDark from "../../public/bg.png.png";
import bgLight from "../../public/bg.light.png.png";

export default function MainLayout() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { userData } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", 
    });
  }, [location.pathname]); 

  if (!mounted) return null;



  const isDarkMode = resolvedTheme === "dark";
  const currentBgImage = isDarkMode ? bgDark : bgLight;
  const imgEffects = isDarkMode ? "opacity-80" : "opacity-100 brightness-[0.7]";

  const currentUserId = userData?._id || userData?.user?._id;

  const userSlug = userData?.name
    ? userData.name.replace(/\s+/g, "").toLowerCase()
    : "user";

  const isHomeActive =
    location.pathname === "/" || location.pathname.startsWith("/feed");
  const currentFeedTab = searchParams.get("feed") || "latest";

  const handleTimelineClick = (feedStr) => {
    if (location.pathname.startsWith("/feed") || location.pathname === "/") {
      setSearchParams({ feed: feedStr });
    } else {
      navigate(`/feed/${userSlug}?feed=${feedStr}`);
    }
  };

  return (
    <div className="min-h-screen relative bg-gray-50 dark:bg-black transition-colors duration-500">
      <div
        className={`fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ${imgEffects}`}
        style={{ backgroundImage: `url(${currentBgImage})` }}
      ></div>

      <div className="relative z-10 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 container mx-auto max-w-337.5 pt-32 pb-20 px-4 overflow-x-hidden md:overflow-visible">
          <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start w-full">
            <div className="hidden lg:block w-full lg:w-60 xl:w-62.5 sticky top-32.5 shrink-0 z-20">
              <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-3xl border border-white/40 dark:border-white/10 p-5 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 px-2">
                    Menu
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        to="/"
                        className={`flex items-center gap-4 p-3 rounded-2xl font-semibold transition-all ${isHomeActive ? "bg-purple-600 text-white font-bold shadow-lg shadow-purple-500/20" : "text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-white/5"}`}
                      >
                        <Rss size={20} /> Feed
                      </Link>
                    </li>
                    {currentUserId && (
                      <li>
                        <Link
                          to={`/profile/${currentUserId}`}
                          className={`flex items-center gap-4 p-3 rounded-2xl font-semibold transition-all ${location.pathname.includes("/profile") ? "bg-purple-600 text-white font-bold shadow-lg shadow-purple-500/20" : "text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-white/5"}`}
                        >
                          <User size={20} /> Profile
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link
                        to="/saved"
                        className={`flex items-center gap-4 p-3 rounded-2xl font-semibold transition-all ${location.pathname === "/saved" ? "bg-purple-600 text-white font-bold shadow-lg shadow-purple-500/20" : "text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-white/5"}`}
                      >
                        <Bookmark size={20} /> Saved
                      </Link>
                    </li>
                  </ul>
                </div>

                {isHomeActive && (
                  <>
                    <hr className="border-t border-gray-200 dark:border-white/10" />
                    <div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 px-2">
                        Timeline
                      </h3>
                      <ul className="space-y-1">
                        <li>
                          <button
                            onClick={() => handleTimelineClick("latest")}
                            className={`w-full flex items-center gap-4 p-3 rounded-2xl font-semibold transition-all ${currentFeedTab === "latest" ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/20 dark:hover:bg-white/5"}`}
                          >
                            <Sparkles size={20} /> Latest
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleTimelineClick("following")}
                            className={`w-full flex items-center gap-4 p-3 rounded-2xl font-semibold transition-all ${currentFeedTab === "following" ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/20 dark:hover:bg-white/5"}`}
                          >
                            <Users size={20} /> Following
                          </button>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex-1 w-full max-w-2xl mx-auto min-w-0">
              <Outlet />
            </div>

            <div className="hidden lg:block w-full lg:w-75 xl:w-[320px] sticky top-32.5 shrink-0 z-20">
              <FollowSuggestions layout="vertical" />
              <div className="mt-6 px-4 text-[10px] text-gray-400 uppercase tracking-widest text-center opacity-60">
                Lamma Social &copy; {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
