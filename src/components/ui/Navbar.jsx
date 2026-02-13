import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Sun, Moon, Home, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { AuthContext } from "../../context/AuthContext";
import { Avatar } from "@heroui/react";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/authAPI";

export default function Navbar() {
    const { resolvedTheme, setTheme } = useTheme();

    const { userToken, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const { data: apiUser } = useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser,
        enabled: !!userToken,
    });

    const userData = apiUser;

    const isProfilePage = location.pathname === '/profile';

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] transition-all duration-300">

            <div className="
                flex items-center justify-between 
                px-8 py-4                                    
                max-w-7xl mx-auto                  
                
                backdrop-blur-2xl                    
                border border-white/10               
                
                bg-white/10                          
                dark:bg-[#0f0f11]/10                 

                shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)]      
                shadow-purple-500/40                 
                dark:shadow-purple-600/60            

                rounded-full transition-all duration-300
            ">

                <Link to="/" onClick={scrollToTop} className="flex items-center gap-3 group">
                    <div className="
                        w-10 h-10 rounded-xl 
                        bg-gradient-to-tr from-purple-600 to-pink-600 
                        flex items-center justify-center 
                        text-white font-bold text-xl 
                        shadow-lg shadow-purple-500/20
                        group-hover:scale-105 transition-transform duration-300
                    ">
                        L
                    </div>
                    <span className="font-bold text-lg tracking-wide hidden sm:block text-gray-800 dark:text-white group-hover:text-purple-500 transition-colors">
                        Lamma
                    </span>
                </Link>

                <div className="flex items-center gap-3">

                    <button
                        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                        className="
                            p-2.5 rounded-full transition-all duration-300
                            bg-gray-100 text-purple-600 hover:bg-gray-200 cursor-pointer
                            dark:bg-white/5 dark:text-yellow-400 dark:hover:bg-white/10 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20
                        "
                        title="Toggle Theme"
                    >
                        {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {userToken && (
                        <button
                            onClick={handleLogout}
                            className="
                                p-2.5 rounded-full hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300
                                bg-gray-100 text-red-500 hover:bg-red-100 cursor-pointer
                                dark:bg-white/5 dark:text-red-400 dark:hover:bg-red-500/20
                            "
                            title="Log Out"
                        >
                            <LogOut size={20} />
                        </button>
                    )}

                    {isProfilePage ? (
                        <Link to="/" onClick={scrollToTop} className="group relative" title="Home">
                            <div className="
                                relative w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300
                                bg-gray-100 border-gray-200 text-gray-600 hover:bg-purple-100 hover:text-purple-600 hover:border-purple-200
                                dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-purple-500/20 dark:hover:text-purple-400
                            ">
                                <Home size={20} />
                            </div>
                        </Link>
                    ) : (
                        <Link
                            to={userToken ? "/profile" : "/login"}
                            onClick={scrollToTop}
                            className="group relative block"
                            title={userToken ? "My Profile" : "Login"}
                        >
                            <div className="absolute -inset-0.5 rounded-full blur opacity-0 transition duration-300 bg-gradient-to-r from-pink-600 to-purple-600 group-hover:opacity-70"></div>

                            <div className="relative">
                                {userToken && userData?.photo ? (
                                    <Avatar
                                        src={userData.photo}
                                        className="w-10 h-10 transition-transform group-hover:scale-105"
                                        isBordered
                                        color="secondary"
                                    />
                                ) : (
                                    <div className="
                                        w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300
                                        bg-gray-100 border-gray-200 text-gray-600 group-hover:bg-gray-200
                                        dark:bg-white/10 dark:border-white/20 dark:text-white dark:group-hover:bg-white/20
                                    ">
                                        <User size={20} />
                                    </div>
                                )}
                            </div>
                        </Link>
                    )}

                </div>
            </div>
        </nav>
    );
}