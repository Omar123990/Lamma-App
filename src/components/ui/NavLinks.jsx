import { Link } from "react-router-dom";
import { Home, User, Bookmark } from "lucide-react";

export default function NavLinks({ userData, location, scrollToTop }) {
  const isInProfile = location.pathname.includes("/profile");
  const isHome =
    location.pathname === "/" || location.pathname.includes("/feed");
  const isSaved = location.pathname === "/saved";

  return (
    <ul className="flex items-center gap-1 sm:gap-4 md:gap-6">
      <li className="hidden sm:block">
        <Link
          to="/"
          onClick={scrollToTop}
          className={`group flex flex-col items-center px-3 py-1.5 rounded-2xl transition-all duration-300 ${
            isHome
              ? "text-purple-600 font-bold bg-purple-50 dark:bg-purple-500/10"
              : "text-gray-500 dark:text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/10"
          }`}
        >
          <Home
            size={20}
            className={`md:w-5.5 md:h-5.5 transition-all duration-300 group-hover:scale-110 group-hover:fill-purple-600/20 ${isHome ? "fill-purple-600/20" : ""}`}
          />
          <span className="hidden md:block text-[10px] mt-1 font-medium transition-all">
            Home
          </span>
        </Link>
      </li>

      <li className="hidden sm:block">
        <Link
          to={`/profile/${userData?._id}`}
          className={`group flex flex-col items-center px-3 py-1.5 rounded-2xl transition-all duration-300 ${
            isInProfile
              ? "text-purple-600 font-bold bg-purple-50 dark:bg-purple-500/10"
              : "text-gray-500 dark:text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/10"
          }`}
        >
          <User
            size={20}
            className={`md:w-5.5 md:h-5.5 transition-all duration-300 group-hover:scale-110 group-hover:fill-purple-600/20 ${isInProfile ? "fill-purple-600/20" : ""}`}
          />
          <span className="hidden md:block text-[10px] mt-1 font-medium transition-all">
            Profile
          </span>
        </Link>
      </li>

      <li className="hidden sm:block">
        <Link
          to="/saved"
          className={`group flex flex-col items-center px-3 py-1.5 rounded-2xl transition-all duration-300 ${
            isSaved
              ? "text-purple-600 font-bold bg-purple-50 dark:bg-purple-500/10"
              : "text-gray-500 dark:text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/10"
          }`}
        >
          <Bookmark
            size={20}
            className={`md:w-5.5 md:h-5.5 transition-all duration-300 group-hover:scale-110 group-hover:fill-purple-600/20 ${isSaved ? "fill-purple-600/20" : ""}`}
          />
          <span className="hidden md:block text-[10px] mt-1 font-medium transition-all">
            Saved
          </span>
        </Link>
      </li>
    </ul>
  );
}
